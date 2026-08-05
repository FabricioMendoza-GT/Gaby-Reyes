import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useAuth } from '../../context/AuthContext';
import { useClinicalTests } from '../../context/ClinicalTestsContext';
import type { ClinicalTest } from '../../types/clinicalTest';
import { formatTestDate, formatTestNumber, testStatusLabel } from '../../utils/clinicalTest';

function alertDescription(test: ClinicalTest) {
  const value = `${formatTestNumber(test.value)} ${test.unit}`;

  if (test.status === 'warning') {
    return `El valor ${value} está en una zona de precaución según la referencia general utilizada.`;
  }

  if (test.status === 'low') {
    return `El valor ${value} está por debajo del rango registrado para esta prueba.`;
  }

  return `El valor ${value} está por encima del rango registrado para esta prueba.`;
}

export default function AlertsScreen() {
  const { user } = useAuth();
  const { tests, loading } = useClinicalTests();
  const alerts = tests.filter((test) => ['warning', 'high', 'low'].includes(test.status));
  const criticalCount = alerts.filter((test) => test.status === 'high' || test.status === 'low').length;

  return (
    <SafeAreaView style={s.page} edges={['top', 'left', 'right']}>
      <ScrollView contentContainerStyle={s.content}>
        <Text style={s.title}>Alertas de salud</Text>
        {!user?.notificationsEnabled && (
          <View style={s.notificationsOff}><Text style={s.notificationsOffText}>Las notificaciones están desactivadas en tu perfil, pero puedes consultar aquí tus resultados por revisar.</Text></View>
        )}
        <View style={[s.hero, criticalCount === 0 && s.heroSafe]}>
          <Text style={[s.heroTitle, criticalCount === 0 && s.heroTitleSafe]}>{
            criticalCount > 0
              ? `${criticalCount} resultado${criticalCount === 1 ? '' : 's'} fuera del rango`
              : alerts.length > 0
                ? 'Resultados en zona de precaución'
                : 'Sin alertas en tus preferencias'
          }</Text>
          <Text style={[s.heroText, criticalCount === 0 && s.heroTextSafe]}>{
            alerts.length > 0
              ? 'Revisa el informe original y consulta con un profesional de salud para interpretar los resultados.'
              : 'No hay resultados marcados para revisión en las categorías que elegiste.'
          }</Text>
        </View>
        <Text style={s.label}>RESULTADOS POR REVISAR</Text>
        {alerts.map((test) => (
          <View style={s.card} key={test.id}>
            <View style={s.body}>
              <Text style={s.cardTitle}>{test.testName} · {testStatusLabel(test.status)}</Text>
              <Text style={s.description}>{alertDescription(test)}</Text>
              <Text style={s.time}>{formatTestDate(test.measuredAt)}</Text>
            </View>
            <View style={[s.dot, test.status === 'warning' ? s.warningDot : s.criticalDot]} />
          </View>
        ))}
        {loading && !tests.length && <Text style={s.empty}>Cargando alertas...</Text>}
        {!loading && alerts.length === 0 && <Text style={s.empty}>Las nuevas alertas aparecerán cuando registres resultados relacionados con tus preferencias.</Text>}
        <Text style={s.disclaimer}>BioInsight organiza la información registrada; no diagnostica enfermedades ni sustituye una consulta médica.</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  page: { flex: 1, backgroundColor: '#F5F7FB' },
  content: { padding: 20, paddingBottom: 120 },
  title: { fontSize: 24, fontWeight: '800', color: '#243449', marginBottom: 18 },
  notificationsOff: { padding: 13, borderRadius: 14, backgroundColor: '#EEF3FF', marginBottom: 12 },
  notificationsOffText: { color: '#526DAD', lineHeight: 18, fontSize: 12 },
  hero: { padding: 18, borderRadius: 18, backgroundColor: '#FFF1F1', borderWidth: 1, borderColor: '#FFD1D1' },
  heroSafe: { backgroundColor: '#EDFBF4', borderColor: '#B9E4CF' },
  heroTitle: { fontSize: 16, fontWeight: '800', color: '#C84545' },
  heroTitleSafe: { color: '#248A57' },
  heroText: { marginTop: 7, lineHeight: 19, color: '#A14B4B' },
  heroTextSafe: { color: '#3D7A5D' },
  label: { marginVertical: 20, color: '#8B97A9', fontSize: 12, fontWeight: '800', letterSpacing: 0.7 },
  card: { backgroundColor: '#FFF', borderRadius: 16, padding: 15, marginBottom: 12, flexDirection: 'row' },
  dot: { width: 10, height: 10, borderRadius: 5, marginTop: 5, marginLeft: 12 },
  criticalDot: { backgroundColor: '#EF5D66' },
  warningDot: { backgroundColor: '#F2B72D' },
  body: { flex: 1 },
  cardTitle: { fontSize: 15, fontWeight: '800', color: '#2A384C' },
  description: { marginTop: 6, lineHeight: 18, color: '#68778D' },
  time: { marginTop: 8, color: '#96A1B2', fontSize: 12, fontWeight: '700' },
  empty: { textAlign: 'center', color: '#8B97A9', lineHeight: 20, paddingHorizontal: 20 },
  disclaimer: { marginTop: 22, color: '#8B97A9', fontSize: 11, lineHeight: 16, textAlign: 'center' },
});
