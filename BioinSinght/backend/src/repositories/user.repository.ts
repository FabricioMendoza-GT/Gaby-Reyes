import { AppDataSource } from '../config/data-source';
import { UserEntity } from '../entities/user.entity';

type CreateUserInput = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
};

export class UserRepository {
  private static repository() {
    return AppDataSource.getRepository(UserEntity);
  }

  static findByEmail(email: string): Promise<UserEntity | null> {
    return this.repository().findOne({
      where: { email },
      select: ['id', 'firstName', 'lastName', 'email', 'password', 'createdAt', 'updatedAt'],
    });
  }

  static findById(id: string): Promise<UserEntity | null> {
    return this.repository().findOne({
      where: { id },
      select: ['id', 'firstName', 'lastName', 'email', 'password', 'createdAt', 'updatedAt'],
    });
  }

  static create(data: CreateUserInput): Promise<UserEntity> {
    const user = this.repository().create(data);

    return this.repository().save(user);
  }
}