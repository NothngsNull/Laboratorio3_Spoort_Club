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
