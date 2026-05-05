#  Parqueadero Pro - Sistema de Gestión

Sistema profesional de gestión de parqueaderos desarrollado para la optimización del control de ingresos y salidas de vehículos.

##  Descripción del Problema
Muchos establecimientos de parqueadero aún dependen de registros manuales en papel, lo que conlleva a errores de cálculo, pérdida de datos y falta de trazabilidad. **Parqueadero Pro** resuelve esto automatizando el flujo completo desde el registro del administrador hasta el control de estado de cada vehículo.

##  Tecnologías Utilizadas
- **Frontend:** HTML5, CSS3 (Custom Design System), JavaScript (Vanilla).
- **Backend:** Node.js, Express.
- **Base de Datos:** MySQL.
- **Seguridad:** JWT (JSON Web Tokens) para sesiones y BCryptJS para hashing de contraseñas.

##  Estructura del Proyecto
```text
├── backend/          # API REST con Node/Express
│   ├── config/       # Conexión a DB
│   ├── controllers/  # Lógica de negocio
│   ├── routes/       # Definición de Endpoints
│   └── server.js     # Punto de entrada del servidor
├── frontend/         # Cliente Web
│   ├── css/          # Estilos profesionales
│   ├── js/           # Lógica del cliente y Fetch
│   └── *.html        # Páginas del sistema
└── database/         # Script SQL de inicialización
```

## Instalación y Uso

### 1. Base de Datos
- Importa el archivo `database/init.sql` en tu servidor MySQL (XAMPP, Workbench, etc.).

### 2. Backend
- Navega a la carpeta `backend/`.
- Crea un archivo `.env` basado en el ejemplo:
  ```env
  PORT=3000
  DB_HOST=localhost
  DB_USER=root
  DB_PASS=
  DB_NAME=parqueadero_db
  JWT_SECRET=tu_secreto_seguro
  ```
- Instala las dependencias:
  ```bash
  npm install
  ```
- Inicia el servidor:
  ```bash
  npm run dev
  ```

### 3. Frontend
- Simplemente abre `frontend/index.html` en tu navegador o usa una extensión como Live Server.

##  Funcionalidades Principales
- **Registro/Login:** Acceso seguro para administradores.
- **Dashboard:** Resumen en tiempo real de vehículos activos.
- **Gestión de Vehículos:** 
  - Registro de entrada con placa y tipo.
  - Listado histórico con marcas de tiempo automáticas.
  - Botón de salida para finalizar servicios.
- **Diseño Responsive:** Optimizado para dispositivos móviles y escritorio.

## Licencia
Proyecto Académico - Uso Educativo.
Desarrollado por Juan Pablo Caicedo Monsalve & Leandro Uribe.
