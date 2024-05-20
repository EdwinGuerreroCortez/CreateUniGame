import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import animacion from '../img/animacion-unscreen.gif';

const Bienvenida = () => {
  const [userData, setUserData] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      const userId = localStorage.getItem('userId');
      if (userId) {
        try {
          const response = await axios.get(`https://gamebackend-1.onrender.com/api/usuarios/${userId}`);
          const data = response.data;
          setUserData(data);
          localStorage.setItem('userData', JSON.stringify(data));
        } catch (error) {
          console.error('Error al obtener los datos del usuario', error);
        }
      } else {
        navigate('/'); // Redirige al usuario al inicio de sesión si no hay ID en localStorage
      }
    };

    fetchUserData();

    const intervalId = setInterval(fetchUserData, 500); // Actualiza los datos del usuario cada 30 segundos

    return () => clearInterval(intervalId); // Limpia el intervalo cuando el componente se desmonte
  }, [navigate]);

  return (
    <div className="section has-background-black-bis">
      <div className="container">
        <div className="columns is-centered">
          <div className="column is-half-tablet is-one-third-desktop" style={{ marginBottom: '1.5rem' }}>
            <div className="card profile-card" style={{ backgroundColor: '#001f3f', border: '2px solid #3273dc', borderRadius: '8px', boxShadow: '0 4px 8px rgba(50, 115, 220, 0.5)', color: '#ffffff', padding: '1.1rem', height: '100%' }}>
              <div className="card-content has-text-centered">
                <div className="content">
                  <h2 className="title has-text-white">{userData.username ? userData.username : 'Nombre del Usuario'}</h2>
                  <img 
                    src={userData.imagenPerfil ? userData.imagenPerfil : "https://via.placeholder.com/150"} 
                    alt="Foto de perfil" 
                    style={{ borderRadius: '50%', width: '150px', height: '150px' }}
                  />
                  <p>{userData.datos_personales && userData.datos_personales.correo ? userData.datos_personales.correo : 'Correo del Usuario'}</p>
                </div>
              </div>
            </div>
          </div>
          <div className="column is-half-tablet is-one-third-desktop" style={{ marginBottom: '1.5rem' }}>
            <div className="card" style={{ backgroundColor: '#001f3f', border: '2px solid #3273dc', borderRadius: '8px', boxShadow: '0 4px 8px rgba(50, 115, 220, 0.5)', color: '#ffffff', height: '100%' }}>
              <div className="card-content has-text-centered">
                <div className="content">
                  <h1 style={{ color: '#ffffff' }}>¡Bienvenido!</h1>
                  <p>Gracias por unirte a nuestra plataforma.</p>
                  <p>En esta plataforma encontrarás una gran variedad de recursos y contenido para aprender y mejorar tus habilidades en el desarrollo de videojuegos con Unity y C#.</p>
                  <img src={animacion} alt="Animación" style={{ width: '250px', height: '150px' }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Bienvenida;
