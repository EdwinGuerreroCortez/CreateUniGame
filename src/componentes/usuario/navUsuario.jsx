import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../CSS/style2.css'; // Importa el archivo CSS
import logo from '../img/logo.gif';

const BarraNav = () => {
  const [isActive, setIsActive] = useState(false);

  const toggleBurgerMenu = () => {
    setIsActive(!isActive);
  };

  // Función para envolver cada letra en un span
  const renderAnimatedLetters = (word) => {
    return word.split('').map((char, index) => (
      <span key={index} className="animated-letter">{char}</span>
    ));
  };

  return (
    <nav className="navbar has-background-black" role="navigation" aria-label="main navigation" style={{ height: '5rem' }}>
      <div className="navbar-brand">
        <img src={logo} alt="Logo" className="navbar-item" style={{ height: '5rem' }} />
        <Link className="navbar-item has-text-white animated-letters" to="/bienvenida">
          {renderAnimatedLetters("UniGame")}
        </Link>
        <a role="button" className={`navbar-burger burger ${isActive ? 'is-active' : ''}`} aria-label="menu" aria-expanded={isActive ? 'true' : 'false'} onClick={toggleBurgerMenu}>
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
        </a>
      </div>

      <div id="navbarBasicExample" className={`navbar-menu ${isActive ? 'is-active' : ''}`}>
        <div className="navbar-start">
          <div className="navbar-item has-dropdown is-hoverable">
            <a className="navbar-link has-text-white">Explorar</a>
            <div className="navbar-dropdown">
              <Link className="navbar-item" to="/acerca-de">Acerca de</Link>
              <Link className="navbar-item" to="/contactanos">Contáctanos</Link>
              <Link className="navbar-item" to="/soporte">Soporte</Link>
              <Link className="navbar-item" to="/blog">Blog</Link>
            </div>
          </div>
          <Link className="navbar-item has-text-white" to="/bienvenida">Inicio</Link>
          <Link className="navbar-item has-text-white" to="/curso">Curso</Link>
          <Link className="navbar-item has-text-white" to="/recursos">Recursos</Link>
        </div>

        <div className="navbar-end">         
         <div className="navbar-item">
          <Link className="button is-primary" to="/#">Perfil</Link>
            <Link className="button is-primary" to="/#">Cerrar sesión</Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default BarraNav;
