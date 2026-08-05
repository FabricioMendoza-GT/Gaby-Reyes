import type { AddressInfo } from 'node:net';
import { once } from 'node:events';

import app from '../app';
import { AppDataSource } from '../config/data-source';
import { UserRepository } from '../repositories/user.repository';

type ApiResponse<T> = {
  success: boolean;
  message: string;
  data: T;
  errors?: string[];
};

type AuthPayload = {
  user: { id: string };
  token: string;
};

type ClinicalTestPayload = {
  id: string;
  testType: string;
  status: string;
  hasAttachment: boolean;
};

async function main() {
  await AppDataSource.initialize();
  const server = app.listen(0);
  await once(server, 'listening');
  const address = server.address() as AddressInfo;
  const baseUrl = `http://127.0.0.1:${address.port}/api`;
  const testEmail = `bioinsight.smoke.${Date.now()}@example.com`;
  const firstPassword = 'BioinSight-2026!';
  const secondPassword = 'BioinSight-2026-OK!';
  let userId: string | undefined;

  async function request<T>(path: string, init: RequestInit = {}) {
    const isFormData = init.body instanceof FormData;
    const response = await fetch(`${baseUrl}${path}`, {
      ...init,
      headers: {
        ...(!isFormData && { 'Content-Type': 'application/json' }),
        ...init.headers,
      },
    });
    const payload = (await response.json()) as ApiResponse<T>;

    return { response, payload };
  }

  try {
    const registered = await request<AuthPayload>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        firstName: 'Prueba',
        lastName: 'BioinSight',
        email: testEmail,
        password: firstPassword,
      }),
    });

    if (!registered.response.ok || !registered.payload.data?.token) {
      throw new Error(`Falló el registro: ${registered.payload.message}`);
    }

    userId = registered.payload.data.user.id;
    const token = registered.payload.data.token;
    const authorization = { Authorization: `Bearer ${token}` };

    const profileUpdate = await request<{ firstName: string; lastName: string }>('/profile', {
      method: 'PATCH',
      headers: authorization,
      body: JSON.stringify({ firstName: 'Prueba real', lastName: 'Persistida' }),
    });

    if (!profileUpdate.response.ok || profileUpdate.payload.data.firstName !== 'Prueba real') {
      throw new Error(`Falló la edición del perfil: ${profileUpdate.payload.message}`);
    }

    const preferences = await request<{
      healthInterests: string[];
      notificationsEnabled: boolean;
    }>('/profile/preferences', {
      method: 'PUT',
      headers: authorization,
      body: JSON.stringify({
        healthInterests: ['diabetes', 'renal'],
        notificationsEnabled: false,
      }),
    });

    if (
      !preferences.response.ok ||
      preferences.payload.data.healthInterests.join(',') !== 'diabetes,renal' ||
      preferences.payload.data.notificationsEnabled !== false
    ) {
      throw new Error(`Falló la persistencia de preferencias: ${preferences.payload.message}`);
    }

    const manualTest = await request<ClinicalTestPayload>('/tests', {
      method: 'POST',
      headers: authorization,
      body: JSON.stringify({
        category: 'diabetes',
        testType: 'fasting_glucose',
        measuredAt: new Date().toISOString(),
        value: 110,
        sourceMode: 'manual',
      }),
    });

    if (!manualTest.response.ok || manualTest.payload.data.status !== 'warning') {
      throw new Error(`Falló el registro manual de prueba: ${manualTest.payload.message}`);
    }

    const documentForm = new FormData();
    documentForm.append('category', 'diabetes');
    documentForm.append('testType', 'hba1c');
    documentForm.append('measuredAt', new Date().toISOString());
    documentForm.append('value', '5.4');
    documentForm.append('sourceMode', 'document');
    documentForm.append('attachment', new Blob(['%PDF-1.4 prueba'], { type: 'application/pdf' }), 'resultado-prueba.pdf');

    const documentTest = await request<ClinicalTestPayload>('/tests', {
      method: 'POST',
      headers: authorization,
      body: documentForm,
    });

    if (!documentTest.response.ok || !documentTest.payload.data.hasAttachment) {
      throw new Error(`Falló la prueba con documento: ${documentTest.payload.message}`);
    }

    const testList = await request<ClinicalTestPayload[]>('/tests', { headers: authorization });

    if (!testList.response.ok || testList.payload.data.length < 2) {
      throw new Error('Las pruebas clínicas no se recuperaron correctamente desde PostgreSQL.');
    }

    const attachmentResponse = await fetch(
      `${baseUrl}/tests/${documentTest.payload.data.id}/attachment`,
      { headers: authorization },
    );

    if (!attachmentResponse.ok || attachmentResponse.headers.get('content-type') !== 'application/pdf') {
      throw new Error('El archivo de laboratorio no se recuperó correctamente.');
    }

    const passwordChange = await request<null>('/profile/password', {
      method: 'PUT',
      headers: authorization,
      body: JSON.stringify({ currentPassword: firstPassword, newPassword: secondPassword }),
    });

    if (!passwordChange.response.ok) {
      throw new Error(`Falló el cambio de contraseña: ${passwordChange.payload.message}`);
    }

    const newLogin = await request<AuthPayload>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email: testEmail, password: secondPassword }),
    });

    if (!newLogin.response.ok || !newLogin.payload.data?.token) {
      throw new Error(`Falló el login con la contraseña nueva: ${newLogin.payload.message}`);
    }

    const persistedProfile = await request<{
      firstName: string;
      healthInterests: string[];
      notificationsEnabled: boolean;
    }>('/profile', {
      headers: { Authorization: `Bearer ${newLogin.payload.data.token}` },
    });

    if (
      !persistedProfile.response.ok ||
      persistedProfile.payload.data.firstName !== 'Prueba real' ||
      persistedProfile.payload.data.healthInterests.join(',') !== 'diabetes,renal' ||
      persistedProfile.payload.data.notificationsEnabled !== false
    ) {
      throw new Error('Los datos no se recuperaron correctamente desde PostgreSQL.');
    }

    console.log('OK: autenticación, perfil, preferencias, pruebas manuales, adjuntos y contraseña persistieron en PostgreSQL.');
  } finally {
    if (userId && process.env.KEEP_TEST_USER !== 'true') {
      await UserRepository.deleteById(userId);
    }

    await new Promise<void>((resolve, reject) => {
      server.close((error) => (error ? reject(error) : resolve()));
    });
    await AppDataSource.destroy();
  }
}

void main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
