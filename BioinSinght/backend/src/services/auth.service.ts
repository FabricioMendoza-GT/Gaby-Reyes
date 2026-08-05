import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import { env } from '../config/env';
import { ApiError } from '../utils/ApiError';
import { UserRepository } from '../repositories/user.repository';
import type { UserEntity } from '../entities/user.entity';
import type { AuthUser } from '../types/user';

type RegisterInput = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
};

type LoginInput = {
  email: string;
  password: string;
};

export function toAuthUser(user: UserEntity): AuthUser {
  return {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    healthInterests: user.healthInterests ?? [],
    notificationsEnabled: user.notificationsEnabled ?? true,
  };
}

function createToken(user: AuthUser) {
  return jwt.sign(
    {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
    },
    env.jwtSecret,
    {
    expiresIn: env.jwtExpiresIn as jwt.SignOptions['expiresIn'],
    },
  );
}

export class AuthService {
  static async register(input: RegisterInput) {
    const normalizedEmail = input.email.toLowerCase();
    const existingUser = await UserRepository.findByEmail(normalizedEmail);

    if (existingUser) {
      throw new ApiError(409, 'El correo ya está registrado.');
    }

    const hashedPassword = await bcrypt.hash(input.password, 10);
    const user = await UserRepository.create({
      ...input,
      firstName: input.firstName.trim(),
      lastName: input.lastName.trim(),
      email: normalizedEmail,
      password: hashedPassword,
    });

    const authUser = toAuthUser(user);

    return {
      user: authUser,
      token: createToken(authUser),
    };
  }

  static async login(input: LoginInput) {
    const user = await UserRepository.findByEmail(input.email.toLowerCase());

    if (!user) {
      throw new ApiError(401, 'Credenciales inválidas.');
    }

    const passwordMatches = await bcrypt.compare(input.password, user.password);

    if (!passwordMatches) {
      throw new ApiError(401, 'Credenciales inválidas.');
    }

    const authUser = toAuthUser(user);

    return {
      user: authUser,
      token: createToken(authUser),
    };
  }

  static async me(userId: string) {
    const user = await UserRepository.findById(userId);

    if (!user) {
      throw new ApiError(404, 'Usuario no encontrado.');
    }

    return toAuthUser(user);
  }
}
