import React from 'react';
import BarraNavDocen from './navDocente.jsx'; 
import PieDePaginaAdmin from '../compartidos/pideDePaginaAdmin.jsx';

const layoutEncabeDocen = ({ children }) => {
  return (
    <div className="layout">
      <header>
        <BarraNavDocen />
      </header>
      <main className="main-content">
        {children}
      </main>
      <footer>
        <PieDePaginaAdmin />
      </footer>
    </div>
  );
};

export default layoutEncabeDocen;
