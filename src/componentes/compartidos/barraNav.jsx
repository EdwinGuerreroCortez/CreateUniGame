import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../CSS/style2.css'; // Importa el archivo CSS
import logo from '../img/logo_Study.png';
import '@fortawesome/fontawesome-free/css/all.css'; // Importa Font Awesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignInAlt, faUserPlus, faHome, faCompass } from '@fortawesome/free-solid-svg-icons'; // Importa los iconos necesarios

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
        <Link className="navbar-item has-text-white animated-letters" to="/">
          {renderAnimatedLetters("StudyWeb")}
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
            <a className="navbar-link has-text-success">
              <FontAwesomeIcon icon={faCompass} style={{ marginRight: '0.5rem' }} />
              Explorar
            </a>
            <div className="navbar-dropdown">
              <Link className="navbar-item has-text-success" to="/public/acerca">Acerca de StudyWeb</Link>
              <Link className="navbar-item has-text-success" to="/public/contactanos">Contáctanos</Link>
            </div>
          </div>
          <Link className="navbar-item has-text-success" to="/">
            <FontAwesomeIcon icon={faHome} style={{ marginRight: '0.5rem' }} />
            Inicio
          </Link>
        </div>

        <div className="navbar-end">
          <div className="navbar-item">
            <Link className="button is-success" to="/public/login" style={{ marginRight: '0.5rem' }}>
              <FontAwesomeIcon icon={faSignInAlt} style={{ marginRight: '0.5rem' }} />
              Iniciar Sesión
            </Link>
            <Link className="button is-primary" to="/public/registro" style={{ marginRight: '0.5rem' }}>
              <FontAwesomeIcon icon={faUserPlus} style={{ marginRight: '0.5rem' }} />
              Regístrate
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default BarraNav;
