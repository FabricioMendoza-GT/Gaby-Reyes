import { Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

import type { HealthInterest } from '../types/user';

@Entity({ name: 'users' })
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'first_name' })
  firstName!: string;

  @Column({ name: 'last_name' })
  lastName!: string;

  @Index({ unique: true })
  @Column({ unique: true })
  email!: string;

  @Column({ select: false })
  password!: string;

  @Column('text', { name: 'health_interests', array: true, default: () => 'ARRAY[]::text[]' })
  healthInterests!: HealthInterest[];

  @Column({ name: 'notifications_enabled', default: true })
  notificationsEnabled!: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
}
