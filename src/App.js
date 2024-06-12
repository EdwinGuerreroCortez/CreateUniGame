import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Componentes Principales
import Formlogin from './componentes/public/login';
import FormRegistro from './componentes/public/registro';
import LayoutConEncab from './componentes/compartidos/LayoutConEncabezado';
import PaginaPrincipal from './componentes/public/paginaPrincipal';
import Temas from './componentes/public/temas';
import Extra from './componentes/public/extra';
import Fqs from './componentes/public/faqs';
import Acerca from './componentes/public/acerca';
import Contactanos from './componentes/public/contactanos';

// Componentes de Usuario
import LayoutEncabeUser from './componentes/usuario/layoutEncabeUser';
import Bienvenida from './componentes/usuario/bienvenida';
import Recursos from './componentes/usuario/recursos';
import Curso from './componentes/usuario/curso';
// Componentes Administrativos
import LayoutEncabeAdmin from './componentes/administrativo/LayoutEncabeAdmin';
import BienvenidaAdmin from './componentes/administrativo/bienvenidaAdmin';

import Mision from './componentes/administrativo/mision';
import TemasAdd from './componentes/administrativo/temas';
import Usuarios from './componentes/administrativo/Usuarios';
import CuestionariosForm from './componentes/administrativo/cuestionario';

const App = () => {
  const [userAuthenticated, setUserAuthenticated] = useState(false);

  return (
    <Router>
      <Routes>
        {/* Rutas Principales */}
        <Route path="/" element={<LayoutConEncab><PaginaPrincipal /><Temas /><Extra /><Fqs /></LayoutConEncab>} />
        <Route path="/login" element={<Formlogin setUserAuthenticated={setUserAuthenticated} />} />
        <Route path="/registro" element={<LayoutConEncab><FormRegistro setUserAuthenticated={setUserAuthenticated} /></LayoutConEncab>} />
        <Route path="/acerca" element={<LayoutConEncab><Acerca /></LayoutConEncab>} />
        <Route path="/contactanos" element={<LayoutConEncab><Contactanos /></LayoutConEncab>} />

        {/* Rutas de Usuario */}
        <Route path="/bienvenida" element={
          userAuthenticated ? <LayoutEncabeUser><Bienvenida /></LayoutEncabeUser> : <Navigate to="/login" />
        } />
        <Route path="/recursos" element={
          userAuthenticated ? <LayoutEncabeUser><Recursos /></LayoutEncabeUser> : <Navigate to="/login" />
        } />
          <Route path="/acerca-de" element={
          userAuthenticated ? <LayoutEncabeUser><Acerca/></LayoutEncabeUser> : <Navigate to="/login" />
        } />
         <Route path="/contacto" element={
          userAuthenticated ? <LayoutEncabeUser><Contactanos/></LayoutEncabeUser> : <Navigate to="/login" />
        } />
        <Route path="/curso" element={
          userAuthenticated ? <LayoutEncabeUser><Curso /></LayoutEncabeUser> : <Navigate to="/login" />
        } />

        {/* Rutas Administrativas */}
        <Route path="/administrativa" element={
          userAuthenticated ? <LayoutEncabeAdmin><BienvenidaAdmin /></LayoutEncabeAdmin> : <Navigate to="/login" />
        } />
        <Route path="/admin/users" element={
          userAuthenticated ? <LayoutEncabeAdmin><Usuarios/></LayoutEncabeAdmin> : <Navigate to="/login" />
        } />
        <Route path="/admin/temas" element={
          userAuthenticated ? <LayoutEncabeAdmin><TemasAdd/></LayoutEncabeAdmin> : <Navigate to="/login" />
        } />
        <Route path="/admin/calificaciones/enero" element={
          userAuthenticated ? <LayoutEncabeAdmin><div>Calificaciones Enero</div></LayoutEncabeAdmin> : <Navigate to="/login" />
        } />
        <Route path="/admin/calificaciones/febrero" element={
          userAuthenticated ? <LayoutEncabeAdmin><div>Calificaciones Febrero</div></LayoutEncabeAdmin> : <Navigate to="/login" />
        } />
        <Route path="/admin/calificaciones/marzo" element={
          userAuthenticated ? <LayoutEncabeAdmin><div>Calificaciones Marzo</div></LayoutEncabeAdmin> : <Navigate to="/login" />
        } />
        <Route path="/admin/cuestionarios" element={
          userAuthenticated ? <LayoutEncabeAdmin><CuestionariosForm/></LayoutEncabeAdmin> : <Navigate to="/login" />
        } />
        <Route path="/admin/informacion/mv" element={
          userAuthenticated ? <LayoutEncabeAdmin><Mision/></LayoutEncabeAdmin> : <Navigate to="/login" />
        } />
      </Routes>
    </Router>
  );
};

export default App;