import { useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import Button from '../../components/common/Button';
import Header from '../../components/common/Header';
import { usePreferences } from '../../context/PreferencesContext';
import type { AuthStackParamList } from '../../navigation/types';
import { ApiClientError } from '../../services/api';
import type { HealthInterest } from '../../types/auth';

type Props = NativeStackScreenProps<AuthStackParamList, 'Onboarding'>;
const interests = [
  ['diabetes', 'Diabetes', 'Glucosa, HbA1C e insulina'],
  ['cardio', 'Salud cardiovascular', 'Colesterol y triglicéridos'],
  ['renal', 'Función renal', 'Creatinina y urea'],
  ['general', 'Salud general', 'Vitaminas y hemograma'],
] as const;

export default function OnboardingScreen({ navigation }: Props) {
  const { selectedInterests, savePreferences } = usePreferences();
  const [selected, setSelected] = useState(selectedInterests);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const toggle = (id: HealthInterest) => setSelected((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
  const save = async () => {
    try {
      setSaving(true);
      setError('');
      await savePreferences(selected);
      navigation.navigate('Main', { screen: 'Profile' });
    } catch (requestError) {
      setError(requestError instanceof ApiClientError ? requestError.message : 'No se pudieron guardar las preferencias.');
    } finally {
      setSaving(false);
    }
  };

  return <SafeAreaView style={s.page}><Header title="Preferencias" onBack={saving ? undefined : navigation.canGoBack() ? () => navigation.goBack() : undefined}/><ScrollView contentContainerStyle={s.content}>{saving ? <View style={s.saving}><ActivityIndicator size="large" color="#2F6CF0"/><Text style={s.savingTitle}>Actualizando preferencias</Text><Text style={s.savingText}>Guardando los intereses en tu cuenta...</Text></View> : <><Text style={s.title}>¿Qué deseas monitorear?</Text><Text style={s.subtitle}>Selecciona uno o más intereses de salud.</Text>{interests.map(([id, title, subtitle]) => { const active = selected.includes(id); return <Pressable key={id} style={[s.card, active && s.active]} onPress={() => toggle(id)}><View style={s.body}><Text style={s.cardTitle}>{title}</Text><Text style={s.cardSubtitle}>{subtitle}</Text></View><View style={[s.check, active && s.checkActive]}>{active && <Text style={s.checkText}>✓</Text>}</View></Pressable>; })}{!!error && <Text style={s.error}>{error}</Text>}</>}</ScrollView>{!saving && <View style={s.footer}><Button title="Guardar preferencias" disabled={!selected.length} onPress={() => void save()}/></View>}</SafeAreaView>;
}
const s=StyleSheet.create({page:{flex:1,backgroundColor:'#EDF3FF'},content:{padding:20,flexGrow:1},title:{fontSize:30,fontWeight:'800',color:'#243449'},subtitle:{marginTop:8,marginBottom:25,fontSize:16,color:'#8B97A9'},card:{backgroundColor:'#FFF',borderRadius:18,padding:16,marginBottom:14,flexDirection:'row',alignItems:'center',borderWidth:1,borderColor:'#E8EDF5'},active:{borderColor:'#2F6CF0',backgroundColor:'#F8FAFF'},body:{flex:1},cardTitle:{fontSize:15,fontWeight:'800',color:'#2B394D'},cardSubtitle:{marginTop:4,fontSize:12,color:'#92A0B3'},check:{width:24,height:24,borderRadius:12,borderWidth:1.5,borderColor:'#CCD5E3'},checkActive:{backgroundColor:'#2F6CF0',borderColor:'#2F6CF0',justifyContent:'center',alignItems:'center'},checkText:{color:'#FFF',fontWeight:'800'},footer:{padding:20},saving:{flex:1,justifyContent:'center',alignItems:'center',paddingBottom:80},savingTitle:{marginTop:18,fontSize:20,fontWeight:'800',color:'#243449'},savingText:{marginTop:8,textAlign:'center',color:'#7F8DA5'},error:{marginTop:4,color:'#D14343',fontWeight:'700'}});
