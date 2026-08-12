import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { apiRequest } from '../services/api';
import { getStoredToken, removeStoredToken, storeToken } from '../services/sessionStorage';
import type { AuthResult, AuthUser, HealthInterest } from '../types/auth';

type LoginInput = { email: string; password: string };
type RegisterInput = LoginInput & { firstName: string; lastName: string };
type UpdateProfileInput = Partial<Pick<AuthUser, 'firstName' | 'lastName' | 'email'>>;

type AuthContextValue = {
  loading: boolean;
  user: AuthUser | null;
  login: (input: LoginInput) => Promise<void>;
  register: (input: RegisterInput) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (input: UpdateProfileInput) => Promise<void>;
  updatePreferences: (healthInterests: HealthInterest[], notificationsEnabled: boolean) => Promise<void>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function normalizeAuthUser(user: AuthUser | undefined | null): AuthUser {
  return {
    id: user?.id ?? '',
    firstName: user?.firstName ?? '',
    lastName: user?.lastName ?? '',
    email: user?.email ?? '',
    healthInterests: user?.healthInterests ?? [],
    notificationsEnabled: user?.notificationsEnabled ?? true,
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    void (async () => {
      try {
        const storedToken = await getStoredToken();

        if (!storedToken) return;

        const storedUser = await apiRequest<AuthUser>('/auth/me', {}, storedToken);
        setToken(storedToken);
        setUser(normalizeAuthUser(storedUser));
      } catch {
        await removeStoredToken();
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const applySession = useCallback(async (result: AuthResult) => {
    await storeToken(result.token);
    setToken(result.token);
    setUser(normalizeAuthUser(result.user));
  }, []);

  const login = useCallback(async (input: LoginInput) => {
    const result = await apiRequest<AuthResult>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(input),
    });
    await applySession(result);
  }, [applySession]);

  const register = useCallback(async (input: RegisterInput) => {
    const result = await apiRequest<AuthResult>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(input),
    });
    await applySession(result);
  }, [applySession]);

  const logout = useCallback(async () => {
    await removeStoredToken();
    setToken(null);
    setUser(null);
  }, []);

  const updateProfile = useCallback(async (input: UpdateProfileInput) => {
    const updatedUser = await apiRequest<AuthUser>('/profile', {
      method: 'PATCH',
      body: JSON.stringify(input),
    }, token);
    setUser(normalizeAuthUser(updatedUser));
  }, [token]);

  const updatePreferences = useCallback(async (
    healthInterests: HealthInterest[],
    notificationsEnabled: boolean,
  ) => {
    const updatedUser = await apiRequest<AuthUser>('/profile/preferences', {
      method: 'PUT',
      body: JSON.stringify({ healthInterests, notificationsEnabled }),
    }, token);
    setUser(normalizeAuthUser(updatedUser));
  }, [token]);

  const changePassword = useCallback(async (currentPassword: string, newPassword: string) => {
    await apiRequest<null>('/profile/password', {
      method: 'PUT',
      body: JSON.stringify({ currentPassword, newPassword }),
    }, token);
  }, [token]);

  const value = useMemo<AuthContextValue>(() => ({
    loading,
    user,
    login,
    register,
    logout,
    updateProfile,
    updatePreferences,
    changePassword,
  }), [loading, user, login, register, logout, updateProfile, updatePreferences, changePassword]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth debe utilizarse dentro de AuthProvider.');
  }

  return context;
}
