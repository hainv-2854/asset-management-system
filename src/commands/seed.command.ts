import { Organization } from '@/organizations/organization.entity';
import { Location } from '@/locations/location.entity';
import { Command, CommandRunner } from 'nest-commander';
import { DataSource, DeepPartial } from 'typeorm';
import { LocationStatus } from '@/locations/location.enum';

@Command({ name: 'seed', description: 'Seed initial data into database' })
export class SeedCommand extends CommandRunner {
  constructor(private readonly dataSource: DataSource) {
    super();
  }

  async run(): Promise<void> {
    console.log('Seeding data...');
    await this.dataSource.transaction(async (manager) => {
      await manager.getRepository(Organization).save([
        { id: 1, name: 'PNS' },
        { id: 2, name: 'PLJ' },
      ]);

      const locations: DeepPartial<Location>[] = [
        {
          id: 1,
          name: 'Da Nang',
          status: LocationStatus.ACTIVED,
          organizationId: 1,
        },
        {
          id: 2,
          name: 'Ha Noi',
          status: LocationStatus.UNACTIVE,
          organizationId: 1,
        },
        {
          id: 3,
          name: 'Ho Chi Minh',
          status: LocationStatus.ACTIVED,
          organizationId: 1,
        },
        {
          id: 4,
          name: 'Nha Trang',
          status: LocationStatus.ACTIVED,
          organizationId: 2,
        },
        {
          id: 5,
          name: 'Can Tho',
          status: LocationStatus.ACTIVED,
          organizationId: 2,
        },
      ];
      await manager.getRepository(Location).save(locations);
    });

    console.log('Seeding completed successfully!');
  }
}
