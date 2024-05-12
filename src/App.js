import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Formlogin from './componentes/public/login'; 
import FormRegistro from './componentes/public/registro'; 
import LayoutConEncab from './componentes/compartidos/LayoutConEncabezado';
import PaginaPrincipal from './componentes/public/paginaPrincipal';
import Temas from './componentes/public/temas';
import Extra from './componentes/public/extra';

const App = () => {
  return (
    <Router>
      <LayoutConEncab>
        <Routes>
          <Route path="/" element={<><PaginaPrincipal /><Temas/><Extra/></>} />
          <Route path="/login" element={<Formlogin />} />
          <Route path="/registro" element={<FormRegistro />} />  
          <Route path="/paginaPrincipal" element={<PaginaPrincipal />} />
        </Routes>
      </LayoutConEncab>
    </Router>
  );
};

export default App;
