import { Organization } from '@/organizations/organization.entity';
import { Device } from '@/devices/device.entity';

import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from '@/db/base.entity';
import { LocationStatus } from './location.enum';

@Entity('locations')
export class Location extends BaseEntity {
  @Column({ type: 'varchar', length: 225 })
  name: string;

  @Column({ default: LocationStatus.UNACTIVE })
  status: LocationStatus;

  @Column({
    name: 'organization_id',
    type: 'int',
    unsigned: true,
  })
  organizationId: number;

  @ManyToOne(() => Organization, (organization) => organization.locations)
  @JoinColumn({ name: 'organization_id' })
  organization: Organization;

  @OneToMany(() => Device, (device) => device.location)
  devices: Device[];
}
