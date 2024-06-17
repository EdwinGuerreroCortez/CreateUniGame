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
import Acerca from './componentes/public/acerca';
import Contactanos from './componentes/public/contactanos';

// Componentes de Usuario
import LayoutEncabeUser from './componentes/usuario/layoutEncabeUser';
import Bienvenida from './componentes/usuario/bienvenida';
import Recursos from './componentes/usuario/recursos';
import Curso from './componentes/usuario/curso';
import Evaluacion from './componentes/usuario/evaluacion';

// Componentes Administrativos
import LayoutEncabeAdmin from './componentes/administrativo/LayoutEncabeAdmin';
import BienvenidaAdmin from './componentes/administrativo/bienvenidaAdmin';
import Buzon from './componentes/administrativo/buzon';
import Mision from './componentes/administrativo/mision';
import TemasAdd from './componentes/administrativo/temas';
import Contenidos from './componentes/administrativo/contenidos';
import Usuarios from './componentes/administrativo/Usuarios';
import CuestionariosForm from './componentes/administrativo/cuestionario';
import Subirtema from './componentes/administrativo/subirtema';

import RutaPrivada from './componentes/contextos/ContextoAutenticacion';

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Rutas Principales */}
        <Route path="/" element={<LayoutConEncab><PaginaPrincipal /><Temas /><Extra /><Fqs /></LayoutConEncab>} />
        <Route path="/public/login" element={<Formlogin />} />
        <Route path="/public/registro" element={<LayoutConEncab><FormRegistro /></LayoutConEncab>} />
        <Route path="/public/paginaPrincipal" element={<LayoutConEncab><PaginaPrincipal /></LayoutConEncab>} />
        <Route path="/public/acerca" element={<LayoutConEncab><Acerca /></LayoutConEncab>} />
        <Route path="/public/contactanos" element={<LayoutConEncab><Contactanos /></LayoutConEncab>} />

        {/* Rutas de Usuario */}
        <Route path="/user/bienvenida" element={<RutaPrivada rolesPermitidos={['cliente']}><LayoutEncabeUser><Bienvenida /></LayoutEncabeUser></RutaPrivada>} />
        <Route path="/user/recursos" element={<RutaPrivada rolesPermitidos={['cliente']}><LayoutEncabeUser><Recursos /></LayoutEncabeUser></RutaPrivada>} />
        <Route path="/user/acerca" element={<RutaPrivada rolesPermitidos={['cliente']}><LayoutEncabeUser><Acerca /></LayoutEncabeUser></RutaPrivada>} />
        <Route path="/user/curso" element={<RutaPrivada rolesPermitidos={['cliente']}><LayoutEncabeUser><Curso /></LayoutEncabeUser></RutaPrivada>} />
        <Route path="/user/contacto" element={<RutaPrivada rolesPermitidos={['cliente']}><LayoutEncabeUser><Contactanos /></LayoutEncabeUser></RutaPrivada>} />
        <Route path="/user/evaluacion/:temaId" element={<RutaPrivada rolesPermitidos={['cliente']}><LayoutEncabeUser><Evaluacion /></LayoutEncabeUser></RutaPrivada>} />

        {/* Rutas Administrativas */}
        <Route path="/admin/bienvenida" element={<RutaPrivada rolesPermitidos={['administrador']}><LayoutEncabeAdmin><BienvenidaAdmin /></LayoutEncabeAdmin></RutaPrivada>} />
        <Route path="/admin/usuarios" element={<RutaPrivada rolesPermitidos={['administrador']}><LayoutEncabeAdmin><Usuarios /></LayoutEncabeAdmin></RutaPrivada>} />
        <Route path="/admin/temas" element={<RutaPrivada rolesPermitidos={['administrador']}><LayoutEncabeAdmin><TemasAdd /></LayoutEncabeAdmin></RutaPrivada>} />
        <Route path="/admin/temas/contenidos" element={<RutaPrivada rolesPermitidos={['administrador']}><LayoutEncabeAdmin><Contenidos /></LayoutEncabeAdmin></RutaPrivada>} />
        <Route path="/admin/cuestionarios" element={<RutaPrivada rolesPermitidos={['administrador']}><LayoutEncabeAdmin><CuestionariosForm /></LayoutEncabeAdmin></RutaPrivada>} />
        <Route path="/admin/informacion/mv" element={<RutaPrivada rolesPermitidos={['administrador']}><LayoutEncabeAdmin><Mision /></LayoutEncabeAdmin></RutaPrivada>} />
        <Route path="/admin/informacion/buzon" element={<RutaPrivada rolesPermitidos={['administrador']}><LayoutEncabeAdmin><Buzon /></LayoutEncabeAdmin></RutaPrivada>} />
        <Route path="/admin/subirtema" element={<RutaPrivada rolesPermitidos={['administrador']}><LayoutEncabeAdmin><Subirtema /></LayoutEncabeAdmin></RutaPrivada>} />
      </Routes>
    </Router>
  );
};

export default App;
  