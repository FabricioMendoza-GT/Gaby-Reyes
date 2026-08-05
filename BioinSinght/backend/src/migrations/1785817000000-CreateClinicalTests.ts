import type { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateClinicalTests1785817000000 implements MigrationInterface {
  name = 'CreateClinicalTests1785817000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "clinical_tests" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "user_id" uuid NOT NULL,
        "category" character varying(20) NOT NULL,
        "test_type" character varying(50) NOT NULL,
        "test_name" character varying(120) NOT NULL,
        "measured_at" TIMESTAMP WITH TIME ZONE NOT NULL,
        "value" numeric(12,4) NOT NULL,
        "unit" character varying(30) NOT NULL,
        "reference_min" numeric(12,4),
        "reference_max" numeric(12,4),
        "status" character varying(20) NOT NULL,
        "notes" text,
        "source_mode" character varying(20) NOT NULL DEFAULT 'manual',
        "attachment_name" character varying(255),
        "attachment_mime_type" character varying(100),
        "attachment_data" bytea,
        "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        CONSTRAINT "PK_clinical_tests_id" PRIMARY KEY ("id"),
        CONSTRAINT "FK_clinical_tests_user" FOREIGN KEY ("user_id")
          REFERENCES "users"("id") ON DELETE CASCADE,
        CONSTRAINT "CHK_clinical_tests_category"
          CHECK ("category" IN ('diabetes', 'cardio', 'renal', 'general')),
        CONSTRAINT "CHK_clinical_tests_status"
          CHECK ("status" IN ('normal', 'warning', 'high', 'low', 'unclassified')),
        CONSTRAINT "CHK_clinical_tests_source_mode"
          CHECK ("source_mode" IN ('manual', 'document'))
      )
    `);
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "IDX_clinical_tests_user_measured_at"
      ON "clinical_tests" ("user_id", "measured_at" DESC)
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP INDEX IF EXISTS "IDX_clinical_tests_user_measured_at"');
    await queryRunner.query('DROP TABLE IF EXISTS "clinical_tests"');
  }
}
