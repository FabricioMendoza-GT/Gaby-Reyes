# BioinSight Backend

API REST de BioinSight construida con Express, TypeScript, TypeORM y PostgreSQL.

## Inicio rápido

```bash
npm install
npm run migration:run
npm run dev
```

Variables requeridas en `.env`:

```env
PORT=4000
DATABASE_URL="postgresql://usuario:contrasena@host/base?sslmode=require"
JWT_SECRET="un-secreto-largo-y-aleatorio"
JWT_EXPIRES_IN="7d"
```

## Comandos

```bash
npm run dev
npm run build
npm start
npm run migration:run
npm run migration:revert
npm run test:e2e
```

`test:e2e` crea un usuario temporal, verifica todo el flujo de autenticación, perfil y preferencias contra la base real, y elimina ese usuario al terminar. Usa `KEEP_TEST_USER=true npm run test:e2e` si necesitas conservarlo.

## API

Todas las respuestas usan el formato `{ success, message, data }`. Los errores usan `{ success, message, errors }`.

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `GET /api/profile`
- `PATCH /api/profile`
- `PUT /api/profile/preferences`
- `PUT /api/profile/password`
- `GET /api/health`

Las rutas de perfil y `/api/auth/me` requieren un token JWT Bearer.
