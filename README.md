# Broers Nodejs Technical Test

Este proyecto es una implementación de un CRUD de usuarios utilizando Node.js, Express y MongoDB, con un sistema de autenticación basado en JWT. Además, incluye funcionalidades como la recuperación de contraseña vía correo electrónico y una semilla de usuarios de prueba.

## Funcionalidades

- **CRUD de Usuarios**: Crear, Leer, Actualizar y Eliminar usuarios.
- **Autenticación JWT**: Iniciar sesión y renovar el token.
- **Recuperación de Contraseña**: Enviar un enlace para restaurar la contraseña.
- **Seed de Usuarios**: Insertar usuarios de prueba automáticamente.

## Instalación

1. Clona este repositorio:

   ```bash
   git clone https://github.com/wfgp12/broers-nodejs-test
   ```

2. Accede al directorio del proyecto:

   ```bash
   cd broers-nodejs-test
   ```

3. Instala las dependencias:

   ```bash
   npm install
   ```

4. Copia el archivo de configuración de ejemplo:

   ```bash
   cp example.env .env
   ```

5. Configura tus credenciales en el archivo `.env`.

## Scripts

- **Iniciar el servidor de desarrollo**:

  ```bash
  npm run dev
  ```

- **Ejecutar la semilla de usuarios**:

  ```bash
  npm run seed
  ```

## Documentación de la API

La documentación de la API está disponible de manera interactiva mediante Swagger. Puedes acceder a ella abriendo el siguiente enlace en tu navegador después de haber iniciado el servidor:

```bash
http://localhost:3000/api-docs
```

Esta documentación te permite explorar todos los endpoints disponibles y sus parámetros, junto con ejemplos de respuestas y solicitudes.

## Endpoints principales

### Autenticación

- **POST /api/auth/**: Iniciar sesión.
- **POST /api/auth/register**: Crear un nuevo usuario.
- **GET /api/auth/renew**: Renovar token JWT.
- **POST /api/auth/recovery**: Solicitar recuperación de contraseña.
- **POST /api/auth/reset-password/:token**: Cambiar la contraseña usando el token recibido.

### Usuarios

- **GET /api/users**: Listar todos los usuarios.
- **GET /api/users/:id**: Obtener un usuario por ID.
- **PUT /api/users/:id**: Actualizar un usuario existente.
- **DELETE /api/users/:id**: Eliminar o desactivar un usuario.

## Tecnologías

- Node.js
- Express.js
- MongoDB y Mongoose
- JWT (Json Web Tokens)
- Nodemailer
- Bcrypt.js

## Notas

- Se debe renombrar el archivo `example.env` a `.env` y configurar las variables de entorno.
- No es necesario correr el proyecto para ejecutar la semilla de usuarios.
- La recuperación de contraseña genera un formulario básico desde el backend para modificar la contraseña.

## Licencia

Este proyecto es solo para propósitos de prueba técnica.
