import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = ({ allowedRoles }) => {
  // 1. Verificamos si hay una sesión guardada
  const userString = localStorage.getItem('user');
  const user = userString ? JSON.parse(userString) : null;

  // 2. Si no hay usuario, lo pateamos al login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // 3. Si hay usuario, pero su rol no está en la lista permitida, lo devolvemos a su área
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    if (user.role === 'admin') return <Navigate to="/admin/dashboard" replace />;
    if (user.role === 'coach') return <Navigate to="/coach/dashboard" replace />;
    return <Navigate to="/user/dashboard" replace />;
  }

  // 4. Si todo está en orden, lo dejamos pasar a la ruta solicitada
  return <Outlet />;
};

export default ProtectedRoute;