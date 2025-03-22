import { DataSource, DataSourceOptions } from 'typeorm';
import { config } from 'dotenv';
import { Location } from '@/locations/location.entity';
import { Organization } from '@/organizations/organization.entity';
import { Device } from '@/devices/device.entity';

config();

export const dataSourceOptions: DataSourceOptions = {
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'root',
  password: 'password',
  database: 'asset_management',
  synchronize: false,
  entities: [Location, Organization, Device],
  migrations: ['dist/db/migrations/*{.ts,.js}'],
  logging: process.env.NODE_ENV !== 'production',
  extra: {
    charset: 'utf8mb4',
  },
  charset: 'utf8mb4',
  supportBigNumbers: true,
  bigNumberStrings: false,
};

const dataSource = new DataSource(dataSourceOptions);
export default dataSource;
