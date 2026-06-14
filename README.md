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
npm install
```

---

## Cómo ejecutar el frontend

```bash
npm run dev
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
├── components/
│   ├── ProtectedRoute.jsx       # Bloquea rutas sin sesión
│   ├── RoleRoute.jsx            # Bloquea rutas por rol
│   └── users/
│       └── UserFormModal.jsx    # Modal crear/editar usuario
├── layouts/
│   ├── AdminLayout.jsx          # Layout morado — rol Administrador
│   ├── CoachLayout.jsx          # Layout verde — rol Coach
│   └── UserLayout.jsx           # Layout azul — rol Usuario
├── pages/
│   ├── Home.jsx                 # Landing pública
│   ├── Login.jsx                # Inicio de sesión
│   ├── Register.jsx             # Registro de usuario
│   ├── Unauthorized.jsx         # Acceso denegado
│   ├── PerfilPage.jsx           # Mi Perfil (compartido entre roles)
│   ├── admin/
│   │   ├── AdminDashboard.jsx
│   │   └── UsersPage.jsx        # CRUD de usuarios
│   ├── coach/
│   │   └── CoachDashboard.jsx
│   └── user/
│       └── UserDashboard.jsx
├── routes/
│   └── AppRoutes.jsx            # Definición de todas las rutas
└── services/
    ├── authService.js           # Login, registro, sesión, helpers
    └── userService.js           # CRUD usuarios (getUsers, createUser, etc.)
```

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
