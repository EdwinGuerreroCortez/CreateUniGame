import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import animacion from '../img/animacion-unscreen.gif';

const Bienvenida = () => {
  const [userData, setUserData] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      const userId = localStorage.getItem('userId');
      if (userId) {
        try {
          const response = await fetch(`http://localhost:3001/api/usuarios/${userId}`);
          if (!response.ok) {
            throw new Error('Error al obtener los datos del usuario');
          }
          const data = await response.json();
          setUserData(data);
        } catch (error) {
          console.error(error);
        }
      } else {
        navigate('/'); // Redirige al usuario al inicio de sesión si no hay ID en localStorage
      }
    };

    fetchUserData();
  }, [navigate]);

  return (
    <div className="section has-background-black-bis">
      <div className="container">
        <div className="columns is-centered">
          <div className="column is-half-tablet is-one-third-desktop" style={{ marginBottom: '1.5rem' }}> {/* Ajuste de columna para diferentes pantallas y margen */}
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
          <div className="column is-half-tablet is-one-third-desktop" style={{ marginBottom: '1.5rem' }}> {/* Ajuste de columna para diferentes pantallas y margen */}
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
