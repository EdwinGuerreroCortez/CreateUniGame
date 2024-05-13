import React from 'react';
import BarraNavUser from '../usuario/navUsuario';
import PieDePagina from '../compartidos/pieDepagina';

const layoutEncabeUser = ({ children }) => {
  return (
    <div className="layout">
      <header>
        <BarraNavUser />
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

export default layoutEncabeUser;
