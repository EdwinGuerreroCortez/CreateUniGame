// navUsuario.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import 'bulma/css/bulma.min.css'; // Importa Bulma CSS
import '../CSS/style2.css'; // Si necesitas estilos adicionales
import logo from '../img/logo.gif';
import Perfil from '../usuario/perfil';

const BarraNav = () => {
  const [estaActivo, setEstaActivo] = useState(false);
  const [estaPerfilAbierto, setEstaPerfilAbierto] = useState(false);

  const alternarMenuBurger = () => {
    setEstaActivo(!estaActivo);
  };

  const alternarModalPerfil = () => {
    setEstaPerfilAbierto(!estaPerfilAbierto);
  };

  const renderizarLetrasAnimadas = (palabra) => {
    return palabra.split('').map((char, index) => (
      <span key={index} className="animated-letter">{char}</span>
    ));
  };

  return (
    <nav className="navbar has-background-black" role="navigation" aria-label="main navigation" style={{ height: '5rem' }}>
      <div className="navbar-brand">
        <img src={logo} alt="Logo" className="navbar-item" style={{ height: '5rem' }} />
        <Link className="navbar-item has-text-white animated-letters" to="/bienvenida">
          {renderizarLetrasAnimadas("UniGame")}
        </Link>
        <a role="button" className={`navbar-burger burger ${estaActivo ? 'is-active' : ''}`} aria-label="menu" aria-expanded={estaActivo ? 'true' : 'false'} onClick={alternarMenuBurger}>
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
        </a>
      </div>

      <div id="navbarBasicExample" className={`navbar-menu ${estaActivo ? 'is-active' : ''}`}>
        <div className="navbar-start">
          <div className="navbar-item has-dropdown is-hoverable">
            <a className="navbar-link has-text-success">Explorar</a>
            <div className="navbar-dropdown">
              <Link className="navbar-item has-text-success" to="/acerca-de">Acerca de</Link>
              <Link className="navbar-item has-text-success" to="/contactanos">Contáctanos</Link>
              <Link className="navbar-item has-text-success" to="/soporte">Soporte</Link>
              <Link className="navbar-item has-text-success" to="/blog">Blog</Link>
            </div>
          </div>
          <Link className="navbar-item has-text-success" to="/bienvenida">Inicio</Link>
          <Link className="navbar-item has-text-success" to="/curso">Curso</Link>
          <Link className="navbar-item has-text-success" to="/recursos">Recursos</Link>
        </div>

        <div className="navbar-end">
          <div className="navbar-item">
            <button className="button is-primary" onClick={alternarModalPerfil}>Perfil</button>
            <Link className="button is-primary" to="/#">Cerrar sesión</Link>
          </div>
        </div>
      </div>

      <Perfil estaAbierto={estaPerfilAbierto} alCerrar={alternarModalPerfil} />
    </nav>
  );
};

export default BarraNav;
