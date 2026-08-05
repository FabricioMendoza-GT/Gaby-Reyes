import { createBottomTabNavigator, type BottomTabBarProps } from '@react-navigation/bottom-tabs';

import BottomTab, { type BottomTabRoute } from '../components/navigation/BottomTab';
import AlertsScreen from '../screens/Home/AlertsScreen';
import DashboardScreen from '../screens/Home/DashboardScreen';
import EvolutionScreen from '../screens/Home/EvolutionScreen';
import HistoryScreen from '../screens/Home/HistoryScreen';
import ProfileScreen from '../screens/Home/ProfileScreen';
import type { BottomTabParamList } from './types';

const Tab = createBottomTabNavigator<BottomTabParamList>();

function AppTabBar({ state, navigation }: BottomTabBarProps) {
  const active = state.routes[state.index].name as BottomTabRoute;

  return (
    <BottomTab
      active={active}
      onNavigate={(route) => navigation.navigate(route)}
      onAdd={() => navigation.getParent()?.navigate('NewTest')}
    />
  );
}

export default function MainNavigator() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }} tabBar={(props) => <AppTabBar {...props} />}>
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
      <Tab.Screen name="History" component={HistoryScreen} />
      <Tab.Screen name="Alerts" component={AlertsScreen} />
      <Tab.Screen name="Evolution" component={EvolutionScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}
