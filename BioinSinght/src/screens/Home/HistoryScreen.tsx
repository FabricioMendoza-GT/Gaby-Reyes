import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';

import { useAuth } from '../../context/AuthContext';
import { useClinicalTests } from '../../context/ClinicalTestsContext';
import type { BottomTabParamList } from '../../navigation/types';
import type { HealthInterest } from '../../types/auth';
import { formatTestDate, formatTestNumber, testStatusLabel } from '../../utils/clinicalTest';

type Props = BottomTabScreenProps<BottomTabParamList, 'History'>;
type Filter = 'all' | HealthInterest;

const categoryLabels: Record<HealthInterest, string> = {
  diabetes: 'Diabetes',
  cardio: 'Cardiovascular',
  renal: 'Renal',
  general: 'General',
};

const badgeStyles = StyleSheet.create({
  high: { backgroundColor: '#FFF1F1', borderColor: '#F4C5C5' },
  low: { backgroundColor: '#FFF1F1', borderColor: '#F4C5C5' },
  warning: { backgroundColor: '#FFF8E8', borderColor: '#F1D997' },
  normal: { backgroundColor: '#EDFBF4', borderColor: '#B9E4CF' },
  unclassified: { backgroundColor: '#EEF2F7', borderColor: '#D8E0EB' },
});
const badgeTextStyles = StyleSheet.create({
  high: { color: '#D85A5A' },
  low: { color: '#D85A5A' },
  warning: { color: '#C48A16' },
  normal: { color: '#2DAD72' },
  unclassified: { color: '#65758C' },
});

export default function HistoryScreen({ navigation }: Props) {
  const { user } = useAuth();
  const { tests, loading, error, refresh } = useClinicalTests();
  const [filter, setFilter] = useState<Filter>('all');
  const [query, setQuery] = useState('');
  const categories: Filter[] = ['all', ...(user?.healthInterests ?? [])];
  const items = useMemo(() => tests.filter((item) => (
    (filter === 'all' || item.category === filter)
    && item.testName.toLowerCase().includes(query.trim().toLowerCase())
  )), [tests, filter, query]);

  return (
    <SafeAreaView style={s.page} edges={['top', 'left', 'right']}>
      <View style={s.header}>
        <Text style={s.title}>Historial clínico</Text>
        <Pressable onPress={() => navigation.navigate('Dashboard')}><Text style={s.link}>Inicio</Text></Pressable>
      </View>
      <TextInput style={s.search} value={query} onChangeText={setQuery} placeholder="Buscar examen..." placeholderTextColor="#8B97A9" />
      <ScrollView contentContainerStyle={s.content}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.tabs}>
          {categories.map((category) => (
            <Pressable key={category} style={[s.tab, filter === category && s.tabActive]} onPress={() => setFilter(category)}>
              <Text style={[s.tabText, filter === category && s.tabTextActive]}>{category === 'all' ? 'Todos' : categoryLabels[category]}</Text>
            </Pressable>
          ))}
        </ScrollView>
        {items.map((item) => (
          <View key={item.id} style={s.card}>
            <View style={s.info}>
              <Text style={s.name}>{item.testName}</Text>
              <Text style={s.date}>{formatTestDate(item.measuredAt)} · {categoryLabels[item.category]}</Text>
              {item.hasAttachment && <Text style={s.attachment}>Documento adjunto: {item.attachmentName}</Text>}
            </View>
            <View style={s.result}>
              <Text style={s.value}>{formatTestNumber(item.value)} {item.unit}</Text>
              <View style={[s.badge, badgeStyles[item.status]]}><Text style={[s.badgeText, badgeTextStyles[item.status]]}>{testStatusLabel(item.status)}</Text></View>
            </View>
          </View>
        ))}
        {loading && !tests.length && <Text style={s.empty}>Cargando resultados...</Text>}
        {!!error && !tests.length && <Pressable onPress={() => void refresh()}><Text style={s.error}>{error} Toca para reintentar.</Text></Pressable>}
        {!loading && !error && items.length === 0 && <Text style={s.empty}>No hay resultados que coincidan con tus preferencias y búsqueda.</Text>}
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  page: { flex: 1, backgroundColor: '#F5F7FB' },
  header: { padding: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  title: { fontSize: 24, fontWeight: '800', color: '#243449' },
  link: { color: '#2F6CF0', fontWeight: '700' },
  search: { height: 48, marginHorizontal: 20, paddingHorizontal: 14, backgroundColor: '#FFF', borderRadius: 14, borderWidth: 1, borderColor: '#E2E8F2', color: '#243449' },
  content: { paddingBottom: 120 },
  tabs: { padding: 20, gap: 8 },
  tab: { paddingHorizontal: 14, paddingVertical: 9, borderRadius: 18, backgroundColor: '#E9EEF6' },
  tabActive: { backgroundColor: '#2F6CF0' },
  tabText: { color: '#65758C', fontWeight: '700' },
  tabTextActive: { color: '#FFF' },
  card: { marginHorizontal: 20, marginBottom: 12, padding: 16, borderRadius: 16, backgroundColor: '#FFF', flexDirection: 'row', borderWidth: 1, borderColor: '#E7EDF6' },
  info: { flex: 1, paddingRight: 8 },
  name: { fontSize: 15, fontWeight: '800', color: '#2A384C' },
  date: { marginTop: 5, color: '#8B97A9', fontSize: 12 },
  attachment: { marginTop: 6, color: '#2F6CF0', fontSize: 11, fontWeight: '700' },
  result: { alignItems: 'flex-end' },
  value: { fontSize: 16, fontWeight: '800', color: '#2A384C' },
  badge: { marginTop: 7, borderWidth: 1, borderRadius: 16, paddingHorizontal: 10, paddingVertical: 4 },
  badgeText: { fontWeight: '800', fontSize: 12 },
  empty: { textAlign: 'center', color: '#8B97A9', marginTop: 20, paddingHorizontal: 30, lineHeight: 20 },
  error: { textAlign: 'center', color: '#D14343', marginTop: 20, paddingHorizontal: 30, fontWeight: '700' },
});
