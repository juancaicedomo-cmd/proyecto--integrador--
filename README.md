#  Parqueadero Pro - Sistema de Gestión

Sistema profesional de gestión de parqueaderos desarrollado para la optimización del control de ingresos y salidas de vehículos.

---

##  Trazabilidad y Historias de Usuario (HU)
Este proyecto sigue una metodología ágil. Los detalles de cada funcionalidad y su proceso de despliegue están vinculados a los **GitHub Issues** y el **Project Board** del repositorio.

| ID | Historia de Usuario | Estado |
| :--- | :--- | :--- |
| **HU-01** | Autenticación Segura (JWT + BCrypt) | ✅ Completado |
| **HU-02** | Dashboard con Estadísticas en Tiempo Real | ✅ Completado |
| **HU-03** | Gestión de Ingresos y Salidas | ✅ Completado |
| **HU-04** | Configuración Global de Tarifas | ✅ Completado |
| **HU-05** | Reportes Históricos y Exportación CSV | ✅ Completado |

---

##  Descripción del Problema
Muchos establecimientos de parqueadero aún dependen de registros manuales en papel, lo que conlleva a errores de cálculo, pérdida de datos y falta de trazabilidad. **Parqueadero Pro** resuelve esto automatizando el flujo completo desde el registro del administrador hasta el control de estado de cada vehículo.

##  Tecnologías Utilizadas
- **Frontend:** HTML5, CSS3 (Custom Design System), JavaScript (Vanilla).
- **Backend:** Node.js, Express.
- **Base de Datos:** MySQL (Compatible con Modo Demo en memoria).
- **Seguridad:** JWT para sesiones y BCryptJS para hashing.

##  Estructura del Proyecto
```text
├── backend/          # API REST con Node/Express
│   ├── config/       # Conexión a DB
│   ├── controllers/  # Lógica de negocio (Modo Demo/SQL)
│   ├── routes/       # Definición de Endpoints
│   └── server.js     # Punto de entrada
├── frontend/         # Cliente Web (Pro UI)
│   ├── css/          # Estilos profesionales y Dark Mode
│   ├── js/           # Lógica del cliente y Fetch API
│   └── *.html        # Vistas del sistema
└── database/         # Script SQL de inicialización
```

## Instalación y Uso

### 1. Base de Datos
- Importa el archivo `database/init.sql` en tu servidor MySQL.
- *Nota: El sistema inicia en **Modo Demo** por defecto para pruebas rápidas sin DB.*

### 2. Backend
- Navega a la carpeta `backend/`.
- Instala las dependencias: `npm install`.
- Inicia el servidor: `node server.js` o `npm start`.

### 3. Frontend
- Abre `frontend/login.html` en tu navegador.

## Licencia
Proyecto Académico - Uso Educativo.
Desarrollado por Juan Pablo Caicedo Monsalve & Leandro Uribe.
