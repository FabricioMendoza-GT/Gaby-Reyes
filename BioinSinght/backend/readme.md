# BioinSight Backend

## Objetivo del Proyecto

Este repositorio contiene el backend oficial de **BioinSight**, una aplicación móvil desarrollada con React Native (Expo) para la gestión y visualización de resultados clínicos.

El backend será desarrollado utilizando:

* TypeScript
* Express.js
* PostgreSQL
* Prisma ORM
* JWT Authentication

El objetivo es proporcionar una API REST segura, escalable y mantenible que permita al frontend consumir información clínica en tiempo real.

---

# Filosofía de Desarrollo

## IMPORTANTE

Todo el desarrollo debe realizarse **paso a paso**.

**NO** desarrollar funcionalidades futuras.

**NO** generar código innecesario.

**NO** crear endpoints que todavía no se hayan solicitado.

Cada fase debe quedar completamente terminada antes de comenzar la siguiente.

Al finalizar cada etapa se debe esperar validación antes de continuar.

---

# Tecnologías

Backend

* Node.js
* Express
* TypeScript

Base de Datos

* PostgreSQL
* Prisma ORM

Autenticación

* JWT
* bcrypt

Validaciones

* express-validator

Variables de entorno

* dotenv

Desarrollo

* ts-node-dev

---

# Arquitectura

```
src/

config/
controllers/
middlewares/
repositories/
routes/
services/
utils/

app.ts
server.ts

prisma/

schema.prisma

.env
package.json
tsconfig.json
```

Se debe mantener una arquitectura limpia separando:

* Controllers
* Services
* Repositories
* Routes

Nunca colocar lógica de negocio dentro de las rutas.

---

# Convenciones

Usar TypeScript estricto.

Todos los controladores deben devolver respuestas JSON consistentes.

Crear manejo centralizado de errores.

Utilizar async/await.

No utilizar callbacks.

Todo acceso a base de datos debe hacerse mediante Prisma.

---

# Formato de respuesta

Todas las respuestas exitosas deben seguir este formato:

```json
{
    "success": true,
    "message": "",
    "data": {}
}
```

Errores:

```json
{
    "success": false,
    "message": "",
    "errors": []
}
```

---

# Flujo General

Frontend (React Native)

↓

Express API

↓

JWT

↓

Controllers

↓

Services

↓

Repositories

↓

Prisma

↓

PostgreSQL

---

# Roadmap

## Fase 1

Infraestructura

* Crear proyecto Express
* Configurar TypeScript
* Configurar Prisma
* Configurar PostgreSQL
* Configurar variables de entorno
* Configurar scripts
* Configurar estructura de carpetas

Cuando esta fase esté lista se debe detener el desarrollo.

Esperar validación.

---

## Fase 2

Autenticación

Crear autenticación real.

Debe incluir:

Registro de usuario

Login

JWT

Hash de contraseña con bcrypt

Middleware de autenticación

Endpoint para obtener el usuario autenticado.

Al finalizar detener el desarrollo.

Esperar validación.

---

## Fase 3

Perfil

CRUD del usuario.

Actualizar datos personales.

Cambio de contraseña.

Preferencias de salud.

Detener el desarrollo.

Esperar validación.

---

## Fase 4

Exámenes

CRUD completo.

Tipos de examen.

Laboratorio.

Fecha.

Resultados asociados.

Esperar validación.

---

## Fase 5

Resultados Clínicos

CRUD.

Parámetros.

Valores.

Unidades.

Rangos normales.

Estado del resultado.

Esperar validación.

---

## Fase 6

Dashboard

Generar información para:

* Últimos exámenes
* Alertas
* Estado general
* Accesos rápidos
* Próximas citas

Esperar validación.

---

## Fase 7

Historial

Listado completo.

Filtros.

Búsqueda.

Ordenamiento.

Paginación.

Esperar validación.

---

## Fase 8

Alertas

Alertas automáticas.

Prioridad.

Marcado como leído.

Esperar validación.

---

## Fase 9

Evolución

Series históricas.

Glucosa.

Triglicéridos.

Colesterol.

Hemoglobina.

Esperar validación.

---

# Primera tarea para GitHub Copilot

## IMPORTANTE

Comenzaremos únicamente con la autenticación.

No avanzar a ninguna otra funcionalidad.

La tarea actual consiste en desarrollar únicamente lo necesario para tener un sistema de autenticación completamente funcional.

## Objetivos

Implementar:

* Registro de usuarios
* Inicio de sesión
* Hash de contraseñas usando bcrypt
* JWT
* Middleware de autenticación
* Endpoint `/auth/me`
* Validaciones
* Manejo de errores
* Prisma conectado a PostgreSQL

## Base de datos inicial

Modelo User.

Debe contener como mínimo:

* id
* firstName
* lastName
* email
* password
* createdAt
* updatedAt

El correo electrónico debe ser único.

Las contraseñas nunca deben almacenarse en texto plano.

---

# Reglas para GitHub Copilot

Siempre mantener el código modular.

Nunca generar código duplicado.

Seguir buenas prácticas SOLID cuando sea posible.

Utilizar nombres descriptivos.

Agregar comentarios únicamente cuando aporten valor.

Nunca desarrollar funcionalidades futuras.

Esperar la siguiente instrucción antes de continuar con la siguiente fase.
