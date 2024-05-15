import React from 'react';
import unityLogo from '../img/unitylogo.jpg';
import cSharpLogo from '../img/csharplogo.png';

const recursos = () => {
  return (
    <div className="section has-background-black">
      <style>
        {`
          .custom-card {
            background-color: #001f3f; /* Azul marino */
            border: 2px solid #3273dc; /* Azul Bulma */
            border-radius: 8px; /* Bordes redondeados */
            box-shadow: 0 4px 8px rgba(50, 115, 220, 0.5); /* Sombra azul */
            color: #ffffff; /* Texto blanco */
          }
        `}
      </style>
      <div className="container has-text-white">
        <h1 className="title has-text-white">Descarga los recursos que necesitarás</h1>
        <p>Gracias por unirte a nuestra plataforma.</p>
        <p>En esta plataforma encontrarás una gran variedad de recursos.</p>
        
        <h2 className="subtitle has-text-white">Tecnologías para que descargues desde la página oficial:</h2>
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
                  <p>Descarga Unity</p>
                  <a className="button is-primary is-rounded" href="https://unity.com/es" target="_blank" rel="noopener noreferrer">Descargar</a>
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
                  <p>Descarga Visual Studio con C#</p>
                  <a className="button is-primary is-rounded" href="https://visualstudio.microsoft.com/es/downloads/" target="_blank" rel="noopener noreferrer">Descargar</a>
                </div>
              </div>
            </div>
          </div>
        </div>
        
      </div>
    </div>
  );
};

export default recursos;
