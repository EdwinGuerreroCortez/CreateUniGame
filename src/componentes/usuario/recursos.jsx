import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload, faBook, faCode } from '@fortawesome/free-solid-svg-icons';
import unityLogo from '../img/unitylogo.jpg';
import cSharpLogo from '../img/csharplogo.png';

const Recursos = () => {
  return (
    <div className="section" style={{ backgroundColor: '#14161A' }}>
      <style>
        {`
          .custom-card {
            background-color: #001f3f; 
            border: 2px solid #3273dc; 
            border-radius: 8px; 
            box-shadow: 0 4px 8px rgba(50, 115, 220, 0.5); 
            color: #ffffff; 
          }
          .has-text-white {
            text-shadow: 0 0 8px rgba(255, 255, 255, 0.8); 
          }
          .title, .subtitle {
            margin-bottom: 1.5rem;
          }
          .content p {
            margin-bottom: 1rem;
          }
          .button {
            margin-top: 1rem;
          }
        `}
      </style>
      <div className="container has-text-white">
        <h1 className="title has-text-white has-text-centered">Descarga los recursos que necesitarás</h1>
        <p className="has-text-centered">Gracias por unirte a nuestra plataforma.</p>
        <p className="has-text-centered">En esta plataforma encontrarás una gran variedad de recursos para ayudarte en tu viaje de desarrollo de videojuegos.</p>
        
        <h2 className="subtitle has-text-white has-text-centered">Tecnologías para que descargues desde la página oficial:</h2>
        <div className="columns is-centered">
          <div className="column is-one-quarter">
            <div className="card custom-card">
              <div className="card-content has-text-centered">
                <div className="content">
                  <img 
                    src={unityLogo} 
                    alt="Logo de Unity" 
                    style={{ width: '250px', height: '150px' }} 
                    className="animate__animated animate__bounceIn" 
                  />
                  <p>Descarga Unity para crear experiencias increíbles en 2D y 3D.</p>
                  <a className="button is-primary is-rounded" href="https://unity.com/es/download" target="_blank" rel="noopener noreferrer">
                    <FontAwesomeIcon icon={faDownload} style={{ marginRight: '8px' }} />
                    Descargar
                  </a>
                </div>
              </div>
            </div>
          </div>
          <div className="column is-one-quarter">
            <div className="card custom-card">
              <div className="card-content has-text-centered">
                <div className="content">
                  <img 
                    src={cSharpLogo} 
                    alt="Logo de C#" 
                    style={{ width: '150px', height: '150px' }} 
                    className="animate__animated animate__bounceIn" 
                  />
                  <p>Descarga Visual Studio con C# para un entorno de desarrollo robusto.</p>
                  <a className="button is-primary is-rounded" href="https://visualstudio.microsoft.com/es/downloads/" target="_blank" rel="noopener noreferrer">
                    <FontAwesomeIcon icon={faDownload} style={{ marginRight: '8px' }} />
                    Descargar
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <h2 className="subtitle has-text-white has-text-centered" style={{ marginTop: '3rem' }}>Recursos adicionales:</h2>
        <div className="columns is-centered">
          <div className="column is-one-third">
            <div className="card custom-card">
              <div className="card-content has-text-centered">
                <div className="content">
                  <h3 className="title is-4">
                    <FontAwesomeIcon icon={faBook} style={{ marginRight: '8px' }} />
                    Documentación de Unity
                  </h3>
                  <p>Accede a la documentación oficial de Unity para obtener guías, tutoriales y ejemplos.</p>
                  <a className="button is-link is-rounded" href="https://docs.unity3d.com/Manual/index.html" target="_blank" rel="noopener noreferrer">
                    <FontAwesomeIcon icon={faBook} style={{ marginRight: '8px' }} />
                    Visitar
                  </a>
                </div>
              </div>
            </div>
          </div>
          <div className="column is-one-third">
            <div className="card custom-card">
              <div className="card-content has-text-centered">
                <div className="content">
                  <h3 className="title is-4">
                    <FontAwesomeIcon icon={faCode} style={{ marginRight: '8px' }} />
                    Tutoriales de C#
                  </h3>
                  <p>Encuentra tutoriales y recursos para aprender C# y mejorar tus habilidades de programación.</p>
                  <a className="button is-link is-rounded" href="https://learn.microsoft.com/es-es/dotnet/csharp/" target="_blank" rel="noopener noreferrer">
                    <FontAwesomeIcon icon={faCode} style={{ marginRight: '8px' }} />
                    Visitar
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Recursos;
