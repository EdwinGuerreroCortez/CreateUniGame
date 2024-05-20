import React from 'react';
import BarraNavUser from './navUsuario';
import PieDePaginaUser from '../compartidos/pieDePaginaUser';

const LayoutEncabeUser = ({ children }) => {
  return (
    <div className="layout">
      <header>
        <BarraNavUser />
      </header>
      <main className="main-content">
        {children}
      </main>
      <footer>
        <PieDePaginaUser />
      </footer>
    </div>
  );
};

export default LayoutEncabeUser;
