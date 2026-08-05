import { Pressable, ScrollView, StatusBar, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';

import QuickAction from '../../components/dashboard/QuickAction';
import ResultCard from '../../components/dashboard/ResultCard';
import { useAuth } from '../../context/AuthContext';
import { useClinicalTests } from '../../context/ClinicalTestsContext';
import type { BottomTabParamList } from '../../navigation/types';
import styles from '../../styles/dashboard.styles';
import { toResultItem } from '../../utils/clinicalTest';

type Props = BottomTabScreenProps<BottomTabParamList, 'Dashboard'>;

export default function DashboardScreen({ navigation }: Props) {
  const { user } = useAuth();
  const { tests, loading, error, refresh } = useClinicalTests();
  const urgentCount = tests.filter((test) => test.status === 'high' || test.status === 'low').length;
  const warningCount = tests.filter((test) => test.status === 'warning').length;
  const hasUnclassified = tests.some((test) => test.status === 'unclassified');
  const latestResults = tests.slice(0, 3).map(toResultItem);

  const status = urgentCount > 0
    ? { icon: '!', title: 'Requiere revisión', subtitle: `${urgentCount} resultado${urgentCount === 1 ? '' : 's'} fuera del rango` }
    : warningCount > 0
      ? { icon: '!', title: 'Resultados por revisar', subtitle: `${warningCount} resultado${warningCount === 1 ? '' : 's'} en precaución` }
      : tests.length === 0
        ? { icon: '+', title: 'Sin resultados todavía', subtitle: 'Registra tu primera prueba clínica' }
        : hasUnclassified
          ? { icon: 'i', title: 'Resultados registrados', subtitle: 'Añade el rango del laboratorio para clasificarlos' }
          : { icon: '✓', title: 'Dentro de los rangos', subtitle: 'No hay resultados marcados para revisión' };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="light-content" backgroundColor="#2760E8" />
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.hero}>
          <View style={styles.heroTop}>
            <View>
              <Text style={styles.heroKicker}>RESUMEN PERSONAL</Text>
              <Text style={styles.heroName}>{user ? `${user.firstName} ${user.lastName}` : 'Usuario'}</Text>
            </View>
            <Pressable style={styles.notificationButton} onPress={() => navigation.navigate('Alerts')}>
              <Text style={styles.notificationIcon}>!</Text>
              {(urgentCount > 0 || warningCount > 0) && <View style={styles.notificationDot} />}
            </Pressable>
          </View>
          <View style={styles.statusCard}>
            <View style={styles.statusIconContainer}><Text style={styles.statusIcon}>{status.icon}</Text></View>
            <View style={{ flex: 1 }}>
              <Text style={styles.statusLabel}>Estado de tus pruebas</Text>
              <Text style={styles.statusTitle}>{status.title}</Text>
              <Text style={styles.statusSubtitle}>{status.subtitle}</Text>
            </View>
          </View>
        </View>

        <View style={styles.quickActions}>
          <QuickAction icon="+" label="Registrar" onPress={() => navigation.getParent()?.navigate('NewTest')} />
          <QuickAction icon="H" label="Historial" onPress={() => navigation.navigate('History')} />
          <QuickAction icon="E" label="Evolución" onPress={() => navigation.navigate('Evolution')} />
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Últimos resultados</Text>
          <Pressable onPress={() => navigation.navigate('History')}><Text style={styles.sectionLink}>Ver todo</Text></Pressable>
        </View>
        <View style={styles.results}>
          {loading && !tests.length && <Text style={{ color: '#7F8DA5' }}>Cargando tus resultados...</Text>}
          {!!error && !tests.length && (
            <Pressable onPress={() => void refresh()}><Text style={{ color: '#D14343', fontWeight: '700' }}>{error} Toca para reintentar.</Text></Pressable>
          )}
          {!loading && !error && !latestResults.length && (
            <Text style={{ color: '#7F8DA5', lineHeight: 20 }}>Aún no tienes pruebas relacionadas con tus preferencias. Usa “Registrar” o el botón central +.</Text>
          )}
          {latestResults.map((item) => <ResultCard key={item.id} item={item} />)}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
