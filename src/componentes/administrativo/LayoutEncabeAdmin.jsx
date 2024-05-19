import React from 'react';
import BarraNavAdmin from './navAdministrativo.jsx'; 
import PieDePaginaAdmin from '../compartidos/pideDePaginaAdmin.jsx';

const layoutEncabeAdmin = ({ children }) => {
  return (
    <div className="layout">
      <header>
        <BarraNavAdmin />
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

export default layoutEncabeAdmin;
