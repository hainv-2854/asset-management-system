import { Module } from '@nestjs/common';
import { OrganizationsModule } from './organizations/organizations.module';
import { LocationsModule } from './locations/locations.module';
import { DevicesModule } from './devices/devices.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dataSourceOptions } from './db/data-source';
import { ScheduleModule } from '@nestjs/schedule';
import { SyncDeviceService } from './devices/sync-device.service';
import { HttpModule } from '@nestjs/axios';
import { SeedCommand } from './commands/seed.command';

@Module({
  imports: [
    TypeOrmModule.forRoot(dataSourceOptions),
    OrganizationsModule,
    LocationsModule,
    DevicesModule,
    ScheduleModule.forRoot(),
    HttpModule,
  ],
  providers: [SyncDeviceService, SeedCommand],
})
export class AppModule {}
