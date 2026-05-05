# Arquitectura del Sistema - Parqueadero Pro

## 🏗️ Tipo de Arquitectura
El sistema implementa una **Arquitectura Cliente-Servidor** desacoplada, permitiendo que el frontend y el backend escalen de forma independiente.

### Diagrama Lógico
1. **Capa de Presentación (Frontend):** HTML/CSS/JS consumiendo una API REST mediante `fetch`.
2. **Capa de Aplicación (Backend):** Servidor Node.js con Express gestionando la lógica de negocio, autenticación y rutas.
3. **Capa de Datos (Base de Datos):** MySQL almacenando de forma persistente usuarios y movimientos vehiculares.

## 🔄 Flujo del Sistema
1. **Autenticación:** El usuario envía credenciales al backend; si son válidas, recibe un **JWT** que se almacena en `localStorage`.
2. **Registro de Vehículo:** El cliente envía placa y tipo; el servidor valida que no esté activo y lo inserta con un `TIMESTAMP` automático.
3. **Consulta de Datos:** El Dashboard solicita la lista completa al cargar, permitiendo ver el estado real del parqueadero.
4. **Finalización de Servicio:** Al marcar la salida, se actualiza el registro con la hora actual y se cambia el estado a `finalizado`.

## 📊 Modelo de Datos (Relacional)

### Tabla `usuarios`
- `id` (PK)
- `nombre`
- `email` (Unique)
- `password` (Hashed)

### Tabla `vehiculos`
- `id` (PK)
- `placa`
- `tipo`
- `hora_ingreso`
- `hora_salida` (Nullable)
- `estado` (Enum: activo/finalizado)
- `usuario_id` (FK -> usuarios.id)

## 🛠️ Stack Tecnológico
- **Frontend:** Vanilla Web Suite (HTML/CSS/JS).
- **Backend:** Node.js, Express.
- **ORM/Driver:** `mysql2` con soporte para Promesas.
- **Seguridad:** `bcryptjs` para encriptación y `jsonwebtoken` para tokens de acceso.
