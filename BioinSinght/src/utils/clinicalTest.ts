import type { ResultItem, ResultTone } from '../types/result';
import type { ClinicalTest, ClinicalTestStatus } from '../types/clinicalTest';

const statusPresentation: Record<ClinicalTestStatus, { badge: string; tone: ResultTone }> = {
  normal: { badge: 'Normal', tone: 'success' },
  warning: { badge: 'Precaución', tone: 'warning' },
  high: { badge: 'Alto', tone: 'danger' },
  low: { badge: 'Bajo', tone: 'danger' },
  unclassified: { badge: 'Sin clasificar', tone: 'neutral' },
};

const categoryIcons = {
  diabetes: '∿',
  cardio: '♡',
  renal: '◇',
  general: '•',
} as const;

export function formatTestDate(value: string) {
  return new Intl.DateTimeFormat('es-EC', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(value));
}

export function formatTestNumber(value: number) {
  return Number.isInteger(value) ? String(value) : String(Number(value.toFixed(2)));
}

export function toResultItem(test: ClinicalTest): ResultItem {
  const presentation = statusPresentation[test.status];
  return {
    id: test.id,
    name: test.testName,
    date: formatTestDate(test.measuredAt),
    value: formatTestNumber(test.value),
    unit: test.unit,
    badge: presentation.badge,
    tone: presentation.tone,
    icon: categoryIcons[test.category],
  };
}

export function testStatusLabel(status: ClinicalTestStatus) {
  return statusPresentation[status].badge;
}
