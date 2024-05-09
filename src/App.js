import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Formlogin from './componentes/public/login'; 
import FormRegistro from './componentes/public/registro'; 
import LayoutConEncab from './componentes/compartidos/LayoutConEncabezado';
import PaginaPrincipal from './componentes/public/paginaPrincipal';
import Temas from './componentes/public/temas';



const App = () => {
  return (
    <Router>
        <Routes>
        <Route path="/" element={< LayoutConEncab ><PaginaPrincipal />< Temas/></ LayoutConEncab >} />
        <Route path="/login" element={< LayoutConEncab ><Formlogin /></ LayoutConEncab >} />
        <Route path="/registro" element={< LayoutConEncab ><FormRegistro /></ LayoutConEncab >} />  
        <Route path="/paginaPrincipal" element={< LayoutConEncab ><PaginaPrincipal /></ LayoutConEncab >} />

        </Routes>
    </Router>
  );
};

export default App;
