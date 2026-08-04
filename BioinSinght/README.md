# BioinSight

BioinSight es una aplicación móvil creada con Expo y React Native para visualizar y seguir resultados clínicos de forma clara. La app está pensada como un panel de salud con navegación por autenticación, onboarding y pestañas principales.

## Lo importante del proyecto

- Flujo de acceso con onboarding, login y entrada al área principal.
- Dashboard con estado general, acciones rápidas y últimos resultados.
- Historial clínico con búsqueda, filtros por categoría y badges por estado.
- Alertas de salud con prioridad visual diferenciada.
- Evolución de glucosa con resumen, gráfico simple y métricas clave.
- Perfil de usuario con intereses de salud guardados en contexto.
- Componentes reutilizables, tema y estilos organizados dentro de `src`.

## Stack

- Expo SDK 54
- React Native 0.81
- React 19
- TypeScript
- React Navigation v7
- React Native Gesture Handler
- React Native Reanimated
- React Native Safe Area Context

## Flujo de navegación

La app se divide en dos capas:

### Acceso

- `Onboarding`: permite elegir intereses de salud como diabetes, salud cardiovascular, función renal y salud general.
- `Login`: pantalla de inicio de sesión simulada.
- `Main`: contenedor de la navegación principal después de entrar.

### Pestañas principales

- `Dashboard`: resumen general, accesos rápidos y resultados recientes.
- `History`: historial clínico con buscador y filtros.
- `Alerts`: lista de alertas y su nivel de prioridad.
- `Evolution`: evolución visual de glucosa en ayunas.
- `Profile`: datos de usuario, intereses seleccionados y cierre de sesión.

La barra inferior personalizada incluye un botón central de acción rápida que abre el onboarding para modificar preferencias.

## Arquitectura

El proyecto dejó de depender de una sola pantalla en `App.tsx` y se organizó por responsabilidades dentro de `src`.

```text
src/
├── components/       Componentes reutilizables de UI
│   ├── common/
│   ├── dashboard/
│   └── navigation/
├── constants/        Rutas y constantes compartidas
├── context/          Estado global de preferencias
├── data/             Datos de ejemplo
├── navigation/       Stack, tabs y tipos de navegación
├── screens/          Pantallas de auth y home
│   ├── Auth/
│   │   ├── LoginScreen.tsx
│   │   └── OnboardingScreen.tsx
│   └── Home/
│       ├── AlertsScreen.tsx
│       ├── DashboardScreen.tsx
│       ├── EvolutionScreen.tsx
│       ├── HistoryScreen.tsx
│       └── ProfileScreen.tsx
├── styles/           Estilos específicos de pantallas
├── theme/            Colores, radios y espaciado
└── types/            Tipos de dominio
```

## Datos y comportamiento actual

- Los resultados clínicos y alertas vienen de datos de ejemplo locales.
- El login no valida contra un backend real todavía.
- Las preferencias de intereses se guardan en estado de React Context.
- El botón de cerrar sesión vuelve a la pantalla de login.
- El botón de registrar del dashboard lleva al onboarding.

## Pantallas destacadas

### Dashboard

Muestra el nombre de la paciente, el estado general, acciones rápidas y una lista de resultados recientes.

### Historial

Incluye búsqueda por texto y filtros por categoría para localizar exámenes con rapidez.

### Alertas

Resume eventos relevantes con una alerta destacada y un historial de notificaciones.

### Evolución

Presenta una visualización sencilla de la glucosa en ayunas, junto con promedio, mínimo y máximo.

### Perfil

Muestra la información del usuario, sus intereses activos y accesos de configuración.

## Scripts

```bash
npm install
npm start
npm run android
npm run ios
npm run web
```

Si Expo Go no carga por red local, puedes iniciar el proyecto con túnel:

```bash
npx expo start --tunnel --clear
```

## Cómo correrlo

1. Instala dependencias con `npm install`.
2. Arranca Expo con `npm start`.
3. Abre la app en Expo Go, Android Emulator, iOS Simulator o navegador.

## Assets

- El logo principal usado en el login está en `assets/BioinSight.png`.

## Estado actual

El proyecto ya tiene navegación, pantallas y estilos base listos. Lo que falta para producción es integrar autenticación real, persistencia y conexión con backend.
