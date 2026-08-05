import { useState } from 'react';
import { ScrollView, StatusBar, StyleSheet, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import Header from '../../components/common/Header';
import Input from '../../components/common/Input';
import { useAuth } from '../../context/AuthContext';
import type { AuthStackParamList } from '../../navigation/types';
import { ApiClientError } from '../../services/api';

type Props = NativeStackScreenProps<AuthStackParamList, 'Register'>;

export default function RegisterScreen({ navigation }: Props) {
  const { register } = useAuth();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const submit = async () => {
    setError('');

    if (!firstName.trim() || !lastName.trim() || !email.trim() || !password) {
      setError('Completa todos los campos.');
      return;
    }

    if (password.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    try {
      setSubmitting(true);
      await register({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim(),
        password,
      });
    } catch (requestError) {
      setError(requestError instanceof ApiClientError ? requestError.message : 'No se pudo crear la cuenta.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.page}>
      <StatusBar barStyle="dark-content" />
      <Header title="Crear cuenta" onBack={submitting ? undefined : () => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>Empieza con BioinSight</Text>
        <Text style={styles.subtitle}>Tus datos y preferencias quedarán guardados en tu cuenta.</Text>
        <Card>
          <Input label="Nombre" value={firstName} placeholder="Ana" onChangeText={setFirstName} textContentType="givenName" />
          <Input label="Apellido" value={lastName} placeholder="García" onChangeText={setLastName} textContentType="familyName" />
          <Input label="Correo electrónico" value={email} placeholder="correo@ejemplo.com" onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" textContentType="emailAddress" />
          <Input label="Contraseña" value={password} placeholder="Mínimo 8 caracteres" onChangeText={setPassword} secureTextEntry autoCapitalize="none" textContentType="newPassword" />
          <Input label="Confirmar contraseña" value={confirmPassword} placeholder="Repite la contraseña" onChangeText={setConfirmPassword} secureTextEntry autoCapitalize="none" textContentType="newPassword" />
          {!!error && <Text style={styles.error}>{error}</Text>}
          <Button title={submitting ? 'Creando cuenta...' : 'Crear cuenta'} disabled={submitting} onPress={() => void submit()} />
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: '#F4F7FC' },
  content: { padding: 24, paddingTop: 8 },
  title: { fontSize: 28, fontWeight: '800', color: '#1D2B45' },
  subtitle: { marginTop: 8, marginBottom: 20, fontSize: 15, lineHeight: 22, color: '#8B97A9' },
  error: { marginBottom: 14, color: '#D14343', fontWeight: '700' },
});
