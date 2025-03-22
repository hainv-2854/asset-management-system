import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Location } from '@/locations/location.entity';
import { BaseEntity } from '@/db/base.entity';
import { DeviceStatus } from './device.enum';

@Entity('devices')
export class Device extends BaseEntity {
  @Column({ type: 'varchar', length: 225 })
  type: string;

  @Column({ type: 'varchar', length: 225 })
  serial: string;

  @Column({ type: 'varchar', default: DeviceStatus.UNACTIVE, length: 1000 })
  description: string;

  @Column({ type: 'varchar', length: 225 })
  status: DeviceStatus;

  @Column({
    name: 'location_id',
    type: 'int',
    unsigned: true,
  })
  locationId: number;

  @ManyToOne(() => Location, (location) => location.devices)
  @JoinColumn({ name: 'location_id' })
  location: Location;
}
