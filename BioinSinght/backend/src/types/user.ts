export const HEALTH_INTERESTS = ['diabetes', 'cardio', 'renal', 'general'] as const;

export type HealthInterest = (typeof HEALTH_INTERESTS)[number];

export type AppUser = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  healthInterests: HealthInterest[];
  notificationsEnabled: boolean;
};

export type AuthUser = Pick<
  AppUser,
  'id' | 'firstName' | 'lastName' | 'email' | 'healthInterests' | 'notificationsEnabled'
>;

export type AuthIdentity = Pick<AppUser, 'id' | 'firstName' | 'lastName' | 'email'>;
