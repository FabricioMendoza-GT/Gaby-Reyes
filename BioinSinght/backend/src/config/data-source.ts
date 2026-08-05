import 'reflect-metadata';

import { DataSource } from 'typeorm';

import { env } from './env';
import { ClinicalTestEntity } from '../entities/clinical-test.entity';
import { UserEntity } from '../entities/user.entity';

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: env.databaseUrl,
  entities: [UserEntity, ClinicalTestEntity],
  migrations: [`${__dirname}/../migrations/*{.ts,.js}`],
  synchronize: false,
  logging: false,
  ssl: {
    rejectUnauthorized: false,
  },
});
