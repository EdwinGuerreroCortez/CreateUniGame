// LayoutConEncabezado.js
import React from 'react';
import BarraNav from '../compartidos/barraNav'; // Corregido el nombre y la importación
import PieDePagina from '../compartidos/pieDepagina'; // Corregido el nombre y la importación

const LayoutConEncabezado = ({ children }) => {
  return (
    <div className="layout">
      <BarraNav /> {/* Corregido el nombre del componente */}
      <div className="main-content">
        {children}
      </div>
      <PieDePagina /> {/* Corregido el nombre del componente */}
    </div>
  );
}

export default LayoutConEncabezado;
