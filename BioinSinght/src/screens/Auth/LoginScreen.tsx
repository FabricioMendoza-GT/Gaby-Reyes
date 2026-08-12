import { useState } from 'react';
import { Image, Pressable, ScrollView, StatusBar, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import Input from '../../components/common/Input';
import type { AuthStackParamList } from '../../navigation/types';
import { useAuth } from '../../context/AuthContext';
import { ApiClientError } from '../../services/api';

type Props = NativeStackScreenProps<AuthStackParamList, 'Login'>;

export default function LoginScreen({ navigation }: Props) {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const formIsValid = email.trim().length > 0 && password.length > 0;

  const submit = async () => {
    setError('');

    if (!email.trim() || !password) {
      setError('Completa el correo y la contraseña.');
      return;
    }

    try {
      setSubmitting(true);
      await login({ email: email.trim(), password });
    } catch (requestError) {
      setError(requestError instanceof ApiClientError ? requestError.message : 'No se pudo iniciar sesión.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.brand}>
          <View style={styles.logo}>
            <Image
              source={require('../../../assets/BioinSight.jpeg')}
              style={styles.logoImage}
              resizeMode="contain"
            />
          </View>

          <View>
            <Text style={styles.brandName}>BioinSight</Text>
            <Text style={styles.tagline}>Tu salud, interpretada</Text>
          </View>
        </View>

        <Text style={styles.title}>Bienvenido de vuelta</Text>
        <Text style={styles.subtitle}>
          Inicia sesión para ver tus resultados
        </Text>

        <Card>
          <Input
            label="Correo electrónico"
            value={email}
            placeholder="correo@ejemplo.com"
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            textContentType="emailAddress"
          />

          <Input
            label="Contraseña"
            value={password}
            placeholder="••••••••"
            secureTextEntry
            onChangeText={setPassword}
            autoCapitalize="none"
            textContentType="password"
          />

          {!!error && <Text style={styles.error}>{error}</Text>}

          <Button
            title={submitting ? 'Iniciando sesión...' : 'Iniciar sesión'}
            disabled={!formIsValid || submitting}
            onPress={() => void submit()}
          />
        </Card>

        <View style={styles.signupRow}>
          <Text style={styles.signupText}>¿No tienes cuenta?</Text>
          <Pressable
            accessibilityRole="button"
            hitSlop={10}
            onPress={() => navigation.navigate('Register')}
          >
            <Text style={styles.link}>Regístrate</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F7FC',
  },
  content: {
    padding: 24,
    justifyContent: 'center',
    flexGrow: 1,
  },
  brand: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
  },
  logo: {
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  logoImage: {
    width: 50,
    height: 50,
  },
  brandName: {
    fontSize: 23,
    fontWeight: '800',
    color: '#1D2B45',
  },
  tagline: {
    color: '#8B97A9',
  },
  title: {
    fontSize: 30,
    fontWeight: '800',
    color: '#1D2B45',
  },
  subtitle: {
    marginTop: 6,
    marginBottom: 20,
    fontSize: 16,
    color: '#9AA5B8',
  },
  error: { marginBottom: 14, color: '#D14343', fontWeight: '700' },
  signupRow: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 5,
  },
  signupText: {
    color: '#888',
  },
  link: {
    color: '#2F6CF0',
    fontWeight: '800',
  },
});
