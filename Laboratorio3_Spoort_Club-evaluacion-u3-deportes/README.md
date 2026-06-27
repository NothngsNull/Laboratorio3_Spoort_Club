# SportClub — Aplicación Web SPA

Sistema de gestión deportiva construido con React + Vite, React Router, Bootstrap y conexión al backend REST del club.

---

## Integrantes

| Nombre | Rol |
|--------|-----|
| *(Ignacio Figueroa)* | Estudiante inacap |

---

## Tecnologías utilizadas

| Categoría | Tecnología |
|-----------|------------|
| Framework UI | React 18 + Vite |
| Routing | React Router v6 |
| Estilos | Bootstrap 5 + React-Bootstrap |
| Alertas | SweetAlert2 |
| HTTP | Fetch API nativa |
| Autenticación | JWT (guardado en localStorage) |
| Backend | Node.js + Express (puerto 3000) |

---

## Requisitos previos

- Node.js 18 o superior
- npm 9 o superior
- El backend SportClub ejecutándose en `http://localhost:3000`

---

## Cómo instalar dependencias

```bash
# Instalar dependencias del frontend
pnpm install
```

---

## Cómo ejecutar el frontend

```bash
pnpm run dev
```

La aplicación estará disponible en: **http://localhost:5173**

---

## Cómo ejecutar el backend

```bash
# Desde la carpeta del backend
cd backend
npm install
npm run dev
```

El backend quedará disponible en: **http://localhost:3000**

---

## Estructura del proyecto

```
src/
├── App.css
├── App.jsx
├── assets/
│   ├── hero.png
│   ├── react.svg
│   └── vite.svg
├── components/
│   ├── Navbar.jsx
│   ├── ProtectedRoute.jsx
│   ├── RoleRoute.jsx
│   ├── sports/
│   │   └── SportFormModal.jsx
│   └── users/
│       └── UserFormModal.jsx
├── index.css
├── layouts/
│   ├── AdminLayout.jsx
│   ├── CoachLayout.jsx
│   └── UserLayout.jsx
├── main.jsx
├── pages/
│   ├── Home.jsx
│   ├── Login.jsx
│   ├── PerfilPage.jsx
│   ├── Register.jsx
│   ├── Unauthorized.jsx
│   ├── admin/
│   │   ├── AdminDashboard.jsx
│   │   ├── SportsPage.jsx
│   │   └── UsersPage.jsx
│   ├── coach/
│   │   └── CoachDashboard.jsx
│   └── user/
│       └── UserDashboard.jsx
├── routes/
│   └── AppRoutes.jsx
└── services/
    ├── authService.js
    ├── sportService.js
    └── userService.js"

---

## Usuarios de prueba

| Rol | Email | Contraseña |
|-----|-------|------------|
| Administrador | admin@sportclub.cl | *(ver backend)* |
| Coach | coach@sportclub.cl | *(ver backend)* |
| Usuario | usuario@sportclub.cl | *(ver backend)* |

---

## Módulos implementados

- ✅ Login con validación y persistencia de sesión
- ✅ Registro con validación de formulario y fortaleza de contraseña
- ✅ Protección de rutas por autenticación y por rol
- ✅ Dashboard Administrador (morado) con estadísticas en tiempo real
- ✅ Dashboard Coach (verde) con horario y control de asistencia
- ✅ Dashboard Usuario (azul) con reservas y progreso
- ✅ CRUD de usuarios (listar, crear, editar, eliminar con SweetAlert2)
- ✅ Mi Perfil disponible para los 3 roles
- ✅ Cierre de sesión funcional
---

## problema a solucionado.

Anteriormente daba error el pnpm install y se debia al archivo pnpm-workspace.yaml.
Se debia a la linea numero 3, simplemente cambie a (sqlite3:set this true or false) por (sqlite3: true)

A pesar de esto el pnpm run dev seguia dando problemas asi que remplace el archivo package.json de esto:

{
  "name": "backend-api-frontend-users",
  "version": "1.0.0",
  "description": "Backend base con Express, JWT y Sequelize para apoyar actividades de Front End.",
  "main": "src/server.js",
  "type": "commonjs",
  "scripts": {
    "dev": "nodemon src/server.js",
    "start": "node src/server.js"
  },
  "dependencies": {
    "bcryptjs": "^2.4.3",
    "cors": "^2.8.5",
    "dotenv": "^17.2.3",
    "express": "^5.1.0",
    "jsonwebtoken": "^9.0.2",
    "morgan": "^1.10.0",
    "mysql2": "^3.15.2",
    "sequelize": "^6.37.7",
    "sqlite3": "^6.0.1"
  },
  "devDependencies": {
    "nodemon": "^3.1.10"
  }
}

a esto:

{
  "name": "sportclub-frontend",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "bootstrap": "^5.3.0",
    "react": "^18.2.0",
    "react-bootstrap": "^2.10.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.22.0",
    "sweetalert2": "^11.10.0"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.2.1",
    "vite": "^5.1.0"
  }
}

