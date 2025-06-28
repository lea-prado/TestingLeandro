
# Usar imagen base de Node.js LTS (Long Term Support)
FROM node:18-alpine

# Información del mantenedor
LABEL maintainer="Leandro Prado <leaprado3@gmail.com>"
LABEL description="API REST para sistema de adopción de mascotas"

# Instalar curl para healthcheck
RUN apk add --no-cache curl

# Crear directorio de trabajo en el contenedor
WORKDIR /app

# Crear usuario no-root para seguridad
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodeuser -u 1001

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar dependencias - usar npm install en lugar de npm ci para mayor compatibilidad
RUN npm install --only=production --silent && \
    npm cache clean --force

# Copiar el código fuente
COPY src/ ./src/

# Copiar otros archivos necesarios (si existen)
COPY *.js ./

# Crear directorio de logs con permisos apropiados
RUN mkdir -p logs && \
    chown -R nodeuser:nodejs /app

# Cambiar al usuario no-root
USER nodeuser

# Exponer el puerto de la aplicación
EXPOSE 8080

# Variables de entorno por defecto
ENV NODE_ENV=production
ENV PORT=8080

# Comando para verificar que la aplicación está funcionando
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:8080/ || exit 1

# Comando para ejecutar la aplicación
CMD ["npm", "start"]