import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { useAuth } from './AuthContext';
import {
  createClinicalTest,
  listClinicalTests,
} from '../services/clinicalTests';
import type { ClinicalTest, CreateClinicalTestInput } from '../types/clinicalTest';

type ClinicalTestsContextValue = {
  tests: ClinicalTest[];
  loading: boolean;
  error: string;
  refresh: () => Promise<void>;
  addTest: (input: CreateClinicalTestInput) => Promise<ClinicalTest>;
};

const ClinicalTestsContext = createContext<ClinicalTestsContextValue | undefined>(undefined);

export function ClinicalTestsProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [tests, setTests] = useState<ClinicalTest[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const interestsKey = user?.healthInterests?.join(',') ?? '';

  const refresh = useCallback(async () => {
    if (!user) {
      setTests([]);
      return;
    }

    try {
      setLoading(true);
      setError('');
      setTests(await listClinicalTests());
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'No se pudieron cargar las pruebas.');
    } finally {
      setLoading(false);
    }
  }, [user?.id, interestsKey]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const addTest = useCallback(async (input: CreateClinicalTestInput) => {
    const created = await createClinicalTest(input);
    setTests((current) => [created, ...current]);
    return created;
  }, []);

  const value = useMemo(() => ({ tests, loading, error, refresh, addTest }), [
    tests,
    loading,
    error,
    refresh,
    addTest,
  ]);

  return <ClinicalTestsContext.Provider value={value}>{children}</ClinicalTestsContext.Provider>;
}

export function useClinicalTests() {
  const context = useContext(ClinicalTestsContext);
  if (!context) throw new Error('useClinicalTests debe utilizarse dentro de ClinicalTestsProvider.');
  return context;
}
