import type { HealthInterest } from './auth';

export const CLINICAL_TEST_PRESETS = [
  { id: 'fasting_glucose', name: 'Glucosa en ayunas', category: 'diabetes', unit: 'mg/dL' },
  { id: 'hba1c', name: 'Hemoglobina A1c', category: 'diabetes', unit: '%' },
  { id: 'total_cholesterol', name: 'Colesterol total', category: 'cardio', unit: 'mg/dL' },
  { id: 'triglycerides', name: 'Triglicéridos', category: 'cardio', unit: 'mg/dL' },
  { id: 'creatinine', name: 'Creatinina', category: 'renal', unit: 'mg/dL' },
  { id: 'urea', name: 'Urea', category: 'renal', unit: 'mg/dL' },
  { id: 'hemoglobin', name: 'Hemoglobina', category: 'general', unit: 'g/dL' },
] as const;

export type ClinicalTestPreset = (typeof CLINICAL_TEST_PRESETS)[number];
export type ClinicalTestType = ClinicalTestPreset['id'];
export type ClinicalTestStatus = 'normal' | 'warning' | 'high' | 'low' | 'unclassified';
export type ClinicalTestSourceMode = 'manual' | 'document';

export type ClinicalTest = {
  id: string;
  category: HealthInterest;
  testType: ClinicalTestType;
  testName: string;
  measuredAt: string;
  value: number;
  unit: string;
  referenceMin: number | null;
  referenceMax: number | null;
  status: ClinicalTestStatus;
  notes: string | null;
  sourceMode: ClinicalTestSourceMode;
  hasAttachment: boolean;
  attachmentName: string | null;
  attachmentMimeType: string | null;
  createdAt: string;
};

export type TestAttachment = {
  uri: string;
  name: string;
  mimeType: string;
  size?: number;
};

export type CreateClinicalTestInput = {
  category: HealthInterest;
  testType: ClinicalTestType;
  measuredAt: string;
  value: number;
  referenceMin: number | null;
  referenceMax: number | null;
  notes: string | null;
  sourceMode: ClinicalTestSourceMode;
  attachment?: TestAttachment;
};
