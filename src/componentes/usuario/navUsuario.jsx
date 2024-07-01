import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import 'bulma/css/bulma.min.css';
import '../CSS/style2.css';
import logo from '../img/logo_Study.png';
import Perfil from '../usuario/perfil';

const BarraNav = () => {
  const [estaActivo, setEstaActivo] = useState(false);
  const [estaPerfilAbierto, setEstaPerfilAbierto] = useState(false);
  const [usuario, setUsuario] = useState(null);
  const [cargandoUsuario, setCargandoUsuario] = useState(true); // Nuevo estado para indicador de carga
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      const userId = localStorage.getItem('userId');
      if (userId) {
        try {
          const response = await axios.get(`https://gamebackend-1.onrender.com/api/usuarios/${userId}`);
          const data = response.data;
          setUsuario(data);
        } catch (error) {
          console.error('Error al obtener los datos del usuario', error);
        } finally {
          setCargandoUsuario(false); // Desactivar indicador de carga
        }
      } else {
        setCargandoUsuario(false); // Desactivar indicador de carga si no hay userId
      }
    };

    fetchUserData();
  }, []);

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

  const handleLogout = () => {
    localStorage.removeItem('userId');
    localStorage.removeItem('userData');
    localStorage.removeItem('usuario');
    navigate('/');
  };

  return (
    <nav className="navbar has-background-black" role="navigation" aria-label="main navigation" style={{ height: '5rem' }}>
      <div className="navbar-brand">
        <img src={logo} alt="Logo" className="navbar-item" style={{ height: '5rem' }} />
        <Link className="navbar-item has-text-white animated-letters" to="/user/bienvenida">
          {renderizarLetrasAnimadas("StudyWeb")}
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
              <Link className="navbar-item has-text-success" to="/user/acerca">Acerca de StudyWeb</Link>
              <Link className="navbar-item has-text-success" to="/user/contacto">Contáctanos</Link>
            </div>
          </div>
          <Link className="navbar-item has-text-success" to="/user/bienvenida">Inicio</Link>
          <Link className="navbar-item has-text-success" to="/user/curso">Curso</Link>
          <Link className="navbar-item has-text-success" to="/user/recursos">Recursos</Link>
        </div>

        <div className="navbar-end">
          <div className="navbar-item">
            <div className="buttons">
              {cargandoUsuario ? (
                <div className="button is-loading">Cargando...</div> 
              ) : (
                usuario && (
                  <figure className="image is-48x48" style={{ cursor: 'pointer' }} onClick={alternarModalPerfil}>
                    <img className="is-rounded imagen-perfil" src={usuario.imagenPerfil || 'https://via.placeholder.com/48'} alt="Perfil" />
                  </figure>
                )
              )}
              <button className="button is-primary" onClick={handleLogout} style={{marginTop:'1px'}}>Cerrar sesión</button>
            </div>
          </div>
        </div>
      </div>

      <Perfil estaAbierto={estaPerfilAbierto} alCerrar={alternarModalPerfil} />
    </nav>
  );
};

export default BarraNav;
