import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Páginas
import Home from "../pages/Home.jsx";
import Login from "../pages/Login.jsx";
import Register from "../pages/Register.jsx";
import Unauthorized from "../pages/Unauthorized.jsx";
import UserDashboard from "../pages/user/UserDashboard.jsx";
import CoachDashboard from "../pages/coach/CoachDashboard.jsx";
import AdminDashboard from "../pages/admin/AdminDashboard.jsx";

// Layouts
import UserLayout from "../layouts/UserLayout.jsx";
import CoachLayout from "../layouts/CoachLayout.jsx";
import AdminLayout from "../layouts/AdminLayout.jsx";

// Guardias
import ProtectedRoute from "../components/ProtectedRoute.jsx";
import RoleRoute from "../components/RoleRoute.jsx";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/unauthorized" element={<Unauthorized />} />

        <Route path="/user" element={<RoleRoute allowedRoles={["user"]}><UserLayout /></RoleRoute>}>
          <Route path="dashboard" element={<UserDashboard />} />
        </Route>

        <Route path="/coach" element={<RoleRoute allowedRoles={["coach"]}><CoachLayout /></RoleRoute>}>
          <Route path="dashboard" element={<CoachDashboard />} />
        </Route>

        <Route path="/admin" element={<RoleRoute allowedRoles={["admin"]}><AdminLayout /></RoleRoute>}>
          <Route path="dashboard" element={<AdminDashboard />} />
        </Route>

        <Route path="/perfil" element={<ProtectedRoute><h1>Perfil del usuario autenticado</h1></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;