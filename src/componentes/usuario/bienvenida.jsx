// Bienvenida.jsx
import React from 'react';
import unityLogo from  '../img/unitylogo.jpg';
import cSharpLogo from  '../img/csharplogo.png';

const Bienvenida = () => {
  return (
    <div className="section">
      <div className="container">
        <h1 className="title">Bienvenido!</h1>
        <p>Gracias por unirte a nuestra plataforma.</p>
        <p>En esta plataforma encontrarás una gran variedad de recursos y contenido para aprender y mejorar tus habilidades en el desarrollo de videojuegos con Unity y C#.</p>
        
        <h2 className="subtitle">Tecnologías utilizadas:</h2>
        <div className="columns">
          <div className="column">
            <div className="content has-text-centered">
              <img src={unityLogo} alt="Logo de Unity" style={{ maxWidth: '150px' }} />
              <p>Descarga Unity</p>
              <a className="button is-primary is-rounded" href="https://unity.com/es" target="_blank" rel="noopener noreferrer">Descargar</a>
            </div>
          </div>
          <div className="column">
            <div className="content has-text-centered">
              <img src={cSharpLogo} alt="Logo de C#" style={{ maxWidth: '150px' }} />
              <p>Descarga Visual Studio con C#</p>
              <a className="button is-primary is-rounded" href="https://visualstudio.microsoft.com/es/downloads/" target="_blank" rel="noopener noreferrer">Descargar</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Bienvenida;
