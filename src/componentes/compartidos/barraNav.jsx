import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const BarraNav = () => {
  const [isActive, setIsActive] = useState(false);

  const toggleBurgerMenu = () => {
    setIsActive(!isActive);
  };

  return (
    <nav className="navbar has-background-black has-text-white" role="navigation" aria-label="main navigation">
      <div className="navbar-brand">
        <Link className="navbar-item" to="/">
          <strong>My App</strong>
        </Link>

        <a role="button" className="navbar-burger burger" aria-label="menu" aria-expanded={isActive} data-target="navbarBasicExample" onClick={toggleBurgerMenu}>
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
        </a>
      </div>

      <div id="navbarBasicExample" className={`navbar-menu ${isActive ? 'is-active' : ''}`}>
        <div className="navbar-start">
          <Link className="navbar-item" to="/">
            Inicio
          </Link>
        </div>

        <div className="navbar-end">
          <div className="navbar-item">
            <div className="buttons">
              <Link className="button is-light" to="/login">
                Login
              </Link>
              <Link className="button is-primary" to="/login_registro">
                Registro
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default BarraNav;
