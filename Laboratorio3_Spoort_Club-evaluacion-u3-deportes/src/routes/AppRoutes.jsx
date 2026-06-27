// src/routes/AppRoutes.jsx
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// ── Páginas generales ─────────────────────────────────────────────────────────
import Home         from "../pages/Home.jsx";
import Login        from "../pages/Login.jsx";
import Register     from "../pages/Register.jsx";
import Unauthorized from "../pages/Unauthorized.jsx";

// ── Dashboards ────────────────────────────────────────────────────────────────
import UserDashboard  from "../pages/user/UserDashboard.jsx";
import CoachDashboard from "../pages/coach/CoachDashboard.jsx";
import AdminDashboard from "../pages/admin/AdminDashboard.jsx";

// ── Módulos Admin ─────────────────────────────────────────────────────────────
import UsersPage   from "../pages/admin/UsersPage.jsx";
import SportsPage  from "../pages/admin/SportsPage.jsx";
import RoomsPage   from "../pages/admin/RoomsPage.jsx";
import ClassesPage from "../pages/admin/ClassesPage.jsx";   

// ── Perfil (compartido entre roles) ───────────────────────────────────────────
import PerfilPage from "../pages/PerfilPage.jsx";

// ── Layouts ───────────────────────────────────────────────────────────────────
import UserLayout  from "../layouts/UserLayout.jsx";
import CoachLayout from "../layouts/CoachLayout.jsx";
import AdminLayout from "../layouts/AdminLayout.jsx";

// ── Guardias ──────────────────────────────────────────────────────────────────
import ProtectedRoute from "../components/ProtectedRoute.jsx";
import RoleRoute      from "../components/RoleRoute.jsx";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>

        {/* ── Rutas públicas ──────────────────────────────────────────── */}
        <Route path="/"             element={<Home />} />
        <Route path="/login"        element={<Login />} />
        <Route path="/register"     element={<Register />} />
        <Route path="/unauthorized" element={<Unauthorized />} />

        {/* ── Rutas de Usuario ────────────────────────────────────────── */}
        <Route
          path="/user"
          element={
            <RoleRoute allowedRoles={["user"]}>
              <UserLayout />
            </RoleRoute>
          }
        >
          <Route path="dashboard" element={<UserDashboard />} />
          <Route path="perfil"    element={<PerfilPage />} />
        </Route>

        {/* ── Rutas de Coach ──────────────────────────────────────────── */}
        <Route
          path="/coach"
          element={
            <RoleRoute allowedRoles={["coach"]}>
              <CoachLayout />
            </RoleRoute>
          }
        >
          <Route path="dashboard" element={<CoachDashboard />} />
          <Route path="perfil"    element={<PerfilPage />} />
        </Route>

        {/* ── Rutas de Admin ──────────────────────────────────────────── */}
        <Route
          path="/admin"
          element={
            <RoleRoute allowedRoles={["admin"]}>
              <AdminLayout />
            </RoleRoute>
          }
        >
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="users"     element={<UsersPage />} />
          <Route path="sports"    element={<SportsPage />} />
          <Route path="rooms"     element={<RoomsPage />} />
          <Route path="classes"   element={<ClassesPage />} />
          <Route path="perfil"    element={<PerfilPage />} />
        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;
