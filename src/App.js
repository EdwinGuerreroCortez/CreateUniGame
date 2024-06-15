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
import Acerca from './componentes/public/acerca'
import Contactanos from'./componentes/public/contactanos';

// Componentes de Usuario
import LayoutEncabeUser from './componentes/usuario/layoutEncabeUser';
import Bienvenida from './componentes/usuario/bienvenida';
import Recursos from './componentes/usuario/recursos';
import Curso from './componentes/usuario/curso';
import Evaluacion from './componentes/usuario/evaluacion'

// Componentes Administrativos
import LayoutEncabeAdmin from './componentes/administrativo/LayoutEncabeAdmin';
import BienvenidaAdmin from './componentes/administrativo/bienvenidaAdmin';
import Buzon from './componentes/administrativo/buzon';
import Mision from './componentes/administrativo/mision';
import TemasAdd from './componentes/administrativo/temas';
import Usuarios from './componentes/administrativo/Usuarios'
import CuestionariosForm from './componentes/administrativo/cuestionario';

const App = () => {
  const [userAuthenticated, setUserAuthenticated] = useState(false);

  return (
    <Router>
      <Routes>
        {/* Rutas Principales */}
        <Route path="/" element={<LayoutConEncab><PaginaPrincipal /><Temas /><Extra /><Fqs /></LayoutConEncab>} />
        <Route path="/public/login" element={<Formlogin setUserAuthenticated={setUserAuthenticated} />} />
        <Route path="/public/registro" element={<LayoutConEncab><FormRegistro setUserAuthenticated={setUserAuthenticated} /></LayoutConEncab>} />
        <Route path="/public/paginaPrincipal" element={<LayoutConEncab><PaginaPrincipal /></LayoutConEncab>} />
        <Route path="/public/acerca" element={<LayoutConEncab><Acerca /></LayoutConEncab>} />
        <Route path="/public/contactanos" element={<LayoutConEncab><Contactanos /></LayoutConEncab>} />
       
        {/* Rutas de Usuario */}
        <Route path="/user/bienvenida" element={
          userAuthenticated ? <LayoutEncabeUser><Bienvenida /></LayoutEncabeUser> : <Navigate to="/public/login" />
        } />
        <Route path="/user/recursos" element={
          userAuthenticated ? <LayoutEncabeUser><Recursos /></LayoutEncabeUser> : <Navigate to="/public/login" />
        } />
        <Route path="/user/acerca" element={
          userAuthenticated ? <LayoutEncabeUser><Acerca /></LayoutEncabeUser> : <Navigate to="/public/login" />
        } />
        <Route path="/user/curso" element={
          userAuthenticated ? <LayoutEncabeUser><Curso /></LayoutEncabeUser> : <Navigate to="/public/login" />
        } />
        <Route path="/user/contacto" element={
          userAuthenticated ? <LayoutEncabeUser><Contactanos /></LayoutEncabeUser> : <Navigate to="/public/login" />
        } />
        <Route path="/user/evaluacion/:temaId" element={
          userAuthenticated ? <LayoutEncabeUser><Evaluacion /></LayoutEncabeUser> : <Navigate to="/public/login" />
        } />

        {/* Rutas Administrativas */}
        <Route path="/admin/bienvenida" element={
          userAuthenticated ? <LayoutEncabeAdmin><BienvenidaAdmin /></LayoutEncabeAdmin> : <Navigate to="/public/login" />
        } />
        <Route path="/admin/usuarios" element={
          userAuthenticated ? <LayoutEncabeAdmin><Usuarios /></LayoutEncabeAdmin> : <Navigate to="/public/login" />
        } />
        <Route path="/admin/temas" element={
          userAuthenticated ? <LayoutEncabeAdmin><TemasAdd /></LayoutEncabeAdmin> : <Navigate to="/public/login" />
        } />
        <Route path="/admin/cuestionarios" element={
          userAuthenticated ? <LayoutEncabeAdmin><CuestionariosForm /></LayoutEncabeAdmin> : <Navigate to="/public/login" />
        } />
        <Route path="/admin/informacion/mv" element={
          userAuthenticated ? <LayoutEncabeAdmin><Mision /></LayoutEncabeAdmin> : <Navigate to="/public/login" />
        } />
        <Route path="/admin/informacion/buzon" element={
          userAuthenticated ? <LayoutEncabeAdmin><Buzon /></LayoutEncabeAdmin> : <Navigate to="/public/login" />
        } />
        <Route path="/admin/configuraciones" element={
          userAuthenticated ? <LayoutEncabeAdmin><div>Configuraciones</div></LayoutEncabeAdmin> : <Navigate to="/public/login" />
        } />
      </Routes>
    </Router>
  );
};

export default App;
