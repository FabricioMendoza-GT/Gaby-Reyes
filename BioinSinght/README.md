# BioinSight

Aplicación móvil Expo/React Native con backend Express y PostgreSQL para visualizar y dar seguimiento a resultados clínicos.

## Funciones conectadas a PostgreSQL

- Registro e inicio de sesión reales con JWT y contraseñas cifradas con bcrypt.
- Sesión persistente y cifrada en Android/iOS mediante Expo SecureStore.
- Perfil con nombre, apellido y correo editables.
- Cambio de contraseña validando la contraseña actual.
- Preferencias de salud persistentes por usuario.
- Activación y desactivación de notificaciones persistente.
- Cierre de sesión real.
- Migraciones TypeORM y prueba integral contra PostgreSQL.

Los resultados clínicos, alertas y evolución continúan usando los datos de demostración de `src/data`.

## Tecnologías

### Aplicación

- Expo SDK 54
- React Native 0.81
- React 19
- TypeScript
- React Navigation 7
- Expo SecureStore

### Backend

- Node.js y Express 5
- TypeScript
- PostgreSQL
- TypeORM
- JWT y bcrypt
- express-validator

## Configuración del backend

El archivo `backend/.env` debe contener:

```env
PORT=4000
DATABASE_URL="postgresql://usuario:contrasena@host/base?sslmode=require"
JWT_SECRET="un-secreto-largo-y-aleatorio"
JWT_EXPIRES_IN="7d"
```

Instala, migra e inicia el backend:

```bash
cd backend
npm install
npm run migration:run
npm run dev
```

La API queda disponible en `http://localhost:4000/api` y su estado se consulta en `GET /api/health`.

## Configuración de la aplicación

Instala e inicia Expo:

```bash
npm install
npm start
```

La aplicación usa estas URL predeterminadas:

- Android Emulator: `http://10.0.2.2:4000/api`
- Expo Web y simulador iOS: `http://localhost:4000/api`

Para probar desde Expo Go en un teléfono físico, copia `.env.example` a `.env` y reemplaza la URL con la IP local de la computadora:

```env
EXPO_PUBLIC_API_URL=http://192.168.1.50:4000/api
```

El teléfono y la computadora deben estar conectados a la misma red.

## Prueba real de persistencia

Con la base configurada y migrada:

```bash
cd backend
npm run test:e2e
```

La prueba usa la API real y PostgreSQL para verificar registro, login, edición de perfil, preferencias, notificaciones y cambio de contraseña. El usuario temporal se elimina al finalizar. Para conservarlo y revisarlo en la base:

```bash
KEEP_TEST_USER=true npm run test:e2e
```

## Endpoints implementados

| Método | Ruta | Función |
| --- | --- | --- |
| POST | `/api/auth/register` | Registrar usuario |
| POST | `/api/auth/login` | Iniciar sesión |
| GET | `/api/auth/me` | Recuperar sesión |
| GET | `/api/profile` | Consultar perfil |
| PATCH | `/api/profile` | Actualizar nombre, apellido o correo |
| PUT | `/api/profile/preferences` | Guardar intereses y notificaciones |
| PUT | `/api/profile/password` | Cambiar contraseña |

Las rutas de perfil requieren `Authorization: Bearer <token>`.

## Verificación técnica

```bash
npx tsc --noEmit
EXPO_NO_TELEMETRY=1 npx expo-doctor

cd backend
npm run build
```

## Estructura principal

```text
src/
├── components/
├── context/       AuthContext y PreferencesContext
├── navigation/
├── screens/
├── services/      Cliente API y almacenamiento de sesión
└── types/

backend/src/
├── config/
├── controllers/
├── entities/
├── migrations/
├── repositories/
├── routes/
├── scripts/
├── services/
└── validations/
```
