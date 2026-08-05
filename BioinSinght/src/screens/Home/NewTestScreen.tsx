import { useMemo, useState } from 'react';
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import Button from '../../components/common/Button';
import Header from '../../components/common/Header';
import Input from '../../components/common/Input';
import { useAuth } from '../../context/AuthContext';
import { useClinicalTests } from '../../context/ClinicalTestsContext';
import type { AuthStackParamList } from '../../navigation/types';
import { ApiClientError } from '../../services/api';
import {
  CLINICAL_TEST_PRESETS,
  type ClinicalTestSourceMode,
  type TestAttachment,
} from '../../types/clinicalTest';

type Props = NativeStackScreenProps<AuthStackParamList, 'NewTest'>;

const MAX_FILE_SIZE = 5 * 1024 * 1024;

const guidance: Partial<Record<(typeof CLINICAL_TEST_PRESETS)[number]['id'], string>> = {
  fasting_glucose: 'Referencia general en adultos: normal hasta 99; precaución 100–125; alto desde 126 mg/dL.',
  hba1c: 'Referencia general: normal menor de 5.7%; precaución 5.7–6.4%; alto desde 6.5%.',
  total_cholesterol: 'Referencia general en adultos: normal menor de 200; precaución 200–239; alto desde 240 mg/dL.',
  triglycerides: 'Referencia general en adultos: normal menor de 150; precaución 150–199; alto desde 200 mg/dL.',
};

function todayInputValue() {
  const date = new Date();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${date.getFullYear()}-${month}-${day}`;
}

function parseOptionalNumber(value: string) {
  const normalized = value.trim().replace(',', '.');
  return normalized ? Number(normalized) : null;
}

export default function NewTestScreen({ navigation }: Props) {
  const { user } = useAuth();
  const { addTest } = useClinicalTests();
  const availableTests = useMemo(() => CLINICAL_TEST_PRESETS.filter((test) => (
    user?.healthInterests.includes(test.category)
  )), [user?.healthInterests]);
  const [sourceMode, setSourceMode] = useState<ClinicalTestSourceMode>('manual');
  const [testType, setTestType] = useState<(typeof CLINICAL_TEST_PRESETS)[number]['id']>(
    availableTests[0]?.id ?? 'fasting_glucose',
  );
  const [measuredAt, setMeasuredAt] = useState(todayInputValue());
  const [value, setValue] = useState('');
  const [referenceMin, setReferenceMin] = useState('');
  const [referenceMax, setReferenceMax] = useState('');
  const [notes, setNotes] = useState('');
  const [attachment, setAttachment] = useState<TestAttachment | undefined>();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const selectedTest = availableTests.find((test) => test.id === testType) ?? availableTests[0];

  const acceptAttachment = (file: TestAttachment) => {
    if (file.size && file.size > MAX_FILE_SIZE) {
      setError('El archivo no puede superar 5 MB.');
      return;
    }

    setAttachment(file);
    setError('');
  };

  const takePhoto = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      setError('Debes permitir el acceso a la cámara para tomar la foto.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ['images'],
      quality: 0.75,
    });

    if (!result.canceled) {
      const asset = result.assets[0];
      acceptAttachment({
        uri: asset.uri,
        name: asset.fileName ?? `resultado-${Date.now()}.jpg`,
        mimeType: asset.mimeType ?? 'image/jpeg',
        size: asset.fileSize,
      });
    }
  };

  const choosePhoto = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 0.8,
    });

    if (!result.canceled) {
      const asset = result.assets[0];
      acceptAttachment({
        uri: asset.uri,
        name: asset.fileName ?? `resultado-${Date.now()}.jpg`,
        mimeType: asset.mimeType ?? 'image/jpeg',
        size: asset.fileSize,
      });
    }
  };

  const choosePdf = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: 'application/pdf',
      copyToCacheDirectory: true,
      multiple: false,
    });

    if (!result.canceled) {
      const asset = result.assets[0];
      acceptAttachment({
        uri: asset.uri,
        name: asset.name,
        mimeType: asset.mimeType ?? 'application/pdf',
        size: asset.size,
      });
    }
  };

  const submit = async () => {
    setError('');

    if (!selectedTest) {
      setError('Selecciona al menos una preferencia de salud antes de registrar pruebas.');
      return;
    }

    const numericValue = parseOptionalNumber(value);
    const minimum = parseOptionalNumber(referenceMin);
    const maximum = parseOptionalNumber(referenceMax);

    if (numericValue === null || !Number.isFinite(numericValue) || numericValue < 0) {
      setError('Ingresa un valor numérico válido.');
      return;
    }

    if (!/^\d{4}-\d{2}-\d{2}$/.test(measuredAt) || Number.isNaN(Date.parse(`${measuredAt}T00:00:00.000Z`))) {
      setError('Ingresa la fecha con el formato AAAA-MM-DD.');
      return;
    }

    if ((minimum !== null && !Number.isFinite(minimum)) || (maximum !== null && !Number.isFinite(maximum))) {
      setError('Los límites del laboratorio deben ser números válidos.');
      return;
    }

    if (minimum !== null && maximum !== null && minimum >= maximum) {
      setError('El rango mínimo debe ser menor que el máximo.');
      return;
    }

    if (sourceMode === 'document' && !attachment) {
      setError('Selecciona una foto o PDF del resultado.');
      return;
    }

    try {
      setSaving(true);
      await addTest({
        category: selectedTest.category,
        testType: selectedTest.id,
        measuredAt: `${measuredAt}T00:00:00.000Z`,
        value: numericValue,
        referenceMin: minimum,
        referenceMax: maximum,
        notes: notes.trim() || null,
        sourceMode,
        attachment,
      });
      Alert.alert('Prueba registrada', 'El resultado fue guardado correctamente en tu cuenta.', [
        { text: 'Aceptar', onPress: () => navigation.goBack() },
      ]);
    } catch (requestError) {
      setError(requestError instanceof ApiClientError ? requestError.message : 'No se pudo guardar la prueba.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <SafeAreaView style={s.page}>
      <Header title="Nueva prueba" onBack={saving ? undefined : () => navigation.goBack()} />
      <ScrollView contentContainerStyle={s.content} keyboardShouldPersistTaps="handled">
        <Text style={s.title}>Registrar resultado clínico</Text>
        <Text style={s.subtitle}>Guarda el valor principal y, si deseas, el respaldo emitido por el laboratorio.</Text>

        <Text style={s.label}>Forma de registro</Text>
        <View style={s.segmented}>
          {(['manual', 'document'] as const).map((mode) => (
            <Pressable
              key={mode}
              style={[s.segment, sourceMode === mode && s.segmentActive]}
              onPress={() => setSourceMode(mode)}
            >
              <Text style={[s.segmentText, sourceMode === mode && s.segmentTextActive]}>
                {mode === 'manual' ? 'Solo valor' : 'Foto o PDF'}
              </Text>
            </Pressable>
          ))}
        </View>

        <Text style={s.label}>Tipo de prueba</Text>
        <View style={s.testGrid}>
          {availableTests.map((test) => (
            <Pressable
              key={test.id}
              style={[s.testCard, selectedTest?.id === test.id && s.testCardActive]}
              onPress={() => setTestType(test.id)}
            >
              <Text style={[s.testName, selectedTest?.id === test.id && s.testNameActive]}>{test.name}</Text>
              <Text style={s.testUnit}>{test.unit}</Text>
            </Pressable>
          ))}
        </View>

        {selectedTest && (
          <View style={s.formCard}>
            <Input label={`Valor (${selectedTest.unit})`} value={value} placeholder="Ej. 95" onChangeText={setValue} keyboardType="decimal-pad" />
            <Input label="Fecha de la prueba" value={measuredAt} placeholder="AAAA-MM-DD" onChangeText={setMeasuredAt} keyboardType="numbers-and-punctuation" />
            <Text style={s.rangeTitle}>Rango indicado por tu laboratorio (opcional)</Text>
            <View style={s.rangeRow}>
              <View style={s.rangeInput}><Input label="Mínimo" value={referenceMin} placeholder="Ej. 70" onChangeText={setReferenceMin} keyboardType="decimal-pad" /></View>
              <View style={s.rangeInput}><Input label="Máximo" value={referenceMax} placeholder="Ej. 99" onChangeText={setReferenceMax} keyboardType="decimal-pad" /></View>
            </View>
            <Text style={s.help}>{guidance[selectedTest.id] ?? 'Usaremos el rango de tu laboratorio para clasificar este resultado.'}</Text>

            <Text style={s.label}>Observaciones (opcional)</Text>
            <TextInput
              style={s.notes}
              value={notes}
              onChangeText={setNotes}
              placeholder="Ej. examen realizado en ayunas"
              placeholderTextColor="#A7B2C2"
              multiline
              maxLength={1000}
            />
          </View>
        )}

        {sourceMode === 'document' && (
          <View style={s.attachmentCard}>
            <Text style={s.attachmentTitle}>Respaldo del laboratorio</Text>
            <Text style={s.help}>JPG, PNG, WEBP o PDF. Máximo 5 MB.</Text>
            <View style={s.attachmentButtons}>
              <Pressable style={s.secondaryButton} onPress={() => void takePhoto()}><Text style={s.secondaryText}>Tomar foto</Text></Pressable>
              <Pressable style={s.secondaryButton} onPress={() => void choosePhoto()}><Text style={s.secondaryText}>Galería</Text></Pressable>
              <Pressable style={s.secondaryButton} onPress={() => void choosePdf()}><Text style={s.secondaryText}>PDF</Text></Pressable>
            </View>
            {attachment && (
              <View style={s.fileRow}>
                <View style={s.fileInfo}><Text style={s.fileName} numberOfLines={1}>{attachment.name}</Text><Text style={s.fileStatus}>Archivo listo para guardar</Text></View>
                <Pressable onPress={() => setAttachment(undefined)}><Text style={s.remove}>Quitar</Text></Pressable>
              </View>
            )}
          </View>
        )}

        <View style={s.disclaimer}>
          <Text style={s.disclaimerText}>La clasificación es orientativa y no sustituye la evaluación de un profesional de salud. Un resultado diagnóstico debe ser confirmado clínicamente.</Text>
        </View>
        {!!error && <Text style={s.error}>{error}</Text>}
        <Button title={saving ? 'Guardando prueba...' : 'Guardar prueba'} disabled={saving || !selectedTest} onPress={() => void submit()} />
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  page: { flex: 1, backgroundColor: '#F4F7FC' },
  content: { padding: 20, paddingBottom: 40 },
  title: { fontSize: 25, fontWeight: '800', color: '#243449' },
  subtitle: { marginTop: 7, marginBottom: 22, color: '#7F8DA5', lineHeight: 20 },
  label: { marginBottom: 9, color: '#4C5D78', fontWeight: '800', fontSize: 14 },
  segmented: { flexDirection: 'row', padding: 4, marginBottom: 22, borderRadius: 15, backgroundColor: '#E7ECF5' },
  segment: { flex: 1, paddingVertical: 11, borderRadius: 12, alignItems: 'center' },
  segmentActive: { backgroundColor: '#2F6CF0' },
  segmentText: { color: '#6D7C91', fontWeight: '800' },
  segmentTextActive: { color: '#FFF' },
  testGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 18 },
  testCard: { width: '48%', minHeight: 76, padding: 13, borderRadius: 15, backgroundColor: '#FFF', borderWidth: 1, borderColor: '#E2E8F2' },
  testCardActive: { borderColor: '#2F6CF0', backgroundColor: '#EDF3FF' },
  testName: { color: '#334258', fontWeight: '800', lineHeight: 18 },
  testNameActive: { color: '#245CD5' },
  testUnit: { marginTop: 5, color: '#8B97A9', fontSize: 12 },
  formCard: { padding: 17, borderRadius: 18, backgroundColor: '#FFF', marginBottom: 16 },
  rangeTitle: { marginBottom: 11, color: '#4C5D78', fontWeight: '800' },
  rangeRow: { flexDirection: 'row', gap: 10 },
  rangeInput: { flex: 1 },
  help: { color: '#7F8DA5', lineHeight: 18, fontSize: 12, marginBottom: 16 },
  notes: { minHeight: 90, padding: 13, borderWidth: 1, borderColor: '#DFE5EE', borderRadius: 14, textAlignVertical: 'top', color: '#223046' },
  attachmentCard: { padding: 17, borderRadius: 18, backgroundColor: '#FFF', marginBottom: 16 },
  attachmentTitle: { color: '#2A384C', fontWeight: '800', fontSize: 16, marginBottom: 6 },
  attachmentButtons: { flexDirection: 'row', gap: 8 },
  secondaryButton: { flex: 1, alignItems: 'center', paddingVertical: 11, borderRadius: 12, backgroundColor: '#EDF3FF' },
  secondaryText: { color: '#2F6CF0', fontWeight: '800', fontSize: 12 },
  fileRow: { flexDirection: 'row', alignItems: 'center', marginTop: 14, padding: 12, borderRadius: 13, backgroundColor: '#F4F7FC' },
  fileInfo: { flex: 1 },
  fileName: { color: '#2A384C', fontWeight: '800' },
  fileStatus: { marginTop: 3, color: '#2DAD72', fontSize: 12 },
  remove: { color: '#D14343', fontWeight: '800', marginLeft: 10 },
  disclaimer: { padding: 13, marginBottom: 14, borderRadius: 14, backgroundColor: '#FFF8E8', borderWidth: 1, borderColor: '#F1D997' },
  disclaimerText: { color: '#80631E', fontSize: 12, lineHeight: 17 },
  error: { color: '#D14343', fontWeight: '700', marginBottom: 14 },
});
