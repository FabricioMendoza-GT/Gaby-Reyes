import { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';

import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import { useAuth } from '../../context/AuthContext';
import { usePreferences } from '../../context/PreferencesContext';
import type { BottomTabParamList } from '../../navigation/types';
import { ApiClientError } from '../../services/api';

type Props = BottomTabScreenProps<BottomTabParamList, 'Profile'>;

const interestLabels: Record<string, string> = {
  diabetes: 'Diabetes',
  cardio: 'Salud cardiovascular',
  renal: 'Función renal',
  general: 'Salud general',
};

export default function ProfileScreen({ navigation }: Props) {
  const { user, logout, updateProfile, changePassword } = useAuth();
  const { selectedInterests, notificationsEnabled, savePreferences } = usePreferences();
  const [editing, setEditing] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [firstName, setFirstName] = useState(user?.firstName ?? '');
  const [lastName, setLastName] = useState(user?.lastName ?? '');
  const [email, setEmail] = useState(user?.email ?? '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    setFirstName(user?.firstName ?? '');
    setLastName(user?.lastName ?? '');
    setEmail(user?.email ?? '');
  }, [user]);

  if (!user) return null;

  const interests = selectedInterests
    .map((interest) => interestLabels[interest])
    .filter(Boolean)
    .join(' · ') || 'Sin intereses seleccionados';
  const initials = `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase();

  const run = async (action: () => Promise<void>, successMessage: string) => {
    try {
      setSaving(true);
      setError('');
      setMessage('');
      await action();
      setMessage(successMessage);
      return true;
    } catch (requestError) {
      setError(requestError instanceof ApiClientError ? requestError.message : 'No se pudo completar la operación.');
      return false;
    } finally {
      setSaving(false);
    }
  };

  const saveProfile = async () => {
    if (!firstName.trim() || !lastName.trim() || !email.trim()) {
      setError('Nombre, apellido y correo son obligatorios.');
      return;
    }

    const saved = await run(() => updateProfile({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim(),
    }), 'Perfil actualizado correctamente.');

    if (saved) setEditing(false);
  };

  const savePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      setError('Completa los tres campos de contraseña.');
      return;
    }

    if (newPassword.length < 8) {
      setError('La nueva contraseña debe tener al menos 8 caracteres.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Las contraseñas nuevas no coinciden.');
      return;
    }

    const saved = await run(
      () => changePassword(currentPassword, newPassword),
      'Contraseña actualizada correctamente.',
    );

    if (saved) {
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setChangingPassword(false);
    }
  };

  const toggleNotifications = async (enabled: boolean) => {
    await run(
      () => savePreferences(selectedInterests, enabled),
      enabled ? 'Notificaciones activadas.' : 'Notificaciones desactivadas.',
    );
  };

  return (
    <SafeAreaView style={s.page} edges={['top', 'left', 'right']}>
      <ScrollView contentContainerStyle={s.content} keyboardShouldPersistTaps="handled">
        <View style={s.titleRow}>
          <Text style={s.title}>Mi perfil</Text>
          {!editing && <Pressable onPress={() => { setEditing(true); setMessage(''); setError(''); }}><Text style={s.edit}>Editar</Text></Pressable>}
        </View>

        <View style={s.profile}>
          <View style={s.avatar}><Text style={s.avatarText}>{initials}</Text></View>
          <View style={s.profileText}>
            <Text style={s.name}>{user.firstName} {user.lastName}</Text>
            <Text style={s.email}>{user.email}</Text>
          </View>
        </View>

        {editing && (
          <View style={s.card}>
            <Text style={s.sectionTitle}>Datos personales</Text>
            <Input label="Nombre" value={firstName} placeholder="Nombre" onChangeText={setFirstName} textContentType="givenName" />
            <Input label="Apellido" value={lastName} placeholder="Apellido" onChangeText={setLastName} textContentType="familyName" />
            <Input label="Correo electrónico" value={email} placeholder="correo@ejemplo.com" onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" textContentType="emailAddress" />
            <Button title={saving ? 'Guardando...' : 'Guardar perfil'} disabled={saving} onPress={() => void saveProfile()} />
            <Pressable style={s.cancel} disabled={saving} onPress={() => setEditing(false)}><Text style={s.cancelText}>Cancelar</Text></Pressable>
          </View>
        )}

        <View style={s.list}>
          <Pressable style={s.row} onPress={() => navigation.getParent()?.navigate('Onboarding')}>
            <View style={s.rowText}><Text style={s.rowLabel}>Mis intereses</Text><Text style={s.rowValue}>{interests}</Text></View>
            <Text style={s.chevron}>›</Text>
          </Pressable>
          <View style={s.row}>
            <View style={s.rowText}><Text style={s.rowLabel}>Notificaciones</Text><Text style={s.rowValue}>{notificationsEnabled ? 'Activadas' : 'Desactivadas'}</Text></View>
            <Switch value={notificationsEnabled} disabled={saving} onValueChange={(value) => void toggleNotifications(value)} trackColor={{ false: '#CCD5E3', true: '#9EBBFF' }} thumbColor={notificationsEnabled ? '#2F6CF0' : '#F4F4F4'} />
          </View>
          <Pressable style={s.row} onPress={() => { setChangingPassword((current) => !current); setMessage(''); setError(''); }}>
            <View style={s.rowText}><Text style={s.rowLabel}>Contraseña</Text><Text style={s.rowValue}>Cambiar contraseña</Text></View>
            <Text style={s.chevron}>{changingPassword ? '⌃' : '›'}</Text>
          </Pressable>
        </View>

        {changingPassword && (
          <View style={s.card}>
            <Text style={s.sectionTitle}>Cambiar contraseña</Text>
            <Input label="Contraseña actual" value={currentPassword} placeholder="Contraseña actual" onChangeText={setCurrentPassword} secureTextEntry autoCapitalize="none" textContentType="password" />
            <Input label="Nueva contraseña" value={newPassword} placeholder="Mínimo 8 caracteres" onChangeText={setNewPassword} secureTextEntry autoCapitalize="none" textContentType="newPassword" />
            <Input label="Confirmar nueva contraseña" value={confirmPassword} placeholder="Repite la contraseña" onChangeText={setConfirmPassword} secureTextEntry autoCapitalize="none" textContentType="newPassword" />
            <Button title={saving ? 'Actualizando...' : 'Actualizar contraseña'} disabled={saving} onPress={() => void savePassword()} />
          </View>
        )}

        {!!message && <Text style={s.success}>{message}</Text>}
        {!!error && <Text style={s.error}>{error}</Text>}

        <Pressable style={s.logout} disabled={saving} onPress={() => void logout()}>
          <Text style={s.logoutText}>Cerrar sesión</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  page: { flex: 1, backgroundColor: '#F5F7FB' },
  content: { padding: 20, paddingBottom: 130 },
  titleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  title: { fontSize: 24, fontWeight: '800', color: '#243449' },
  edit: { color: '#2F6CF0', fontWeight: '800' },
  profile: { marginTop: 22, padding: 18, backgroundColor: '#FFF', borderRadius: 20, flexDirection: 'row', alignItems: 'center' },
  avatar: { width: 58, height: 58, borderRadius: 29, backgroundColor: '#DCE8FF', alignItems: 'center', justifyContent: 'center', marginRight: 14 },
  avatarText: { color: '#2F6CF0', fontWeight: '800', fontSize: 18 },
  profileText: { flex: 1 },
  name: { fontSize: 18, fontWeight: '800', color: '#2A384C' },
  email: { marginTop: 4, color: '#8290A4' },
  card: { marginTop: 18, padding: 18, backgroundColor: '#FFF', borderRadius: 20 },
  sectionTitle: { marginBottom: 16, fontSize: 17, fontWeight: '800', color: '#2A384C' },
  cancel: { alignItems: 'center', paddingTop: 15 },
  cancelText: { color: '#7F8DA5', fontWeight: '700' },
  list: { marginTop: 18, backgroundColor: '#FFF', borderRadius: 20, overflow: 'hidden' },
  row: { minHeight: 72, padding: 17, borderBottomWidth: 1, borderColor: '#EEF1F6', flexDirection: 'row', alignItems: 'center' },
  rowText: { flex: 1, paddingRight: 12 },
  rowLabel: { fontWeight: '800', color: '#2A384C' },
  rowValue: { marginTop: 5, fontSize: 13, lineHeight: 18, color: '#7F8DA5' },
  chevron: { fontSize: 24, color: '#9BA8BA' },
  success: { marginTop: 16, color: '#248A57', fontWeight: '700', textAlign: 'center' },
  error: { marginTop: 16, color: '#D14343', fontWeight: '700', textAlign: 'center' },
  logout: { marginTop: 18, padding: 17, borderRadius: 18, backgroundColor: '#FFF', alignItems: 'center' },
  logoutText: { color: '#E05252', fontWeight: '800' },
});
