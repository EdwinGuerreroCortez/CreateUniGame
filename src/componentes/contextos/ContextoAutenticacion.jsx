import React from 'react';
import { Navigate } from 'react-router-dom';

const RutaPrivada = ({ children, rolesPermitidos }) => {
  // Obtener los datos del usuario desde localStorage
  const usuario = JSON.parse(localStorage.getItem('usuario'));

  // Verificar si el usuario está autenticado y tiene alguno de los roles permitidos
  const tienePermiso = usuario && rolesPermitidos.includes(usuario.tipo);

  // Si el usuario está autenticado y tiene permiso, renderiza los children; de lo contrario, redirige
  return tienePermiso ? children : <Navigate to="/" />;
};

export default RutaPrivada;
