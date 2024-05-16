import React from 'react';
import animacion from '../img/animacion-unscreen.gif';

const Bienvenida = () => {
  return (
    <div className="section has-background-black-bis">
      <div className="container">
        <div className="columns is-centered">
          <div className="column is-half-tablet is-one-third-desktop" style={{ marginBottom: '1.5rem', }}> {/* Ajuste de columna para diferentes pantallas y margen */}
            <div className="card profile-card" style={{ backgroundColor: '#001f3f', border: '2px solid #3273dc', borderRadius: '8px', boxShadow: '0 4px 8px rgba(50, 115, 220, 0.5)', color: '#ffffff', padding: '1.1rem', height: '100%' }}>
              <div className="card-content has-text-centered">
                <div className="content">
                  <h2 className="title has-text-white">Nombre del Usuario</h2>
                  <img 
                    src="https://via.placeholder.com/150" 
                    alt="Foto de perfil" 
                    style={{ borderRadius: '50%', width: '150px', height: '150px' }}
                  />
                  <p>Información del perfil del usuario. Aquí puedes añadir más detalles sobre el usuario, su rol, y cualquier otra información relevante.</p>
                </div>
              </div>
            </div>
          </div>
          <div className="column is-half-tablet is-one-third-desktop" style={{ marginBottom: '1.5rem', }}> {/* Ajuste de columna para diferentes pantallas y margen */}
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
