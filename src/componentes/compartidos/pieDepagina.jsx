import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Modal from 'react-modal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebookF, faTwitter, faInstagram, faLinkedinIn } from '@fortawesome/free-brands-svg-icons';
import { faInfoCircle, faUserPlus, faSignInAlt } from '@fortawesome/free-solid-svg-icons';

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
    fetch('http://172.16.19.1:3001/api/misionVision')
      .then(response => response.json())
      .then(data => {
        if (data && data.length > 0) {
          setMision(data[0].mision);
          setVision(data[0].vision);
        } else {
          console.error('La respuesta de la API no contiene datos');
        }
      })
      .catch(error => console.error('Error al obtener la misión y visión:', error));
  }, []);

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  return (
    <>
      <footer className="footer has-background-black has-text-white">
        <div className="content has-text-centered" style={{ borderTop: '1px solid white', borderBottom: '1px solid white', padding: '2rem 0' }}>
          <div className="columns">
            <div className="column">
              <p>Nuestra misión es proporcionar una educación de clase mundial en diversas áreas de la computación para cualquier persona, en cualquier lugar.</p>
              <p>StudyWeb es una plataforma educativa dedicada al aprendizaje interactivo en tecnología y computación.</p>
            </div>
            <div className="column">
              <p>Únete a nuestra comunidad:</p>
              <div className="buttons is-centered">
                <Link className="button is-link" to="/public/registro">
                  <FontAwesomeIcon icon={faUserPlus} style={{ marginRight: '8px' }} />
                  Únete
                </Link>
                <Link className="button is-info" to="/public/login">
                  <FontAwesomeIcon icon={faSignInAlt} style={{ marginRight: '8px' }} />
                  Conéctate
                </Link>
              </div>
              <div className="buttons is-centered" style={{ marginTop: '1rem' }}>
                <button className="button is-primary" onClick={openModal}>
                  <FontAwesomeIcon icon={faInfoCircle} style={{ marginRight: '8px' }} />
                  Más Información
                </button>
              </div>
            </div>
          </div>
          <div style={{ marginTop: '20px' }}>
            <p>Síguenos en nuestras redes sociales:</p>
            <div className="buttons is-centered">
              <a className="button is-light" href="https://facebook.com" aria-label="Facebook">
                <FontAwesomeIcon icon={faFacebookF} />
              </a>
              <a className="button is-light" href="https://twitter.com" aria-label="Twitter">
                <FontAwesomeIcon icon={faTwitter} />
              </a>
              <a className="button is-light" href="https://instagram.com" aria-label="Instagram">
                <FontAwesomeIcon icon={faInstagram} />
              </a>
              <a className="button is-light" href="https://linkedin.com" aria-label="LinkedIn">
                <FontAwesomeIcon icon={faLinkedinIn} />
              </a>
            </div>
          </div>
          <p>© 2024 StudyWeb. Todos los derechos reservados.</p>
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
            <h2 className="subtitle has-text-white">Visión</h2>
            <p className="has-text-white">
              {vision || 'Cargando...'}
            </p>
          </div>
          <div className="column">
            <h2 className="subtitle has-text-white">Misión</h2>
            <p className="has-text-white">
              {mision || 'Cargando...'}
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
