import Constants from 'expo-constants';
import { Platform } from 'react-native';

type ApiSuccess<T> = {
  success: true;
  message: string;
  data: T;
};

type ApiFailure = {
  success: false;
  message: string;
  errors?: string[];
};

const configuredApiUrl = process.env.EXPO_PUBLIC_API_URL?.trim();
const expoHost = Constants.expoConfig?.hostUri?.split(':')[0];

const fallbackApiUrl = Platform.OS === 'android'
  ? 'http://10.0.2.2:4000/api'
  : 'http://localhost:4000/api';

const detectedApiUrl = expoHost
  ? `http://${expoHost}:4000/api`
  : fallbackApiUrl;

export const API_URL = (
  configuredApiUrl || detectedApiUrl
).replace(/\/+$/, '');

console.log('BioinSight API_URL:', API_URL);


export class ApiClientError extends Error {
  readonly errors: string[];

  constructor(message: string, errors: string[] = []) {
    super(message);
    this.name = 'ApiClientError';
    this.errors = errors;
  }
}

export async function apiRequest<T>(
  path: string,
  options: RequestInit = {},
  token?: string | null,
): Promise<T> {
  let response: Response;

  try {
    response = await fetch(`${API_URL}${path}`, {
      ...options,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,
      },
    });
    } catch (error) {
    const detail = error instanceof Error
      ? error.message
      : String(error);

    console.error('BioinSight API error:', {
      url: `${API_URL}${path}`,
      detail,
    });

    throw new ApiClientError(
      `No se pudo conectar con ${API_URL}. ${detail}`,
    );
  }

  const payload = (await response.json().catch(() => null)) as ApiSuccess<T> | ApiFailure | null;

  if (!response.ok || !payload?.success) {
    throw new ApiClientError(
      payload?.message ?? 'El servidor no pudo completar la solicitud.',
      payload && 'errors' in payload ? payload.errors : [],
    );
  }

  return payload.data;
}
