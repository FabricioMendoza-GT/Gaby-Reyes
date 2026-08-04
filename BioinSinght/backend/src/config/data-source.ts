import 'reflect-metadata';

import { DataSource } from 'typeorm';

import { env } from './env';
import { UserEntity } from '../entities/user.entity';

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: env.databaseUrl,
  entities: [UserEntity],
  migrations: ['src/migrations/*.ts'],
  synchronize: false,
  logging: false,
  ssl: {
    rejectUnauthorized: false,
  },
});