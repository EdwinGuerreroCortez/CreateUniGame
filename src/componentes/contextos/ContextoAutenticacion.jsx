import React from 'react';
import { Navigate } from 'react-router-dom';

const RutaPrivada = ({ children, rolesPermitidos }) => {
    const usuario = JSON.parse(localStorage.getItem('usuario'));

    const tienePermiso = usuario && rolesPermitidos.includes(usuario.tipo);

    return tienePermiso ? children : <Navigate to="/" />;
};

export default RutaPrivada;
