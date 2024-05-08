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
        <Route path="/login_registro" element={< LayoutConEncab ><Formlogin /></ LayoutConEncab >} />
        <Route path="/paginaPrincipal" element={< LayoutConEncab ><PaginaPrincipal /></ LayoutConEncab >} />
          {/* Otra ruta del mismisimo GERAGOD GUAPO Y FAMULARDO NOOOOOO hay7 eedcoito? hay coito?*/}
        </Routes>
    </Router>
  );
};

export default App;
