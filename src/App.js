// src/App.js

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Componentes Principales
import Formlogin from './componentes/public/login';
import FormRegistro from './componentes/public/registro';
import LayoutConEncab from './componentes/compartidos/LayoutConEncabezado';
import PaginaPrincipal from './componentes/public/paginaPrincipal';
import Temas from './componentes/public/temas';
import Extra from './componentes/public/extra';
import Fqs from './componentes/public/faqs';
import Acerca from './componentes/public/acerca'
import Contactanos from'./componentes/public/contactanos';

// Componentes de Usuario
import LayoutEncabeUser from './componentes/usuario/layoutEncabeUser';
import Bienvenida from './componentes/usuario/bienvenida';
import Recursos from './componentes/usuario/recursos';
import Curso from './componentes/usuario/curso';

// Componentes Administrativos
import LayoutEncabeAdmin from './componentes/administrativo/LayoutEncabeAdmin';
import BienvenidaAdmin from './componentes/administrativo/bienvenidaAdmin';

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Rutas Principales */}
        <Route path="/" element={<LayoutConEncab><PaginaPrincipal /><Temas /><Extra /><Fqs /></LayoutConEncab>} />
        <Route path="/login" element={<Formlogin />} />
        <Route path="/registro" element={<LayoutConEncab><FormRegistro /></LayoutConEncab>} />
        <Route path="/paginaPrincipal" element={<LayoutConEncab><PaginaPrincipal /></LayoutConEncab>} />
        <Route path="/acerca" element={<LayoutConEncab><Acerca /></LayoutConEncab>} />
        <Route path="/contactanos" element={<LayoutConEncab><Contactanos /></LayoutConEncab>} />


        {/* Rutas de Usuario */}
        <Route path="/bienvenida" element={<LayoutEncabeUser><Bienvenida /></LayoutEncabeUser>} />
        <Route path="/recursos" element={<LayoutEncabeUser><Recursos /></LayoutEncabeUser>} />
        <Route path="/curso" element={<LayoutEncabeUser><Curso /></LayoutEncabeUser>} />
        <Route path="/acerca-de" element={<LayoutEncabeUser><Acerca /></LayoutEncabeUser>} />
        <Route path="/contacto" element={<LayoutEncabeUser><Contactanos /></LayoutEncabeUser>} />


        {/* Rutas Administrativas */}
        <Route path="/administrativa" element={<LayoutEncabeAdmin><BienvenidaAdmin /></LayoutEncabeAdmin>} />
      </Routes>
    </Router>
  );
};

export default App;
