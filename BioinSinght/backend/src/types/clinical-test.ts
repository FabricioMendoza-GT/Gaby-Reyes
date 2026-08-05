import type { HealthInterest } from './user';

export const CLINICAL_TEST_TYPES = [
  'fasting_glucose',
  'hba1c',
  'total_cholesterol',
  'triglycerides',
  'creatinine',
  'urea',
  'hemoglobin',
] as const;

export const CLINICAL_TEST_STATUSES = [
  'normal',
  'warning',
  'high',
  'low',
  'unclassified',
] as const;

export const CLINICAL_TEST_SOURCE_MODES = ['manual', 'document'] as const;

export type ClinicalTestType = (typeof CLINICAL_TEST_TYPES)[number];
export type ClinicalTestStatus = (typeof CLINICAL_TEST_STATUSES)[number];
export type ClinicalTestSourceMode = (typeof CLINICAL_TEST_SOURCE_MODES)[number];

export type ClinicalTestView = {
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
