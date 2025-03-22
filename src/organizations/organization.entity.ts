import { Column, Entity, OneToMany } from 'typeorm';
import { Location } from '@/locations/location.entity';
import { BaseEntity } from '@/db/base.entity';

@Entity('organizations')
export class Organization extends BaseEntity {
  @Column({ type: 'varchar', length: 225 })
  name: string;

  @OneToMany(() => Location, (location) => location.organization)
  locations: Location[];
}
