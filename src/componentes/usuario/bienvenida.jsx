import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import animacion from '../img/animacion-unscreen.gif';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faUserCircle } from '@fortawesome/free-solid-svg-icons';
import 'bulma/css/bulma.min.css';

const Bienvenida = () => {
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
            <div className="column is-half-tablet is-one-third-desktop" style={styles.column}>
              <div className="card profile-card" style={styles.card}>
                <div className="card-content has-text-centered" style={styles.cardContent}>
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
        <div className="columns is-centered is-multiline" style={styles.columns}>
          <div className="column is-half-tablet is-one-third-desktop" style={styles.column}>
            <div className="card profile-card" style={styles.card}>
              <div className="card-content has-text-centered" style={styles.cardContent}>
                <div className="content">
                  <h2 className="title has-text-white">
                    <FontAwesomeIcon icon={faUserCircle} /> {userData.username}
                  </h2>
                  <img 
                    src={userData.imagenPerfil || 'https://via.placeholder.com/150'} 
                    alt="Foto de perfil" 
                    style={styles.profileImage}
                  />
                  <p>
                    <FontAwesomeIcon icon={faEnvelope} /> Correo Electrónico:
                  </p>
                  <p>{userData.datos_personales.correo}</p>
                </div>
              </div>
            </div>
          </div>
          <div className="column is-half-tablet is-one-third-desktop" style={styles.column}>
            <div className="card" style={styles.card}>
              <div className="card-content has-text-centered" style={styles.cardContent}>
                <div className="content">
                  <h1 className="title has-text-white">¡Bienvenido!</h1>
                  <p>Gracias por unirte a nuestra plataforma.</p>
                  <p>En esta plataforma encontrarás una gran variedad de recursos y contenido para aprender y mejorar tus habilidades en diversas áreas de la computación y tecnología.</p>
                  <img src={animacion} alt="Animación" style={styles.animationImage} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  columns: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'normal',
  },
  column: {
    marginBottom: '1.5rem',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'stretch', // Ensure columns stretch to the same height
  },
  card: {
    backgroundColor: '#000080', // Un azul ligeramente más claro
    border: '2px solid #3273dc',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(50, 115, 220, 0.5)',
    color: '#ffffff',
    padding: '1.1rem',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    width: '100%', // Ensure the card takes full width within its column
  },
  cardContent: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  },
  profileImage: {
    borderRadius: '50%',
    width: '150px',
    height: '150px',
    marginBottom: '1rem',
  },
  animationImage: {
    width: '250px',
    height: '150px',
    marginTop: '1rem',
  },
};

export default Bienvenida;
