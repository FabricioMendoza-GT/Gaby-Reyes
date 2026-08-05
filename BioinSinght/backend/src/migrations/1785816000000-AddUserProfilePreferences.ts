import type { MigrationInterface, QueryRunner } from 'typeorm';

export class AddUserProfilePreferences1785816000000 implements MigrationInterface {
  name = 'AddUserProfilePreferences1785816000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "health_interests" text[] NOT NULL DEFAULT ARRAY[]::text[]',
    );
    await queryRunner.query(
      'ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "notifications_enabled" boolean NOT NULL DEFAULT true',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE "users" DROP COLUMN "notifications_enabled"');
    await queryRunner.query('ALTER TABLE "users" DROP COLUMN "health_interests"');
  }
}
