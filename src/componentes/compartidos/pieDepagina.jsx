// src/componentes/public/PieDePagina.js

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Modal from 'react-modal';

// Estilo para el modal
const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: 'rgba(0, 0, 0, 0.85)', // Fondo transparente
    color: '#fff',
    border: '1px solid #fff',
    padding: '2rem',
    width: '80%',
    maxWidth: '800px',
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)', // Fondo semi-transparente
  },
};

const PieDePagina = () => {
  const [modalIsOpen, setIsOpen] = useState(false);
  const [mision, setMision] = useState('');
  const [vision, setVision] = useState('');

  useEffect(() => {
    // Aquí se puede agregar la lógica para llamar a la API y obtener la misión y visión
    // Ejemplo:
    // fetch('/api/mision-vision')
    //   .then(response => response.json())
    //   .then(data => {
    //     setMision(data.mision);
    //     setVision(data.vision);
    //   });
  }, []);

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  return (
    <>
      <footer className="footer has-background-black has-text-white">
        <div className="content has-text-centered" style={{ borderTop: '1px solid white', borderBottom: '1px solid white', padding: '2rem 0' }}>
          <div className="columns">
            <div className="column">
              <p>Nuestra misión es proporcionar una educación de clase mundial en desarrollo de videojuegos para cualquier persona, en cualquier lugar.</p>
              <p>UniGame es una plataforma educativa dedicada al aprendizaje interactivo en la creación de videojuegos.</p>
            </div>
            <div className="column">
              <p>Únete a nuestra comunidad:</p>
              <div className="buttons is-centered">
                <Link className="button is-link" to="/registro">Únete</Link>
                <Link className="button is-info" to="/login">Conéctate</Link>
              </div>
              <div className="buttons is-centered" style={{ marginTop: '1rem' }}>
                <button className="button is-primary" onClick={openModal}>Más Información</button>
              </div>
            </div>
          </div>
          <div style={{ marginTop: '20px' }}>
            <p>Síguenos en nuestras redes sociales:</p>
            <div className="buttons is-centered">
              <a className="button is-light" href="https://facebook.com" aria-label="Facebook">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a className="button is-light" href="https://twitter.com" aria-label="Twitter">
                <i className="fab fa-twitter"></i>
              </a>
              <a className="button is-light" href="https://instagram.com" aria-label="Instagram">
                <i className="fab fa-instagram"></i>
              </a>
              <a className="button is-light" href="https://linkedin.com" aria-label="LinkedIn">
                <i className="fab fa-linkedin-in"></i>
              </a>
            </div>
          </div>
          <p>© 2024 UniGame. Todos los derechos reservados.</p>
        </div>
      </footer>
      
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Más Información"
        ariaHideApp={false}
      >
        <h1 className="title has-text-white has-text-centered">Más Información</h1>
        <div className="columns">
          <div className="column">
            <h2 className="subtitle has-text-white"> Visión</h2>
            <p className="has-text-white">
              {vision || 'Ser la plataforma líder en educación de desarrollo de videojuegos, empoderando a millones de desarrolladores a nivel mundial para crear juegos innovadores y exitosos.'}
            </p>
          </div>
          <div className="column">
            <h2 className="subtitle has-text-white"> Misión</h2>
            <p className="has-text-white">
              {mision || 'Proporcionar una plataforma accesible y completa que brinde todas las herramientas y recursos necesarios para que cualquier persona, sin importar su nivel de experiencia, pueda aprender a desarrollar videojuegos.'}
            </p>
          </div>
        </div>
        <div className="buttons is-centered">
          <button className="button is-primary" onClick={closeModal}>Cerrar</button>
        </div>
      </Modal>
    </>
  );
}

export default PieDePagina;
