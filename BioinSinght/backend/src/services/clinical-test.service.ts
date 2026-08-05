import type { ClinicalTestEntity } from '../entities/clinical-test.entity';
import { ClinicalTestRepository } from '../repositories/clinical-test.repository';
import { UserRepository } from '../repositories/user.repository';
import type {
  ClinicalTestSourceMode,
  ClinicalTestStatus,
  ClinicalTestType,
  ClinicalTestView,
} from '../types/clinical-test';
import type { HealthInterest } from '../types/user';
import { ApiError } from '../utils/ApiError';

type TestDefinition = {
  category: HealthInterest;
  name: string;
  unit: string;
};

type CreateClinicalTestInput = {
  category: HealthInterest;
  testType: ClinicalTestType;
  measuredAt: string;
  value: number;
  referenceMin: number | null;
  referenceMax: number | null;
  notes: string | null;
  sourceMode: ClinicalTestSourceMode;
};

type AttachmentInput = {
  originalname: string;
  mimetype: string;
  buffer: Buffer;
};

const TEST_DEFINITIONS: Record<ClinicalTestType, TestDefinition> = {
  fasting_glucose: { category: 'diabetes', name: 'Glucosa en ayunas', unit: 'mg/dL' },
  hba1c: { category: 'diabetes', name: 'Hemoglobina A1c', unit: '%' },
  total_cholesterol: { category: 'cardio', name: 'Colesterol total', unit: 'mg/dL' },
  triglycerides: { category: 'cardio', name: 'Triglicéridos', unit: 'mg/dL' },
  creatinine: { category: 'renal', name: 'Creatinina', unit: 'mg/dL' },
  urea: { category: 'renal', name: 'Urea', unit: 'mg/dL' },
  hemoglobin: { category: 'general', name: 'Hemoglobina', unit: 'g/dL' },
};

function classifyByReference(
  value: number,
  referenceMin: number | null,
  referenceMax: number | null,
): ClinicalTestStatus | null {
  if (referenceMin !== null && value < referenceMin) return 'low';
  if (referenceMax !== null && value > referenceMax) return 'high';
  if (referenceMin !== null || referenceMax !== null) return 'normal';
  return null;
}

function classifyByGeneralGuidance(testType: ClinicalTestType, value: number): ClinicalTestStatus {
  switch (testType) {
    case 'fasting_glucose':
      if (value < 70) return 'low';
      if (value <= 99) return 'normal';
      if (value <= 125) return 'warning';
      return 'high';
    case 'hba1c':
      if (value < 5.7) return 'normal';
      if (value < 6.5) return 'warning';
      return 'high';
    case 'total_cholesterol':
      if (value < 200) return 'normal';
      if (value < 240) return 'warning';
      return 'high';
    case 'triglycerides':
      if (value < 150) return 'normal';
      if (value < 200) return 'warning';
      return 'high';
    default:
      return 'unclassified';
  }
}

function toView(test: ClinicalTestEntity): ClinicalTestView {
  return {
    id: test.id,
    category: test.category,
    testType: test.testType,
    testName: test.testName,
    measuredAt: test.measuredAt.toISOString(),
    value: test.value,
    unit: test.unit,
    referenceMin: test.referenceMin,
    referenceMax: test.referenceMax,
    status: test.status,
    notes: test.notes,
    sourceMode: test.sourceMode,
    hasAttachment: Boolean(test.attachmentName),
    attachmentName: test.attachmentName,
    attachmentMimeType: test.attachmentMimeType,
    createdAt: test.createdAt.toISOString(),
  };
}

async function requireUser(userId: string) {
  const user = await UserRepository.findById(userId);
  if (!user) throw new ApiError(404, 'Usuario no encontrado.');
  return user;
}

export class ClinicalTestService {
  static async list(userId: string) {
    const user = await requireUser(userId);
    const tests = await ClinicalTestRepository.listForUser(userId, user.healthInterests ?? []);
    return tests.map(toView);
  }

  static async create(
    userId: string,
    input: CreateClinicalTestInput,
    attachment?: AttachmentInput,
  ) {
    const user = await requireUser(userId);
    const definition = TEST_DEFINITIONS[input.testType];

    if (definition.category !== input.category) {
      throw new ApiError(400, 'La prueba no corresponde con la categoría seleccionada.');
    }

    if (!user.healthInterests.includes(input.category)) {
      throw new ApiError(400, 'Selecciona esta categoría en tus preferencias antes de registrar la prueba.');
    }

    if (input.referenceMin !== null && input.referenceMax !== null && input.referenceMin >= input.referenceMax) {
      throw new ApiError(400, 'El rango mínimo debe ser menor que el máximo.');
    }

    if (input.sourceMode === 'document' && !attachment) {
      throw new ApiError(400, 'Adjunta una foto o PDF del laboratorio.');
    }

    const status = classifyByReference(input.value, input.referenceMin, input.referenceMax)
      ?? classifyByGeneralGuidance(input.testType, input.value);

    const test = await ClinicalTestRepository.create({
      userId,
      category: input.category,
      testType: input.testType,
      testName: definition.name,
      measuredAt: new Date(input.measuredAt),
      value: input.value,
      unit: definition.unit,
      referenceMin: input.referenceMin,
      referenceMax: input.referenceMax,
      status,
      notes: input.notes,
      sourceMode: input.sourceMode,
      attachmentName: attachment?.originalname ?? null,
      attachmentMimeType: attachment?.mimetype ?? null,
      attachmentData: attachment?.buffer ?? null,
    });

    return toView(test);
  }

  static async attachment(userId: string, testId: string) {
    const test = await ClinicalTestRepository.findAttachment(userId, testId);

    if (!test?.attachmentData || !test.attachmentName || !test.attachmentMimeType) {
      throw new ApiError(404, 'La prueba no tiene un archivo adjunto.');
    }

    return {
      data: test.attachmentData,
      name: test.attachmentName,
      mimeType: test.attachmentMimeType,
    };
  }
}
