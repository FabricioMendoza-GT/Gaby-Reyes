export type ResultTone = 'danger' | 'warning' | 'success' | 'neutral';

export interface ResultItem {
  id: string;
  name: string;
  date: string;
  value: string;
  unit: string;
  badge: string;
  tone: ResultTone;
  icon: string;
}
