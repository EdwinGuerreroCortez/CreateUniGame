import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../CSS/style2.css'; // Asegúrate de que este archivo contenga los estilos apropiados
import logo from '../img/logo_Study.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons'; // Icono para cerrar sesión

const BarraNavDocen = () => {
    const [isActive, setIsActive] = useState(false);
    const [userType, setUserType] = useState(null); // Estado para almacenar el tipo de usuario
    const navigate = useNavigate();

    useEffect(() => {
                const userData = JSON.parse(localStorage.getItem('usuario'));
        if (userData) {
            setUserType(userData.tipo); // Establecer el tipo de usuario en el estado
                     }
    }, []);

    const toggleBurgerMenu = () => {
        setIsActive(!isActive);
    };

    const handleLogout = () => {
        localStorage.removeItem('userId'); // Eliminar la sesión de localStorage
        localStorage.removeItem('usuario'); // Eliminar los datos del usuario de localStorage si están almacenados
        navigate('/'); // Redirigir al usuario a la página de inicio de sesión
    };

        const renderAnimatedLetters = (word) => {
        return word.split('').map((char, index) => (
            <span key={index} className="animated-letter">{char}</span>
        ));
    };

    return (
        <nav className="navbar custom-navbar" role="navigation" aria-label="main navigation" style={{ height: '5rem' }}>
            <div className="navbar-brand">
                <img src={logo} alt="Logo" className="navbar-item" style={{ height: '5rem' }} />
                <Link className="navbar-item has-text-white animated-letters" to="/docente/bienvenida">
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
                        <a className="navbar-link has-text-success">Gestión de Cuestionarios</a>
                        <div className="navbar-dropdown">
                            <Link className="navbar-item has-text-success" to="/docente/cuestionarios">Subir Cuestionarios</Link>
                            <Link className="navbar-item has-text-success" to="/docente/evaluaciones">Evaluaciones Realizadas</Link>
                        </div>
                    </div>

                    <div className="navbar-item has-dropdown is-hoverable">
                        <a className="navbar-link has-text-success">Temas</a>
                        <div className="navbar-dropdown">
                            <Link className="navbar-item" to="/docente/temas">Agregar Temas</Link>
                            <Link className="navbar-item" to="/docente/subirtema">Subir un Tema</Link>
                            <Link className="navbar-item" to="/docente/temas/contenidos">Administrar Contenidos</Link>
                            <Link className="navbar-item" to="/docente/recursos">Subir Recursos</Link>
                        </div>
                    </div>

                    <div className="navbar-item has-dropdown is-hoverable">
                        <a className="navbar-link has-text-success">Gestión de Curso</a>
                        <div className="navbar-dropdown">
                            <Link className="navbar-item" to="/docente/crearcurso">Crear Curso</Link>
                            <Link className="navbar-item" to="/docente/alumnos-suscritos">Alumnos suscritos</Link>
                        </div>
                    </div>
                    <Link className="navbar-item has-text-success" to="/docente/imagenes">Imágenes</Link>

                </div>

                <div className="navbar-end">
                    <div className="navbar-item">
                        <button className="button is-primary" onClick={handleLogout}>
                            <FontAwesomeIcon icon={faSignOutAlt} style={{ marginRight: '8px' }} />
                            Cerrar Sesión
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
}

export default BarraNavDocen;
