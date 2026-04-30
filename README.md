# TFG Proyecto

Este proyecto contiene una arquitectura básica con **backend**, **frontend** y **base de datos MongoDB** usando Docker Compose.

## Requisitos

- [Docker](https://www.docker.com/get-started)
- [Docker Compose](https://docs.docker.com/compose/)

## Estructura del proyecto

```
TFG/
├── backend/      # Código fuente del backend
├── frontend/     # Código fuente del frontend
├── docker-compose.yml
└── README.md
```

## Cómo ejecutar el proyecto

1. **Clona este repositorio:**

   ```
   git clone https://github.com/tuusuario/tu-repo.git
   cd tu-repo
   ```

2. **Construye y levanta los servicios:**

   ```
   docker-compose up --build
   ```

3. **Accede a las aplicaciones:**
   - Frontend: [http://localhost:8080](http://localhost:8080)
   - Backend: [http://localhost:3000](http://localhost:3000)
   - MongoDB: puerto `27017` (usando usuario `admin` y contraseña `password123`)

## Notas

- El backend se conecta automáticamente a la base de datos MongoDB usando las variables de entorno definidas en `docker-compose.yml`.
- Los datos de MongoDB se almacenan en un volumen Docker llamado `mongodata` para persistencia.
