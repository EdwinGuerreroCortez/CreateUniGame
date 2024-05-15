import React from 'react';
import BarraNavAdmin from './navAdministrativo.jsx'; 
import PieDePagina from '../compartidos/pieDepagina'; 

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
        <PieDePagina />  
      </footer>
    </div>
  );
}

export default layoutEncabeAdmin;
