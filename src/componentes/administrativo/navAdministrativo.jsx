// src/componentes/public/BarraNavAdmin.js

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../CSS/style2.css'; // Asegúrate de que este archivo contenga los estilos apropiados
import logo from '../img/logo_empresa.gif';

const BarraNavAdmin = () => {
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
        <nav className="navbar custom-navbar" role="navigation" aria-label="main navigation" style={{ height: '5rem' }}>
            <div className="navbar-brand">
                <img src={logo} alt="Logo" className="navbar-item" style={{ height: '5rem' }} />
                <Link className="navbar-item has-text-white animated-letters" to="/administrativa">
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
                    <Link className="navbar-item has-text-success" to="/admin/users">Gestión de Usuarios</Link>
                    <Link className="navbar-item has-text-success" to="/admin/temas">Temas</Link>
                    <div className="navbar-item has-dropdown is-hoverable">
                        <a className="navbar-link has-text-success">Calificaciones</a>
                        <div className="navbar-dropdown">
                            <Link className="navbar-item" to="/admin/calificaciones/enero">Enero</Link>
                            <Link className="navbar-item" to="/admin/calificaciones/febrero">Febrero</Link>
                            <Link className="navbar-item" to="/admin/calificaciones/marzo">Marzo</Link>
                        </div>
                    </div>
                    <Link className="navbar-item has-text-success" to="/admin/cuestionarios">Cuestionarios</Link>
                    <div className="navbar-item has-dropdown is-hoverable">
                        <a className="navbar-link has-text-success">Informacion</a>
                        <div className="navbar-dropdown">
                            <Link className="navbar-item" to="/admin/informacion/faqs">Preguntas Frecuentes</Link>
                            <Link className="navbar-item" to="/admin/informacion/mision">mision</Link>
                            <Link className="navbar-item" to="/admin/informacion/vision">vision</Link>
                        </div>
                    </div>                
                </div>

                <div className="navbar-end">
                    <div className="navbar-item">
                        <Link className="button is-success" style={{ marginRight: '10px' }} to="/admin/settings">Configuraciones</Link>
                        <Link className="button is-primary" to="/">Cerrar Sesión</Link>
                    </div>
                </div>
            </div>
        </nav>
    );
}

export default BarraNavAdmin;
