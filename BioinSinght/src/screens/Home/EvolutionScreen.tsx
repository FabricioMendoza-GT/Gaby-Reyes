import { useEffect, useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useClinicalTests } from '../../context/ClinicalTestsContext';
import type { ClinicalTestType } from '../../types/clinicalTest';
import { formatTestNumber } from '../../utils/clinicalTest';

export default function EvolutionScreen() {
  const { tests, loading } = useClinicalTests();
  const availableTypes = useMemo(() => {
    const seen = new Set<ClinicalTestType>();
    return tests.filter((test) => {
      if (seen.has(test.testType)) return false;
      seen.add(test.testType);
      return true;
    }).map((test) => ({ id: test.testType, name: test.testName, unit: test.unit }));
  }, [tests]);
  const [selectedType, setSelectedType] = useState<ClinicalTestType | null>(null);

  useEffect(() => {
    if (!selectedType || !availableTypes.some((type) => type.id === selectedType)) {
      setSelectedType(availableTypes[0]?.id ?? null);
    }
  }, [availableTypes, selectedType]);

  const points = useMemo(() => tests
    .filter((test) => test.testType === selectedType)
    .slice(0, 6)
    .reverse(), [tests, selectedType]);
  const values = points.map((point) => point.value);
  const minimum = values.length ? Math.min(...values) : 0;
  const maximum = values.length ? Math.max(...values) : 0;
  const average = values.length ? values.reduce((sum, current) => sum + current, 0) / values.length : 0;
  const latest = points[points.length - 1];
  const first = points[0];
  const difference = latest && first ? latest.value - first.value : 0;
  const scaleHeight = (value: number) => {
    if (maximum === minimum) return 95;
    return 45 + ((value - minimum) / (maximum - minimum)) * 85;
  };

  return (
    <SafeAreaView style={s.page} edges={['top', 'left', 'right']}>
      <ScrollView contentContainerStyle={s.content}>
        <Text style={s.title}>Evolución</Text>
        <Text style={s.subtitle}>Tendencias basadas en tus pruebas y preferencias guardadas.</Text>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.tabs}>
          {availableTypes.map((type) => (
            <Pressable key={type.id} style={[s.tab, selectedType === type.id && s.tabActive]} onPress={() => setSelectedType(type.id)}>
              <Text style={[s.tabText, selectedType === type.id && s.tabTextActive]}>{type.name}</Text>
            </Pressable>
          ))}
        </ScrollView>

        {latest ? (
          <>
            <View style={s.card}>
              <View style={s.summary}>
                <View>
                  <Text style={s.small}>VALOR MÁS RECIENTE</Text>
                  <Text style={s.value}>{formatTestNumber(latest.value)} <Text style={s.unit}>{latest.unit}</Text></Text>
                </View>
                <Text style={[s.trend, difference <= 0 && s.trendDown]}>{difference > 0 ? '+' : ''}{formatTestNumber(difference)}</Text>
              </View>
              <View style={s.chart}>
                {points.map((point) => (
                  <View key={point.id} style={s.column}>
                    <Text style={s.pointValue}>{formatTestNumber(point.value)}</Text>
                    <View style={[s.bar, { height: scaleHeight(point.value) }]} />
                    <Text style={s.month}>{new Intl.DateTimeFormat('es-EC', { month: 'short' }).format(new Date(point.measuredAt))}</Text>
                  </View>
                ))}
              </View>
              <Text style={s.note}>{points.length === 1 ? 'Registra otra prueba del mismo tipo para comparar la evolución.' : `Comparación de los últimos ${points.length} resultados.`}</Text>
            </View>
            <View style={s.metrics}>
              <Metric label="Promedio" value={average} unit={latest.unit} />
              <Metric label="Mínimo" value={minimum} unit={latest.unit} />
              <Metric label="Máximo" value={maximum} unit={latest.unit} />
            </View>
          </>
        ) : (
          <View style={s.emptyCard}>
            <Text style={s.emptyTitle}>{loading ? 'Cargando evolución...' : 'Todavía no hay información para graficar'}</Text>
            <Text style={s.emptyText}>Registra pruebas relacionadas con tus preferencias para visualizar sus cambios en el tiempo.</Text>
          </View>
        )}
        <Text style={s.disclaimer}>Las tendencias ayudan a organizar resultados, pero deben interpretarse junto con un profesional de salud.</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

function Metric({ label, value, unit }: { label: string; value: number; unit: string }) {
  return <View style={s.metric}><Text style={s.small}>{label}</Text><Text style={s.metricValue}>{formatTestNumber(value)}</Text><Text style={s.unit}>{unit}</Text></View>;
}

const s = StyleSheet.create({
  page: { flex: 1, backgroundColor: '#F5F7FB' },
  content: { padding: 20, paddingBottom: 125 },
  title: { fontSize: 24, fontWeight: '800', color: '#243449' },
  subtitle: { marginTop: 6, color: '#7F8DA5', lineHeight: 19 },
  tabs: { gap: 8, paddingVertical: 18 },
  tab: { paddingHorizontal: 13, paddingVertical: 9, borderRadius: 18, backgroundColor: '#E9EEF6' },
  tabActive: { backgroundColor: '#2F6CF0' },
  tabText: { color: '#65758C', fontWeight: '700' },
  tabTextActive: { color: '#FFF' },
  card: { padding: 18, backgroundColor: '#FFF', borderRadius: 20 },
  summary: { flexDirection: 'row', justifyContent: 'space-between' },
  small: { fontSize: 11, fontWeight: '800', color: '#92A0B3', letterSpacing: 0.5 },
  value: { marginTop: 5, fontSize: 28, fontWeight: '800', color: '#2F6CF0' },
  unit: { fontSize: 11, color: '#92A0B3', fontWeight: '700' },
  trend: { color: '#EF6A6A', fontWeight: '800', marginTop: 10 },
  trendDown: { color: '#2DAD72' },
  chart: { height: 190, marginTop: 20, flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-around', borderBottomWidth: 1, borderColor: '#E8EDF5' },
  column: { flex: 1, alignItems: 'center', justifyContent: 'flex-end', height: '100%' },
  bar: { width: 24, borderRadius: 8, backgroundColor: '#4A79EA' },
  pointValue: { color: '#66778E', fontSize: 9, marginBottom: 4, fontWeight: '700' },
  month: { marginTop: 7, fontSize: 10, color: '#8E9DB1', textTransform: 'capitalize' },
  note: { marginTop: 28, color: '#7F8DA5', fontSize: 12 },
  metrics: { flexDirection: 'row', gap: 10, marginTop: 16 },
  metric: { flex: 1, alignItems: 'center', padding: 14, backgroundColor: '#FFF', borderRadius: 16 },
  metricValue: { fontSize: 20, fontWeight: '800', color: '#2A384C', marginTop: 6 },
  emptyCard: { marginTop: 10, padding: 22, borderRadius: 20, backgroundColor: '#FFF', alignItems: 'center' },
  emptyTitle: { color: '#2A384C', fontSize: 17, fontWeight: '800', textAlign: 'center' },
  emptyText: { marginTop: 8, color: '#7F8DA5', lineHeight: 20, textAlign: 'center' },
  disclaimer: { marginTop: 20, color: '#8B97A9', fontSize: 11, lineHeight: 16, textAlign: 'center' },
});
