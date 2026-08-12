# BioinSight

Aplicación móvil Expo/React Native que consume un backend Express y PostgreSQL desplegado en Render para visualizar y dar seguimiento a resultados clínicos.

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

## Backend remoto

El backend ya no se usa de forma local en este repo. Vive en un repositorio separado y se consume desde Render en `https://backend-bioinsight.onrender.com/api`.

Para que funcione correctamente, el backend desplegado debe tener:

```env
PORT=4000
DATABASE_URL="postgresql://usuario:contrasena@host/base?sslmode=require"
JWT_SECRET="un-secreto-largo-y-aleatorio"
JWT_EXPIRES_IN="7d"
```

En Render, el servicio debe arrancar con `npm start` y exponer la API bajo `/api`. Si cambias la versión del backend en su repo, redepliega ese servicio y verifica que `GET /api/health` responda correctamente.

## Configuración de la aplicación

Instala e inicia Expo:

```bash
npm install
npm start
```

La aplicación usa por defecto la URL de Render. Si necesitas apuntar a otro backend, crea un archivo `.env` con:

```env
EXPO_PUBLIC_API_URL=https://backend-bioinsight.onrender.com/api
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
```
