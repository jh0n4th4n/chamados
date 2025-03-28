// src/routes/Private.jsx
import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../contexts/auth';

export default function Private({ children, role }) {
  const { signed, loading, user } = useContext(AuthContext);

  if (loading) {
    return <div>Carregando...</div>;
  }

  if (!signed) {
    return <Navigate to="/" />;
  }

  if (role && user?.role !== role) {
    return <Navigate to="/dashboard" />;
  }

  return children;
}
