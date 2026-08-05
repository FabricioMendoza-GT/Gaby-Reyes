import { AppDataSource } from '../config/data-source';
import { UserEntity } from '../entities/user.entity';
import type { HealthInterest } from '../types/user';

type CreateUserInput = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
};

export type UpdateUserInput = Partial<{
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  healthInterests: HealthInterest[];
  notificationsEnabled: boolean;
}>;

export class UserRepository {
  private static repository() {
    return AppDataSource.getRepository(UserEntity);
  }

  static findByEmail(email: string): Promise<UserEntity | null> {
    return this.repository().findOne({
      where: { email },
      select: [
        'id',
        'firstName',
        'lastName',
        'email',
        'password',
        'healthInterests',
        'notificationsEnabled',
        'createdAt',
        'updatedAt',
      ],
    });
  }

  static findById(id: string): Promise<UserEntity | null> {
    return this.repository().findOne({ where: { id } });
  }

  static findByIdWithPassword(id: string): Promise<UserEntity | null> {
    return this.repository().findOne({
      where: { id },
      select: [
        'id',
        'firstName',
        'lastName',
        'email',
        'password',
        'healthInterests',
        'notificationsEnabled',
        'createdAt',
        'updatedAt',
      ],
    });
  }

  static create(data: CreateUserInput): Promise<UserEntity> {
    const user = this.repository().create(data);

    return this.repository().save(user);
  }

  static async update(user: UserEntity, data: UpdateUserInput): Promise<UserEntity> {
    this.repository().merge(user, data);

    return this.repository().save(user);
  }

  static async deleteById(id: string): Promise<void> {
    await this.repository().delete(id);
  }
}
