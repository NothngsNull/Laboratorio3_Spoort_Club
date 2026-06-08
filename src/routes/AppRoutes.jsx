import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "../components/ProtectedRoute.jsx";
import Register from "../pages/Register.jsx";

// Importaciones de páginas
import Home from "../pages/Home.jsx";
import Login from "../pages/Login.jsx";
import UserDashboard from "../pages/user/UserDashboard.jsx";
import CoachDashboard from "../pages/coach/CoachDashboard.jsx";
import AdminDashboard from "../pages/admin/AdminDashboard.jsx";

// Importaciones de Layouts
import UserLayout from "../layouts/UserLayout.jsx";
import CoachLayout from "../layouts/CoachLayout.jsx";
import AdminLayout from "../layouts/AdminLayout.jsx";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rutas Públicas */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        

        {/* Panel de Clientes/Usuarios (Solo rol: user) */}
        <Route element={<ProtectedRoute allowedRoles={['user']} />}>
          <Route path="/user" element={<UserLayout />}>
            <Route path="dashboard" element={<UserDashboard />} />
          </Route>
        </Route>

        {/* Panel de Entrenadores/Coaches (Solo rol: coach) */}
        <Route element={<ProtectedRoute allowedRoles={['coach']} />}>
          <Route path="/coach" element={<CoachLayout />}>
            <Route path="dashboard" element={<CoachDashboard />} />
          </Route>
        </Route>

        {/* Panel de Administradores (Solo rol: admin) */}
        <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route path="dashboard" element={<AdminDashboard />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;