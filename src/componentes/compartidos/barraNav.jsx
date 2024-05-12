import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../CSS/style.css'; // Importa el archivo CSS
import logo from '../img/logo.gif';


const BarraNav = () => {
  const [isActive, setIsActive] = useState(false);

  const toggleBurgerMenu = () => {
    setIsActive(!isActive);
  };

  return (
    <nav className="navbar has-background-black" role="navigation" aria-label="main navigation" style={{ height: '5rem' }}>
      <div className="navbar-brand">
        <img src={logo} alt="Logo" className="navbar-item" style={{ height: '5rem' }} />
        <Link className="navbar-item has-text-white" to="/">UniGame</Link>
        <a role="button" className={`navbar-burger burger ${isActive ? 'is-active' : ''}`} aria-label="menu" aria-expanded={isActive ? 'true' : 'false'} onClick={toggleBurgerMenu}>
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
        </a>
      </div>

      <div id="navbarBasicExample" className={`navbar-menu ${isActive ? 'is-active' : ''}`}>
        <div className="navbar-start">
          <div className="navbar-item has-dropdown is-hoverable">
            <a className="navbar-link has-text-white">Cursos</a>
            <div className="navbar-dropdown">
              <Link className="navbar-item" to="/curso1">Curso 1</Link>
              <Link className="navbar-item" to="/curso2">Curso 2</Link>
              <Link className="navbar-item" to="/curso3">Curso 3</Link>
            </div>
          </div>
          <Link className="navbar-item has-text-white" to="/">Inicio</Link>
        </div>

        <div className="navbar-end">
          <div className="navbar-item">
            <Link className="button is-light" to="/login" style={{ marginRight: '0.5rem' }}>Login</Link>
            <Link className="button is-primary" to="/registro">Registro</Link>
          </div>
        </div>

      </div>
    </nav>
  );
}

export default BarraNav;
