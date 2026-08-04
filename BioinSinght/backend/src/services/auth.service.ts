import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import { env } from '../config/env';
import { ApiError } from '../utils/ApiError';
import { UserRepository } from '../repositories/user.repository';
import type { UserEntity } from '../entities/user.entity';

type AppUser = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
};

type AuthUser = Pick<AppUser, 'id' | 'firstName' | 'lastName' | 'email'>;

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

function toAuthUser(user: UserEntity): AuthUser {
  return {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
  };
}

function createToken(user: AuthUser) {
  return jwt.sign(user, env.jwtSecret, {
    expiresIn: env.jwtExpiresIn as jwt.SignOptions['expiresIn'],
  });
}

export class AuthService {
  static async register(input: RegisterInput) {
    const existingUser = await UserRepository.findByEmail(input.email);

    if (existingUser) {
      throw new ApiError(409, 'El correo ya está registrado.');
    }

    const hashedPassword = await bcrypt.hash(input.password, 10);
    const user = await UserRepository.create({
      ...input,
      email: input.email.toLowerCase(),
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