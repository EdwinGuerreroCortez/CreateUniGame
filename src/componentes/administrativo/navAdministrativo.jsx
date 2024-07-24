import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../CSS/style2.css'; // Asegúrate de que este archivo contenga los estilos apropiados
import logo from '../img/logo_Study.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons'; // Icono para cerrar sesión

const BarraNavAdmin = () => {
    const navigate = useNavigate();

    // Función para manejar el cierre de sesión
    const handleLogout = () => {
        localStorage.removeItem('userId'); // Eliminar la sesión de localStorage
        localStorage.removeItem('usuario'); // Eliminar los datos del usuario de localStorage si están almacenados
        navigate('/'); // Redirigir al usuario a la página de inicio de sesión
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
                <Link className="navbar-item has-text-white animated-letters" to="/admin/bienvenida">
                    {renderAnimatedLetters("StudyWeb")}
                </Link>
            </div>

            <div className="navbar-menu">
                <div className="navbar-start">
                    {/* Menú de Administración */}
                    <div className="navbar-item has-dropdown is-hoverable">
                        <a className="navbar-link has-text-success">Administración</a>
                        <div className="navbar-dropdown">
                            <Link className="navbar-item" to="/admin/usuarios">Usuarios</Link>
                            <Link className="navbar-item" to="/admin/usuarios/entradas">Entradas</Link>
                            <Link className="navbar-item" to="/admin/informacion/buzon">Bandeja de Entrada</Link>
                            <Link className="navbar-item" to="/admin/informacion/mv">Misión y Visión</Link>
                        </div>
                    </div>

                    {/* Menú de Gestión de Exámenes */}
                    <div className="navbar-item has-dropdown is-hoverable">
                        <a className="navbar-link has-text-success">Gestión de Cuestionarios</a>
                        <div className="navbar-dropdown">
                            <Link className="navbar-item" to="/admin/cuestionarios">Subir Cuestionario</Link>
                            <Link className="navbar-item" to="/admin/evaluaciones">Evaluaciones Realizadas</Link>
                        </div>
                    </div>

                    {/* Menú de Temas */}
                    <div className="navbar-item has-dropdown is-hoverable">
                        <a className="navbar-link has-text-success">Temas</a>
                        <div className="navbar-dropdown">
                            <Link className="navbar-item" to="/admin/temas">Agregar Temas</Link>
                            <Link className="navbar-item" to="/admin/subirtema">Subir un Tema</Link>
                            <Link className="navbar-item" to="/admin/temas/contenidos">Administrar Contenidos</Link>
                            <Link className="navbar-item" to="/admin/recursos">Subir Recursos</Link>
                        </div>
                    </div>

                    {/* Menú de Gestión de Curso */}
                    <div className="navbar-item has-dropdown is-hoverable">
                        <a className="navbar-link has-text-success">Gestión de Curso</a>
                        <div className="navbar-dropdown">
                            <Link className="navbar-item" to="/admin/crearcurso">Crear Curso</Link>
                            <Link className="navbar-item" to="/admin/alumnos-suscritos">Alumnos suscritos</Link>
                        </div>
                    </div>

                    {/* Enlace a Imágenes */}
                    <Link className="navbar-item has-text-success" to="/admin/imagenes">Imágenes</Link>
                </div>

                {/* Botón de Cerrar Sesión */}
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

export default BarraNavAdmin;
