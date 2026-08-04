export type AppUser = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
};

export type AuthUser = Pick<AppUser, 'id' | 'firstName' | 'lastName' | 'email'>;