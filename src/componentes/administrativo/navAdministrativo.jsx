import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../CSS/style2.css'; // Asegúrate de que este archivo contenga los estilos apropiados
import logo from '../img/logo_Study.png';

const BarraNavAdmin = () => {
    const navigate = useNavigate();


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
                <Link className="navbar-item has-text-white animated-letters" to="/administrativa">
                    {renderAnimatedLetters("StudyWeb")}
                </Link>
            </div>

            <div className="navbar-menu">
                <div className="navbar-start">
                    <div className="navbar-item has-dropdown is-hoverable">
                        <a className="navbar-link has-text-success">Administración</a>
                        <div className="navbar-dropdown">
                            <Link className="navbar-item" to="/admin/usuarios">Usuarios</Link>
                            <Link className="navbar-item" to="/admin/informacion/buzon">Bandeja de Entrada</Link>
                            <Link className="navbar-item" to="/admin/informacion/mv">Misión visión</Link>
                        </div>
                    </div>
                    <Link className="navbar-item has-text-success" to="/admin/cuestionarios">Cuestionarios</Link>
                    <Link className="navbar-item has-text-success" to="/admin/evaluaciones">Evaluaciones</Link>

                    <div className="navbar-item has-dropdown is-hoverable">
                        <a className="navbar-link has-text-success">Temas</a>
                        <div className="navbar-dropdown">
                            <Link className="navbar-item" to="/admin/temas">Agregar Temas</Link>
                            <Link className="navbar-item" to="/admin/subirtema">Subir un Tema</Link>
                            <Link className="navbar-item" to="/admin/temas/contenidos">Administrar Contenidos</Link>
                        </div>
                    </div>
                    <Link className="navbar-item has-text-success" to="/admin/imagenes">Imagenes</Link>

                    <div className="navbar-item has-dropdown is-hoverable">
                        <a className="navbar-link has-text-success">Gestión de Curso</a>
                        <div className="navbar-dropdown">
                            <Link className="navbar-item" to="/admin/crearcurso">Crear Curso</Link>
                            <Link className="navbar-item" to="/admin/alumnos-suscritos">Alumnos suscritos</Link>
                        </div>
                    </div>
                </div>

                <div className="navbar-end">
                    <div className="navbar-item">
                        <button className="button is-primary" onClick={handleLogout}>Cerrar Sesión</button>
                    </div>
                </div>
            </div>
        </nav>
    );
}

export default BarraNavAdmin;
