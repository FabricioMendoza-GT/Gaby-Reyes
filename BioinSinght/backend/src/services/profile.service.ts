import bcrypt from 'bcryptjs';

import { UserRepository } from '../repositories/user.repository';
import type { HealthInterest } from '../types/user';
import { ApiError } from '../utils/ApiError';
import { toAuthUser } from './auth.service';

type UpdateProfileInput = Partial<{
  firstName: string;
  lastName: string;
  email: string;
}>;

type UpdatePreferencesInput = {
  healthInterests: HealthInterest[];
  notificationsEnabled: boolean;
};

type ChangePasswordInput = {
  currentPassword: string;
  newPassword: string;
};

async function requireUser(userId: string) {
  const user = await UserRepository.findById(userId);

  if (!user) {
    throw new ApiError(404, 'Usuario no encontrado.');
  }

  return user;
}

export class ProfileService {
  static async get(userId: string) {
    return toAuthUser(await requireUser(userId));
  }

  static async update(userId: string, input: UpdateProfileInput) {
    const user = await requireUser(userId);
    const email = input.email?.toLowerCase();

    if (email && email !== user.email) {
      const existingUser = await UserRepository.findByEmail(email);

      if (existingUser && existingUser.id !== userId) {
        throw new ApiError(409, 'El correo ya está registrado.');
      }
    }

    const updatedUser = await UserRepository.update(user, {
      ...(input.firstName !== undefined && { firstName: input.firstName.trim() }),
      ...(input.lastName !== undefined && { lastName: input.lastName.trim() }),
      ...(email !== undefined && { email }),
    });

    return toAuthUser(updatedUser);
  }

  static async updatePreferences(userId: string, input: UpdatePreferencesInput) {
    const user = await requireUser(userId);
    const healthInterests = [...new Set(input.healthInterests)];
    const updatedUser = await UserRepository.update(user, {
      healthInterests,
      notificationsEnabled: input.notificationsEnabled,
    });

    return toAuthUser(updatedUser);
  }

  static async changePassword(userId: string, input: ChangePasswordInput) {
    const user = await UserRepository.findByIdWithPassword(userId);

    if (!user) {
      throw new ApiError(404, 'Usuario no encontrado.');
    }

    const passwordMatches = await bcrypt.compare(input.currentPassword, user.password);

    if (!passwordMatches) {
      throw new ApiError(400, 'La contraseña actual no es correcta.');
    }

    if (input.currentPassword === input.newPassword) {
      throw new ApiError(400, 'La nueva contraseña debe ser diferente a la actual.');
    }

    await UserRepository.update(user, {
      password: await bcrypt.hash(input.newPassword, 10),
    });
  }
}
