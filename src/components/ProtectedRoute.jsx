import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = ({ allowedRoles }) => {
  const userString = localStorage.getItem('user');
  const user = userString ? JSON.parse(userString) : null;
  const token = localStorage.getItem('token');

  // 1. Validar Token y Sesión: Si no hay token o no hay usuario, bloquear y redireccionar
  if (!user || !token || user.token !== token) {
    // Eliminamos residuos por seguridad
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    return <Navigate to="/login" replace />;
  }

  // 2. Validar Rol: Si el rol no está permitido, redirigir a su dashboard correspondiente
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    if (user.role === 'admin') return <Navigate to="/admin/dashboard" replace />;
    if (user.role === 'coach') return <Navigate to="/coach/dashboard" replace />;
    return <Navigate to="/user/dashboard" replace />;
  }

  // 3. Todo OK: Mostrar la pantalla solicitada
  return <Outlet />;
};

export default ProtectedRoute;