import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Formlogin from './componentes/public/login'; 
import FormRegistro from './componentes/public/registro'; 
import LayoutConEncab from './componentes/compartidos/LayoutConEncabezado';
import LayoutEncabeUser from './componentes/usuario/layoutEncabeUser';
import PaginaPrincipal from './componentes/public/paginaPrincipal';
import Temas from './componentes/public/temas';
import Extra from './componentes/public/extra';
import Fqs from './componentes/public/faqs';
import Bienvenida from './componentes/usuario/bienvenida';

const App = () => {
  return (
    <Router>

        <Routes>
        <Route path="/" element={ <LayoutConEncab><PaginaPrincipal /><Temas/><Extra/><Fqs/> </LayoutConEncab>} />
        <Route path="/login" element={ <LayoutConEncab><Formlogin /> </LayoutConEncab>} />
        <Route path="/registro" element={ <LayoutConEncab><FormRegistro/> </LayoutConEncab>} />
        <Route path="/paginaPrincipal" element={ <LayoutConEncab><PaginaPrincipal/> </LayoutConEncab>} />

        <Route path="/bienvenida" element={ <LayoutEncabeUser><Bienvenida /><Temas/><Extra/><Fqs/> </LayoutEncabeUser>} />
        </Routes>

      
    
    </Router>
  );
};

export default App;
