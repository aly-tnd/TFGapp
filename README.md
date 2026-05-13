# TFG - Proyecto de Gestión de Espectrometría

Un proyecto Full-Stack moderno basado en **Clean Architecture** y **Domain-Driven Design (DDD)** para la gestión de datos de espectrometría, usuarios y registros de muestras.

## 🏗️ Arquitectura

El proyecto implementa una arquitectura limpia con separación clara de responsabilidades:

### **Backend** (Express + TypeScript + MongoDB)

```
backend/src/
├── shared/                    # Código compartido
│   ├── middleware/           # Middlewares globales (autenticación, errores)
│   └── services/            # Servicios compartidos (AuthService)
├── domain/
│   ├── apiGestion/          # Dominio de Gestión de Usuarios
│   │   ├── application/     # Use Cases, DTOs, Mappers
│   │   ├── domain/          # Entities, Repository Interfaces
│   │   ├── http/            # Controllers
│   │   └── infrastructure/  # Implementaciones (MongoDB)
│   └── espectrometro/       # Dominio de Espectrometría
│       ├── application/     # Use Cases
│       ├── entities/        # Entities
│       ├── repositories/    # Interfaces
│       └── infrastructure/  # Controllers, DB, Routes
└── index.ts                  # Punto de entrada
```

**Principios:**
- ✅ Inyección de Dependencias en `app.container.ts`
- ✅ Use Cases independientes de frameworks
- ✅ Repositorios como interfaces implementadas en Infrastructure
- ✅ Middlewares centralizados para error handling y autenticación
- ✅ JWT para seguridad

### **Frontend** (Angular 21 + TypeScript)

```
frontend/src/app/
├── guards/                     # Guards de rutas (auth.guard)
├── services/                   # Servicios HTTP (usuarioService, AuthService, etc.)
├── shared/
│   └── interceptors/          # HTTP Interceptors (autenticación)
├── ApiGestionFront/
│   ├── class/                 # Modelos (Usuario)
│   └── components/            # Componentes Angular
│       ├── login/
│       ├── menu/
│       ├── crear-usuario/
│       ├── listar-usuarios/
│       ├── ver-usuario/
│       ├── crear-registro/
│       └── crear-espectrometro/
└── app.config.ts              # Configuración de la aplicación
```

**Principios:**
- ✅ Componentes standalone
- ✅ HTTP Interceptor para agregar tokens JWT automáticamente
- ✅ Guards para proteger rutas
- ✅ Servicios con Observable patterns
- ✅ Validación en cliente

---

## 📋 Requisitos

- [Docker](https://www.docker.com/get-started) & [Docker Compose](https://docs.docker.com/compose/)
- Node.js v20+ (solo para desarrollo local)
- npm v10+ (solo para desarrollo local)

---

## 🚀 Cómo Ejecutar el Proyecto

### **Opción 1: Con Docker Compose (Recomendado)**

```bash
# Clona el repositorio
git clone <tu-repo>
cd TFG

# Construye y levanta los servicios
docker-compose up --build

# Accede a las aplicaciones:
# Frontend: http://localhost:8080
# Backend:  http://localhost:3000
# MongoDB:  mongodb://admin:password123@localhost:27017
```

### **Opción 2: Desarrollo Local**

#### **Backend:**

```bash
cd backend

# Instala dependencias
npm install

# Desarrolla con hot-reload
npm run dev

# O compilar y ejecutar
npm run build
npm start

# Ejecutar tests
npm test
```

**Variables de entorno (.env):**
```env
MONGO_URI=mongodb://admin:password123@localhost:27017/mi_proyecto_db?authSource=admin
JWT_SECRET=tu-secreto-muy-seguro
JWT_EXPIRATION=24h
PORT=3000
```

#### **Frontend:**

```bash
cd frontend

# Instala dependencias
npm install

# Desarrollo con hot-reload
npm start

# O compilar para producción
npm run build

# Ejecutar tests
npm test
```

---

## 🔐 Autenticación y Seguridad

### **Backend**

- **JWT (JSON Web Tokens):** Tokens con expiración configurable
- **Bcryptjs:** Hashing de contraseñas
- **Middleware de Autenticación:** Protege rutas específicas
- **Roles:** Soporte para roles de usuario (admin, user)

**Endpoints públicos:**
- `POST /api/login` - Inicio de sesión
- `POST /api/usuarios` - Crear usuario

**Endpoints protegidos (requieren JWT):**
- `GET /api/usuarios` - Listar usuarios (solo admin)
- `GET /api/usuarios/:id/muestras` - Obtener usuario y muestras
- `POST /api/registros` - Crear registro
- `DELETE /api/usuarios/:id` - Eliminar usuario (solo admin)
- `GET /api/espectrometros` - Listar espectrometros
- `POST /api/espectrometros` - Crear espectrometro (solo admin)

### **Frontend**

- **Auth Guard:** Protege rutas según autenticación y rol
- **HTTP Interceptor:** Agrega token JWT automáticamente a todas las requests
- **Local Storage:** Almacena token y datos del usuario
- **Logout:** Limpia el almacenamiento local

---

## 📊 Base de Datos

### **MongoDB**

- **Colecciones:**
  - `users` - Usuarios del sistema
  - `registros` - Registros de muestras
  - `espectrometros` - Equipos espectrometría

**Credenciales (Docker):**
- Usuario: `admin`
- Contraseña: `password123`
- Base de datos: `mi_proyecto_db`

---

## 🧪 Testing

### **Backend**

```bash
cd backend

# Ejecutar todos los tests
npm test

# Con cobertura
npm test -- --coverage

# En modo watch
npm test:watch
```

**Tests disponibles:**
- `ApiController.spec.ts` - Tests del controlador de usuarios
- `AuthService.spec.ts` - Tests del servicio de autenticación

### **Frontend**

```bash
cd frontend

# Ejecutar tests
npm test

# En modo watch
npm test -- --watch
```

---

## 📚 Estructura de Datos

### **Usuario**

```typescript
{
  id: string;
  name: string;
  email: string;
  password: string (hashed);
  rol: 'admin' | 'user';
}
```

### **Registro/Muestra**

```typescript
{
  id: string;
  usuario_id: string;
  espectrometro: string;
  sonda: string;
  muestra: string;
  fecha_entrada: Date;
  completo: boolean;
}
```

### **Espectrometro**

```typescript
{
  id: string;
  nombre: string;
  sondas: string[];
}
```

---

## 🔄 Flujo de Autenticación

1. **Usuario** accede a `/login` (ruta pública)
2. **Completa** email y contraseña
3. **Backend** valida credenciales y retorna JWT + datos usuario
4. **Frontend** guarda JWT en localStorage
5. **HTTP Interceptor** agrega JWT a todos los requests
6. **Backend** valida JWT en requests protegidos
7. **Usuario** es redirigido según su rol:
   - `admin` → `/listar-usuarios`
   - `user` → `/nuevo-registro`

---

## 🛠️ Operaciones Comunes

### **Crear un Usuario**

```bash
POST /api/usuarios
Content-Type: application/json

{
  "name": "Juan Pérez",
  "email": "juan@example.com",
  "password": "securepass123",
  "rol": "user"
}
```

### **Login**

```bash
POST /api/login
Content-Type: application/json

{
  "email": "juan@example.com",
  "password": "securepass123"
}

# Respuesta:
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "Juan Pérez",
    "email": "juan@example.com",
    "rol": "user"
  }
}
```

### **Acceder a Endpoints Protegidos**

```bash
GET /api/usuarios
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

---

## 🔍 Variables de Entorno

### **Backend (.env)**

```env
# Database
MONGO_URI=mongodb://admin:password123@localhost:27017/mi_proyecto_db?authSource=admin

# JWT
JWT_SECRET=tu-secreto-muy-seguro-y-largo
JWT_EXPIRATION=24h

# Server
PORT=3000
NODE_ENV=development
```

### **Frontend (environment.ts)**

```typescript
export const environment = {
  apiUrl: 'http://localhost:3000/api',
  production: false
};
```

---

## 📝 Cambios Realizados en la Refactorización

✅ **Backend:**
- Implementación completa de Inyección de Dependencias
- Middleware de error centralizado
- Autenticación JWT con Bcryptjs
- Rutas protegidas por rol
- Tests unitarios para controllers y servicios
- Eliminación de controllers duplicados

✅ **Frontend:**
- Mejora de AuthService con manejo de tokens JWT
- HTTP Interceptor para autenticación automática
- Validación de inputs en formularios
- Guards para protección de rutas
- Logout con limpieza de localStorage
- Tests unitarios para servicios

✅ **Documentación:**
- README.md completo con arquitectura
- Instrucciones de instalación y ejecución
- Documentación de endpoints API
- Guía de estructura de datos
- Información de seguridad

✅ **Limpieza:**
- Eliminación de archivos duplicados (error.txt)
- Eliminación de controllers sin usar
- Consolidación de estructuras

---

## 🐛 Troubleshooting

### **"MongoDB connection refused"**

```bash
# Verifica que MongoDB esté corriendo
docker-compose ps

# Reinicia los servicios
docker-compose down
docker-compose up --build
```

### **"Token inválido"**

- Asegúrate que el token no ha expirado
- Verifica que el JWT_SECRET sea el mismo en backend y frontend
- Intenta hacer login de nuevo

### **"CORS error"**

- Backend tiene CORS habilitado para cualquier origen
- Verifica que el frontend está llamando a `http://localhost:3000`

---

## 📞 Soporte

Para reportar bugs o sugerencias, abre un issue en el repositorio.

---

## 📄 Licencia

Este proyecto es parte de un TFG (Trabajo Final de Grado).
