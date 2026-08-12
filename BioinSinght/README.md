# BioinSight

Aplicación móvil construida con Expo/React Native para registrar, visualizar y dar seguimiento a resultados clínicos. Este repositorio contiene solo el frontend móvil.

## Estado actual

- Backend productivo en Render: `https://backend-bioinsight.onrender.com/api`
- Autenticación real con JWT
- Perfil y preferencias persistentes
- Registro de pruebas clínicas con adjuntos
- Vista previa de adjuntos de imagen en Historial

## Repositorios y despliegue

- Este repositorio: app móvil Expo
- Backend: repositorio separado (desplegado en Render)

El frontend no depende de un backend local. Si el backend cambia, solo debes redeployar ese servicio en Render.

## Stack técnico

- Expo SDK 54
- React Native 0.81
- React 19
- TypeScript
- React Navigation 7
- Expo SecureStore
- Expo Image Picker y Document Picker

## Requisitos

- Node.js 20+
- npm 10+
- Expo Go instalado en Android/iOS para pruebas móviles
- Cuenta Expo para compilar APK con EAS

## Configuración de entorno

1. Instala dependencias:

```bash
npm install
```

2. Crea `.env` desde `.env.example`:

```bash
cp .env.example .env
```

En Windows PowerShell:

```powershell
Copy-Item .env.example .env
```

3. Valor recomendado:

```env
EXPO_PUBLIC_API_URL=https://backend-bioinsight.onrender.com/api
```

## Resolución de URL API

La app resuelve la URL en este orden:

1. `EXPO_PUBLIC_API_URL` (archivo `.env`)
2. `expo.extra.apiUrl` en `app.json`
3. URL de Render por defecto

Referencia de implementación: `src/services/api.ts`.

## Ejecutar con Expo Go

1. Inicia Expo:

```bash
npx expo start --tunnel
```

2. Abre Expo Go en el teléfono.
3. Escanea el QR del terminal.

## Flujos que debes probar

1. Registro de usuario nuevo
2. Inicio de sesión
3. Edición de perfil
4. Cambio de contraseña
5. Guardado de preferencias
6. Registro de prueba clínica manual
7. Registro de prueba clínica con adjunto (imagen o PDF)
8. En Historial, apertura de imagen adjunta con `Ver imagen`

Nota: para PDF se mantiene el comportamiento actual sin visor integrado.

## API esperada por la app

Base URL: `/api`

- `POST /auth/register`
- `POST /auth/login`
- `GET /auth/me`
- `GET /profile`
- `PATCH /profile`
- `PUT /profile/preferences`
- `PUT /profile/password`
- `GET /tests`
- `POST /tests`
- `GET /tests/:id/attachment`
- `GET /health`

Rutas privadas requieren `Authorization: Bearer <token>`.

## Estructura principal

```text
src/
	components/
	constants/
	context/
	navigation/
	screens/
	services/
	styles/
	theme/
	types/
	utils/
```

## Scripts del proyecto

- `npm start`: inicia Expo
- `npm run android`: abre Android
- `npm run ios`: abre iOS
- `npm run web`: abre Web

## Validación técnica recomendada

```bash
npx tsc --noEmit
EXPO_NO_TELEMETRY=1 npx expo-doctor
```

## Generar APK con EAS

El perfil `preview` ya está configurado para APK en `eas.json`.

1. Inicia sesión en Expo:

```bash
npx eas login
```

2. Verifica sesión:

```bash
npx eas whoami
```

3. Lanza el build APK:

```bash
npx eas build --platform android --profile preview
```

4. Consulta builds recientes:

```bash
npx eas build:list --platform android --limit 5
```

## Checklist antes de compartir APK

1. Backend en Render responde `GET /api/health` con `success: true`
2. Login y registro funcionan desde la app
3. Perfil y preferencias persisten al cerrar y abrir la app
4. Registro de pruebas y adjuntos funciona
5. Historial muestra botón de imagen solo para adjuntos `image/*`

## Solución de problemas

- Error de red en app:
	revisa `EXPO_PUBLIC_API_URL` y que Render esté activo.
- Primer request lento:
	normal en plan Free de Render por cold start.
- `401 No autorizado` en rutas privadas:
	valida sesión/token y vuelve a iniciar sesión.
- Cambios de backend no reflejados:
	confirma deploy correcto en Render y commit esperado.
