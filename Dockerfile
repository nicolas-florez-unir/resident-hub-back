# Etapa 1: Construcción de la aplicación
FROM node:22-alpine AS builder

WORKDIR /app

# Copiar archivos esenciales para instalar dependencias
COPY package.json package-lock.json ./

# Instalar dependencias solo para producción
RUN npm ci

# Copiar el resto de la aplicación
COPY . .

COPY .env.build /app/.env

RUN npx prisma generate

# Construir la aplicación
RUN npm run build

RUN npm prune --omit=dev

# Etapa 2: Imagen final optimizada para producción
FROM node:22-alpine AS runner

WORKDIR /app

# Copiar solo lo necesario desde la etapa de construcción
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/.env ./.env
COPY --from=builder /app/prisma ./prisma
COPY package.json ./

# Exponer el puerto en el que corre NestJS (cambiar si es diferente)
EXPOSE 3000

# Ejecutar migraciones y levantar la app
CMD npx prisma migrate deploy && node dist/src/main
