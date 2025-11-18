# ---- Etapa 1: build ----
FROM node:18-alpine AS build

# Crear directorio de trabajo
WORKDIR /app

# Build arg and default env: ensure Vite uses a relative API path unless explicitly overridden
ARG VITE_API_URL=/api
ENV VITE_API_URL=${VITE_API_URL}

# Copiar archivos de configuración e instalar dependencias
COPY package*.json ./
RUN npm ci --silent || npm install --silent

# Copiar el resto del código fuente
COPY . .

# Compilar la app para producción
# Vite will inline `import.meta.env.VITE_API_URL` at build time.
RUN npm run build

# ---- Etapa 2: servir con Nginx ----
FROM nginx:alpine

# Copiar el build al directorio público de Nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Copiar configuración custom (opcional)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Exponer el puerto por el que servirá Nginx
EXPOSE 80

# Comando por defecto
CMD ["nginx", "-g", "daemon off;"]
