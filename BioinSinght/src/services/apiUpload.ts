import { API_URL, ApiClientError } from './api';

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

export async function apiFormRequest<T>(
  path: string,
  form: FormData,
  token?: string | null,
): Promise<T> {
  let response: Response;

  try {
    response = await fetch(`${API_URL}${path}`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: form,
    });
  } catch (error) {
    const detail = error instanceof Error ? error.message : String(error);
    console.error('BioinSight upload error:', { url: `${API_URL}${path}`, detail });
    throw new ApiClientError(`No se pudo cargar la prueba. ${detail}`);
  }

  const payload = (await response.json().catch(() => null)) as ApiSuccess<T> | ApiFailure | null;

  if (!response.ok || !payload?.success) {
    throw new ApiClientError(
      payload?.message ?? 'El servidor no pudo completar la carga.',
      payload && 'errors' in payload ? payload.errors : [],
    );
  }

  return payload.data;
}
