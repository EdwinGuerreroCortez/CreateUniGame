import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Formlogin from './componentes/compartidos/login_registro'; // Importa el componente FormRegistro
import barraNav from './componentes/compartidos/barraNav';
import LayoutConEncab from './componentes/compartidos/LayoutConEncabezado';
import PaginaPrincipal from './componentes/compartidos/paginaPrincipal';

const App = () => {
  return (
    <Router>
        <Routes>
        <Route path="/" element={< LayoutConEncab ><PaginaPrincipal /></ LayoutConEncab >} />
          {/* Otra ruta del mismisimo GERAGOD GUAPO Y FAMULARDO*/}
        </Routes>
    </Router>
  );
};

export default App;
