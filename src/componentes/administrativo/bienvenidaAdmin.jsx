import React from 'react';
import animacion from '../img/animacion-unscreen.gif';

const BienvenidaAdmin = () => {
  return (
    <div className="section has-background-black-bis">
      <div className="container">
        <div className="columns is-centered">
          <div className="column is-half-tablet is-one-third-desktop" style={{ marginBottom: '1.5rem', marginRight: '1rem' }}>
            <div className="card profile-card" style={{ backgroundColor: '#001f3f', border: '2px solid #3273dc', borderRadius: '8px', boxShadow: '0 4px 8px rgba(50, 115, 220, 0.5)', color: '#ffffff', padding: '1.1rem', height: '100%' }}>
              <div className="card-content has-text-centered">
                <div className="content">
                  <h2 className="title has-text-white">Administrador</h2>
                  <img 
                    src="https://via.placeholder.com/150" 
                    alt="Foto de perfil del administrador" 
                    style={{ borderRadius: '50%', width: '150px', height: '150px' }}
                  />
                  <p>Acceso al panel de control de administración. Gestiona usuarios, configura permisos y monitorea la actividad de la plataforma.</p>
                </div>
              </div>
            </div>
          </div>
          <div className="column is-half-tablet is-one-third-desktop" style={{ marginBottom: '1.5rem', marginLeft: '1rem' }}>
            <div className="card" style={{ backgroundColor: '#001f3f', border: '2px solid #3273dc', borderRadius: '8px', boxShadow: '0 4px 8px rgba(50, 115, 220, 0.5)', color: '#ffffff', height: '100%' }}>
              <div className="card-content has-text-centered">
                <div className="content">
                  <h1 style={{ color: '#ffffff' }}>¡Bienvenido, Administrador!</h1>
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
