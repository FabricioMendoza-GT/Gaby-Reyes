export const HEALTH_INTERESTS = ['diabetes', 'cardio', 'renal', 'general'] as const;

export type HealthInterest = (typeof HEALTH_INTERESTS)[number];

export type AuthUser = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  healthInterests: HealthInterest[];
  notificationsEnabled: boolean;
};

export type AuthResult = {
  user: AuthUser;
  token: string;
};
