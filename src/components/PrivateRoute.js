import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';

export default function PrivateRoute({ children }) {
  const isAuthenticated = !!localStorage.getItem('fitfi_user');

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return children;
}
