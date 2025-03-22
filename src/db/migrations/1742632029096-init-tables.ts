import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitTables1742632029096 implements MigrationInterface {
  name = 'InitTables1742632029096';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`organizations\` (
      \`id\` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
      \`name\` varchar(225) NOT NULL,
      \`created_at\` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      \`updated_at\` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE NOW(),
      \`deleted_at\` timestamp(6) NULL,
      PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`devices\` (
      \`id\` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
      \`type\` varchar(225) NOT NULL,
      \`serial\` varchar(225) NOT NULL,
      \`description\` varchar(1000) NOT NULL DEFAULT 'unactive',
      \`status\` varchar(225) NOT NULL,
      \`location_id\` bigint UNSIGNED NOT NULL,
      \`created_at\` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      \`updated_at\` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE NOW(),
      \`deleted_at\` timestamp(6) NULL,
      PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`locations\` (
      \`id\` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
      \`name\` varchar(225) NOT NULL,
      \`status\` varchar(255) NOT NULL DEFAULT 'unactive',
      \`organization_id\` bigint UNSIGNED NOT NULL,
      \`created_at\` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      \`updated_at\` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE NOW(),
      \`deleted_at\` timestamp(6) NULL,
      PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`devices\` ADD CONSTRAINT \`FK_3339609cb36cca36db0119e70e4\` FOREIGN KEY (\`location_id\`) REFERENCES \`locations\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`locations\` ADD CONSTRAINT \`FK_e80aa366acb3dbc300e668c3ee2\` FOREIGN KEY (\`organization_id\`) REFERENCES \`organizations\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`locations\` DROP FOREIGN KEY \`FK_e80aa366acb3dbc300e668c3ee2\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`devices\` DROP FOREIGN KEY \`FK_3339609cb36cca36db0119e70e4\``,
    );
    await queryRunner.query(`DROP TABLE \`locations\``);
    await queryRunner.query(`DROP TABLE \`devices\``);
    await queryRunner.query(`DROP TABLE \`organizations\``);
  }
}
