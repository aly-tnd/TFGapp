# Etapa 1: Build
FROM node:20-alpine as builder
WORKDIR /app
COPY package*.json ./
RUN npm install --legacy-peer-deps
COPY . .
RUN npm run build

# Etapa 2: Servidor
FROM nginx:alpine
# OJO: Angular 17+ crea la carpeta 'browser'.
# Si usas una versión vieja, quita '/browser' del final de la siguiente línea:
COPY --from=builder /app/dist/frontend/browser /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80