import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../CSS/style.css'; // Importa el archivo CSS

const BarraNav = () => {
  const [isActive, setIsActive] = useState(false);
  const [isHoveredUniGame, setIsHoveredUniGame] = useState(false); // Estado para controlar si el cursor está sobre "UniGame"
  const [isHoveredInicio, setIsHoveredInicio] = useState(false); // Estado para controlar si el cursor está sobre "Inicio"
  const location = useLocation();

  const toggleBurgerMenu = () => {
    setIsActive(!isActive);
  };

  const handleMouseEnterUniGame = () => {
    setIsHoveredUniGame(true);
  };

  const handleMouseLeaveUniGame = () => {
    setIsHoveredUniGame(false);
  };

  const handleMouseEnterInicio = () => {
    setIsHoveredInicio(true);
  };

  const handleMouseLeaveInicio = () => {
    setIsHoveredInicio(false);
  };

  // Color del texto "UniGame" según el estado del hover
  const textColorUniGame = isHoveredUniGame ? '#000000' : 'rgb(189, 189, 189)';

  // Color del texto "Inicio" según el estado del hover
  const textColorInicio = isHoveredInicio ? '#000000': 'rgb(189, 189, 189)';

  return (
    <nav className="navbar has-background-black" role="navigation" aria-label="main navigation">
    <div className="navbar-brand">
      <Link className="navbar-item" to="/">
        <strong className="has-text" onMouseEnter={handleMouseEnterUniGame} onMouseLeave={handleMouseLeaveUniGame} style={{ color: textColorUniGame }}>
          UniGame
        </strong>
      </Link>
  
      <a role="button" className={`navbar-burger burger ${isActive ? 'is-active' : ''}`} aria-label="menu" aria-expanded={isActive ? 'true' : 'false'} data-target="navbarBasicExample" onClick={toggleBurgerMenu}>
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
      </a>
    </div>
  
    <div id="navbarBasicExample" className={`navbar-menu ${isActive ? 'is-active' : ''}`}>
      <div className="navbar-start">
        <Link className={`navbar-item`} to="/paginaPrincipal" >
          <strong className="has-text" onMouseEnter={handleMouseEnterInicio} onMouseLeave={handleMouseLeaveInicio} style={{ color: textColorInicio }}>
            Inicio
          </strong>
        </Link>
      </div>
  
      <div className="navbar-end">
        <div className="navbar-item">
          <div className="field has-addons">
            <div className="control">
              <div className="select is-primary">
                <select>
                  <option>Cursos</option>
                  <option>Curso 1</option>
                  <option>Curso 2</option>
                  <option>Curso 3</option>
                </select>
              </div>
            </div>
          </div>
        </div>
  
        <div className="navbar-item">
          <div className="buttons">
            <Link className="button is-light" to="/login">
              Login
            </Link>
            <Link className="button is-primary" to="/registro">
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