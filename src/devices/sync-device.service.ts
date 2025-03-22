import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { HttpService } from '@nestjs/axios';
import { DataSource, DeepPartial } from 'typeorm';
import { firstValueFrom } from 'rxjs';
import { Location } from '@/locations/location.entity';
import { DeviceStatus } from './device.enum';
import { LocationStatus } from '@/locations/location.enum';
import { Device } from './device.entity';

interface DeviceType {
  id: number;
  type: string;
  serial: string;
  status: DeviceStatus;
  description: string;
  created_at: number;
  updated_at: number;
  location_id: number;
}

@Injectable()
export class SyncDeviceService {
  private readonly logger = new Logger(SyncDeviceService.name);

  constructor(
    private readonly httpService: HttpService,
    private readonly dataSource: DataSource,
  ) {}

  @Cron('0 0 * * *')
  async handleCron() {
    this.logger.log('Starting asset synchronization...');

    const url = 'https://669ce22d15704bb0e304842d.mockapi.io/assets';
    try {
      const response = await firstValueFrom(this.httpService.get(url));
      const assets = response.data as DeviceType[];
      const locationsActive = await this.dataSource
        .getRepository(Location)
        .find({ where: { status: LocationStatus.ACTIVED } });
      const locationsActiveMap = locationsActive.reduce((ob, la) => {
        ob[la.id] = la;
        return ob;
      }, {});
      const validAssets = this.modifyDataAssets(assets, locationsActiveMap);

      const devices = await this.dataSource.getRepository(Device).find();
      // Assuming serial is unique, update if it exists, otherwise insert new
      const deviceMap = new Map(
        devices.map((device) => [device.serial, device]),
      );

      await this.dataSource.transaction(async (manager) => {
        const dataUpdate: DeepPartial<Device>[] = [];
        const dataInsert: DeepPartial<Device>[] = [];

        // If there is a lot of data, it can be chunked to process in parts
        for (const asset of validAssets) {
          const device = asset.serial ? deviceMap.get(asset.serial) : undefined;

          if (device) {
            dataUpdate.push({
              ...asset,
              id: device.id,
            });
          } else {
            dataInsert.push(asset);
          }
        }

        if (dataUpdate.length) {
          await manager.getRepository(Device).save(dataUpdate);
        }
        if (dataInsert.length) {
          await manager.getRepository(Device).insert(dataInsert);
        }
      });

      this.logger.log('Asset synchronization completed.');
    } catch (error) {
      this.logger.error('Error during synchronization:', error);
    }
  }

  modifyDataAssets(
    assets: DeviceType[],
    locationsActiveMap: Record<number, Location>,
  ) {
    const validAssets: DeepPartial<Device>[] = [];

    assets.forEach((asset) => {
      if (
        new Date(asset.created_at * 1000) < new Date() &&
        locationsActiveMap[asset.location_id]
      ) {
        validAssets.push({
          ...asset,
          locationId: asset.location_id,
          createdAt: new Date(asset.created_at * 1000),
          updatedAt: new Date(asset.updated_at * 1000),
        });
      }
    });

    return validAssets;
  }
}
