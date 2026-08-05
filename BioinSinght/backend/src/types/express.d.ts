import type { AuthIdentity } from './user';

declare global {
  namespace Express {
    interface Request {
      authUser?: AuthIdentity;
    }
  }
}

export {};
