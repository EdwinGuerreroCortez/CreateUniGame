import React from 'react';
import BarraNav from '../compartidos/barraNav';
import PieDePagina from '../compartidos/pieDepagina';

const LayoutConEncabezado = ({ children }) => {
  return (
    <div className="layout">
      <header>
        <BarraNav />
      </header>
      <main className="main-content">
        {children}
      </main>
      <footer>
        <PieDePagina />
      </footer>
    </div>
  );
}

export default LayoutConEncabezado;
