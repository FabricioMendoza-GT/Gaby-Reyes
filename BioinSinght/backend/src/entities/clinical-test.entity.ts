import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { UserEntity } from './user.entity';
import type {
  ClinicalTestSourceMode,
  ClinicalTestStatus,
  ClinicalTestType,
} from '../types/clinical-test';
import type { HealthInterest } from '../types/user';

const numberTransformer = {
  to: (value: number | null) => value,
  from: (value: string | null) => value === null ? null : Number(value),
};

@Entity({ name: 'clinical_tests' })
@Index('IDX_clinical_tests_user_measured_at', ['userId', 'measuredAt'])
export class ClinicalTestEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column('uuid', { name: 'user_id' })
  userId!: string;

  @ManyToOne(() => UserEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user!: UserEntity;

  @Column({ type: 'varchar', length: 20 })
  category!: HealthInterest;

  @Column({
    name: 'test_type',
    type: 'varchar',
    length: 50,
  })
  testType!: ClinicalTestType;

  @Column({
    name: 'test_name',
    type: 'varchar',
    length: 120,
  })
  testName!: string;

  @Column({ name: 'measured_at', type: 'timestamptz' })
  measuredAt!: Date;

  @Column('decimal', { precision: 12, scale: 4, transformer: numberTransformer })
  value!: number;

  @Column({
    type: 'varchar',
    length: 30,
  })
  unit!: string;

  @Column('decimal', {
    name: 'reference_min',
    precision: 12,
    scale: 4,
    nullable: true,
    transformer: numberTransformer,
  })
  referenceMin!: number | null;

  @Column('decimal', {
    name: 'reference_max',
    precision: 12,
    scale: 4,
    nullable: true,
    transformer: numberTransformer,
  })
  referenceMax!: number | null;

  @Column({
    type: 'varchar',
    length: 20,
  })
  status!: ClinicalTestStatus;

  @Column('text', { nullable: true })
  notes!: string | null;

  @Column({
    name: 'source_mode',
    type: 'varchar',
    length: 20,
  })
  sourceMode!: ClinicalTestSourceMode;

  @Column({
    name: 'attachment_name',
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  attachmentName!: string | null;

  @Column({
    name: 'attachment_mime_type',
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  attachmentMimeType!: string | null;

  @Column('bytea', { name: 'attachment_data', nullable: true, select: false })
  attachmentData!: Buffer | null;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt!: Date;
}
