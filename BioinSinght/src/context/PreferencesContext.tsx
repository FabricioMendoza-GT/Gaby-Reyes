import { createContext, type ReactNode, useContext, useMemo } from 'react';

import type { HealthInterest } from '../types/auth';
import { useAuth } from './AuthContext';

type PreferencesContextValue = {
  selectedInterests: HealthInterest[];
  notificationsEnabled: boolean;
  savePreferences: (interests: HealthInterest[], notificationsEnabled?: boolean) => Promise<void>;
};

const PreferencesContext = createContext<PreferencesContextValue | undefined>(undefined);

export function PreferencesProvider({ children }: { children: ReactNode }) {
  const { user, updatePreferences } = useAuth();
  const selectedInterests = user?.healthInterests ?? [];
  const notificationsEnabled = user?.notificationsEnabled ?? true;
  const value = useMemo(() => ({
    selectedInterests,
    notificationsEnabled,
    savePreferences: (interests: HealthInterest[], enabled = notificationsEnabled) => (
      updatePreferences(interests, enabled)
    ),
  }), [selectedInterests, notificationsEnabled, updatePreferences]);

  return <PreferencesContext.Provider value={value}>{children}</PreferencesContext.Provider>;
}

export function usePreferences() {
  const context = useContext(PreferencesContext);
  if (!context) throw new Error('usePreferences debe utilizarse dentro de PreferencesProvider.');
  return context;
}
