import { apiRequest } from './api';
import { apiFormRequest } from './apiUpload';
import { getStoredToken } from './sessionStorage';
import type { ClinicalTest, CreateClinicalTestInput } from '../types/clinicalTest';

function appendOptionalNumber(form: FormData, name: string, value: number | null) {
  if (value !== null) form.append(name, String(value));
}

export async function listClinicalTests() {
  const token = await getStoredToken();
  return apiRequest<ClinicalTest[]>('/tests', {}, token);
}

export async function createClinicalTest(input: CreateClinicalTestInput) {
  const token = await getStoredToken();
  const form = new FormData();
  form.append('category', input.category);
  form.append('testType', input.testType);
  form.append('measuredAt', input.measuredAt);
  form.append('value', String(input.value));
  form.append('sourceMode', input.sourceMode);
  appendOptionalNumber(form, 'referenceMin', input.referenceMin);
  appendOptionalNumber(form, 'referenceMax', input.referenceMax);
  if (input.notes) form.append('notes', input.notes);

  if (input.attachment) {
    form.append('attachment', {
      uri: input.attachment.uri,
      name: input.attachment.name,
      type: input.attachment.mimeType,
    } as unknown as Blob);
  }

  return apiFormRequest<ClinicalTest>('/tests', form, token);
}
