import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import animacion from '../img/animacion-unscreen.gif';

const BienvenidaAdmin = () => {
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      const userId = localStorage.getItem('userId');
      if (userId) {
        try {
          const response = await axios.get(`http://localhost:3001/api/usuarios/${userId}`);
          const data = response.data;
          setUserData(data);
          localStorage.setItem('userData', JSON.stringify(data));
          setIsLoading(false);
        } catch (error) {
          console.error('Error al obtener los datos del usuario', error);
          navigate('/'); // Redirige al usuario al inicio de sesión en caso de error
        }
      } else {
        navigate('/'); // Redirige al usuario al inicio de sesión si no hay ID en localStorage
      }
    };

    fetchUserData();
    const intervalId = setInterval(fetchUserData, 500); // Actualiza los datos del usuario cada 0.5 segundos

    return () => clearInterval(intervalId); // Limpia el intervalo cuando el componente se desmonte
  }, [navigate]);

  if (isLoading) {
    return (
      <div className="section has-background-black-bis">
        <div className="container">
          <div className="columns is-centered">
            <div className="column is-half-tablet is-one-third-desktop" style={{ marginBottom: '1.5rem' }}>
              <div className="card profile-card" style={{ backgroundColor: '#001f3f', border: '2px solid #3273dc', borderRadius: '8px', boxShadow: '0 4px 8px rgba(50, 115, 220, 0.5)', color: '#ffffff', padding: '1.1rem', height: '100%' }}>
                <div className="card-content has-text-centered">
                  <div className="content">
                    <h2 className="title has-text-white">Cargando...</h2>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="section has-background-black-bis">
      <div className="container">
        <div className="columns is-centered">
          <div className="column is-half-tablet is-one-third-desktop" style={{ marginBottom: '1.5rem' }}>
            <div className="card profile-card" style={{ backgroundColor: '#001f3f', border: '2px solid #3273dc', borderRadius: '8px', boxShadow: '0 4px 8px rgba(50, 115, 220, 0.5)', color: '#ffffff', padding: '1.1rem', height: '100%' }}>
              <div className="card-content has-text-centered">
                <div className="content">
                  <h2 className="title has-text-white">Panel Docente</h2>
                  <img 
                    src={userData.imagenPerfil || 'https://via.placeholder.com/150'} 
                    alt={`Foto de perfil de ${userData.datos_personales.nombre}`} 
                    style={{ borderRadius: '50%', width: '150px', height: '150px' }}
                  />
                  <p>Acceso al panel de control de administración. Gestiona usuarios, configura permisos y monitorea la actividad de la plataforma.</p>
                </div>
              </div>
            </div>
          </div>
          <div className="column is-half-tablet is-one-third-desktop" style={{ marginBottom: '1.5rem' }}>
            <div className="card" style={{ backgroundColor: '#001f3f', border: '2px solid #3273dc', borderRadius: '8px', boxShadow: '0 4px 8px rgba(50, 115, 220, 0.5)', color: '#ffffff', height: '100%' }}>
              <div className="card-content has-text-centered">
                <div className="content">
                  <h1 style={{ color: '#ffffff' }}>¡Bienvenido, {userData.datos_personales.nombre}!</h1>
                  <p>Este es tu panel de administración donde podrás gestionar toda la plataforma.</p>
                  <p>Aprovecha las herramientas avanzadas para mejorar la experiencia de los usuarios en la plataforma.</p>
                  <img src={animacion} alt="Animación de administración" style={{ width: '250px', height: '150px' }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BienvenidaAdmin;
