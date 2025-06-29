LINK A DOCKER HUB : https://hub.docker.com/r/leaprado3/adoptme-api 




API REST - Sistema de Adopción de Mascotas
Una API REST completa para manejar un sistema de adopción de mascotas construida con Node.js, Express y MongoDB.
🚀 Características

Gestión de Usuarios: CRUD completo para usuarios
Gestión de Mascotas: CRUD completo para mascotas
Sistema de Adopciones: Proceso completo de adopción
Autenticación: Sistema de sesiones y autenticación
Logs: Sistema de logging con Winston
Tests: Tests funcionales completos
Docker: Containerización completa

📋 Prerrequisitos

Node.js 18+
MongoDB
Docker (opcional)

🛠️ Instalación Local

Clonar el repositorio

bashgit clone <url-del-repositorio>
cd proyecto-adopciones

Instalar dependencias

bashnpm install

Configurar variables de entorno
Crear archivo .env en la raíz del proyecto:

envPORT=8080
MONGO_URL=mongodb://localhost:27017/adoptme
MONGO_URL_TEST=mongodb://localhost:27017/adoptme_test
JWT_SECRET=tu_jwt_secret_aqui
NODE_ENV=development

Ejecutar en modo desarrollo

bashnpm run dev

Ejecutar en modo producción

bashnpm start
🐳 Instalación con Docker
Opción 1: Usar imagen de DockerHub (Recomendado)
bash# Descargar y ejecutar la imagen
docker run -d \
  --name adoptme-api \
  -p 8080:8080 \
  -e MONGO_URL=mongodb://host.docker.internal:27017/adoptme \
  -e JWT_SECRET=tu_jwt_secret_aqui \
  tu-usuario/adoptme-api:latest
🔗 Imagen en DockerHub: tu-usuario/adoptme-api
Opción 2: Construir imagen localmente

Construir la imagen

bashdocker build -t adoptme-api .

Ejecutar el contenedor

bashdocker run -d \
  --name adoptme-api \
  -p 8080:8080 \
  -e MONGO_URL=mongodb://host.docker.internal:27017/adoptme \
  -e JWT_SECRET=tu_jwt_secret_aqui \
  adoptme-api
Docker Compose (Incluye MongoDB)
Crear archivo docker-compose.yml:
yamlversion: '3.8'
services:
  app:
    image: tu-usuario/adoptme-api:latest
    ports:
      - "8080:8080"
    environment:
      - MONGO_URL=mongodb://mongo:27017/adoptme
      - JWT_SECRET=tu_jwt_secret_aqui
      - NODE_ENV=production
    depends_on:
      - mongo
    restart: unless-stopped

  mongo:
    image: mongo:6.0
    ports:
      - "27017:27017"
    volumes:
      - mongo_data:/data/db
    restart: unless-stopped

volumes:
  mongo_data:
Ejecutar con:
bashdocker-compose up -d
🧪 Testing
bash# Ejecutar todos los tests
npm test

# Ejecutar tests específicos
npm test -- --grep "adoptions"
📚 API Endpoints
Usuarios

GET /api/users - Obtener todos los usuarios
GET /api/users/:uid - Obtener usuario específico
PUT /api/users/:uid - Actualizar usuario
DELETE /api/users/:uid - Eliminar usuario

Mascotas

GET /api/pets - Obtener todas las mascotas
GET /api/pets/:pid - Obtener mascota específica
POST /api/pets - Crear nueva mascota
PUT /api/pets/:pid - Actualizar mascota
DELETE /api/pets/:pid - Eliminar mascota

Adopciones

GET /api/adoptions - Obtener todas las adopciones
GET /api/adoptions/:aid - Obtener adopción específica
POST /api/adoptions/:uid/:pid - Crear nueva adopción

Autenticación

POST /api/sessions/register - Registrar usuario
POST /api/sessions/login - Iniciar sesión
POST /api/sessions/logout - Cerrar sesión

Mocks (Para Testing)

GET /api/mocks/mockingpets - Generar mascotas de prueba
GET /api/mocks/mockingusers - Generar usuarios de prueba

📖 Documentación API
La documentación completa de la API está disponible en Swagger:
URL: http://localhost:8080/api-docs (cuando el servidor esté ejecutándose)
Módulo de Usuarios - Documentación Swagger
El módulo de usuarios está completamente documentado con Swagger e incluye:

Esquemas de datos para User
Documentación de todos los endpoints
Ejemplos de requests y responses
Códigos de error y sus significados
Validaciones de entrada

🏗️ Arquitectura del Proyecto
src/
├── controllers/        # Controladores de rutas
├── dao/               # Data Access Objects
├── dto/               # Data Transfer Objects
├── middlewares/       # Middlewares personalizados
├── models/           # Modelos de MongoDB
├── repository/       # Capa de repositorio
├── routes/           # Definición de rutas
├── services/         # Lógica de negocio
├── utils/            # Utilidades y helpers
└── views/            # Vistas Handlebars
🔧 Variables de Entorno
VariableDescripciónValor por DefectoPORTPuerto del servidor8080MONGO_URLURL de conexión a MongoDB-MONGO_URL_TESTURL de MongoDB para tests-JWT_SECRETSecreto para JWT-NODE_ENVEntorno de ejecucióndevelopment
🐛 Troubleshooting
Problemas Comunes

Error de conexión a MongoDB

Verificar que MongoDB esté ejecutándose
Comprobar la URL de conexión en .env


Error de permisos en Docker

Verificar que Docker tiene permisos suficientes
En Linux, puede requerir sudo


Puerto en uso

Cambiar el puerto en .env
Verificar procesos que usen el puerto: lsof -i :8080



Logs
Los logs se guardan en el directorio logs/ y incluyen:

error.log - Errores de la aplicación
combined.log - Todos los logs
Logs en consola durante desarrollo

🤝 Contribución

Fork el proyecto
Crear una rama para tu feature (git checkout -b feature/AmazingFeature)
Commit tus cambios (git commit -m 'Add some AmazingFeature')
Push a la rama (git push origin feature/AmazingFeature)
Abrir un Pull Request


👥 Autores

Tu Nombre - @lea-prado

🙏 Agradecimientos

Express.js
MongoDB
Mongoose
Winston
Mocha & Chai
Docker


