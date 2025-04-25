<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

<p align="center">
<a href="https://railway.app/new" target="_blank">
  <img src="https://img.shields.io/badge/deploy-Railway-0B0D0E.svg?&logo=railway" alt="Deploy on Railway" />
</a>
<a href="https://railway.app/new" target="_blank">
  <img src="https://img.shields.io/badge/docker-257bd6?logo=docker&logoColor=white" alt="Deploy on Railway" />
</a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/node-v22-ff3f59.svg" alt="Donate us"/></a>

</p>

# Backend de Resident Hub

Este es el backend para la aplicación Resident Hub. Está construido utilizando [NestJS](https://nestjs.com/) e incluye varias características como autenticación, gestión de usuarios y verificaciones de salud. El proyecto utiliza Prisma como ORM y soporta pruebas unitarias, de integración y de extremo a extremo.

## Requisitos Previos

Antes de iniciar el proyecto, asegúrate de tener instalados los siguientes elementos:

- Node.js (v22 o superior)
- npm
- Prisma CLI (`npm install -g prisma`)

## Instalación

1. Clona el repositorio:

2. Instala las dependencias:

```bash
npm install
```

3. Configura las variables de entorno:

- Crea un archivo `.env` en el directorio raíz.
- Agrega las variables de entorno requeridas (consulta `.env.example` si está disponible).

4. Ejecuta las migraciones de Prisma:

```bash
npx prisma migrate deploy
```

## Comandos

Aquí tienes una lista de todos los comandos disponibles en el proyecto:

### Docker

Con Docker puedes levantar el proyecto, crear una base de datos y ejecutar las migraciones de Prisma con un solo comando!

- **Ejecutar el proyecto con Docker en Local:**

  ```bash
  docker compose up --build -d
  ```

### Desarrollo

- **Inicia el servidor de desarrollo:**

  ```bash
  npm run start:dev
  ```

- **Inicia el servidor de desarrollo con migraciones de Prisma:**

  ```bash
  npm run start:dev:migrate
  ```

### Linter y Formateo

- **Ejecuta el linter en el código:**

  ```bash
  npm run lint
  ```

- **Formatea el código:**
  ```bash
  npm run format
  ```

### Pruebas

- **Ejecuta todas las pruebas (unitarias, de integración y e2e):**

  ```bash
  npm run test:all
  ```

- **Ejecuta pruebas unitarias:**

  ```bash
  npm run test:unit
  ```

- **Ejecuta pruebas de integración:**

  ```bash
  npm run test:integration
  ```

- **Ejecuta pruebas de extremo a extremo (e2e):**

  ```bash
  npm run test:e2e
  ```

### Prisma

- **Reinicia la base de datos para pruebas de integración:**
  ```bash
  npm run migrate:integration
  ```