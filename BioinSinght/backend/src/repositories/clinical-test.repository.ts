import { In } from 'typeorm';

import { AppDataSource } from '../config/data-source';
import { ClinicalTestEntity } from '../entities/clinical-test.entity';
import type { HealthInterest } from '../types/user';

export class ClinicalTestRepository {
  private static repository() {
    return AppDataSource.getRepository(ClinicalTestEntity);
  }

  static listForUser(userId: string, categories: HealthInterest[]) {
    if (!categories.length) return Promise.resolve([]);

    return this.repository().find({
      where: { userId, category: In(categories) },
      order: { measuredAt: 'DESC', createdAt: 'DESC' },
      take: 250,
    });
  }

  static create(data: Partial<ClinicalTestEntity>) {
    return this.repository().save(this.repository().create(data));
  }

  static findAttachment(userId: string, id: string) {
    return this.repository()
      .createQueryBuilder('test')
      .addSelect('test.attachmentData')
      .where('test.id = :id', { id })
      .andWhere('test.userId = :userId', { userId })
      .getOne();
  }
}
