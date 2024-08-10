import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebookF, faTwitter, faInstagram, faLinkedinIn } from '@fortawesome/free-brands-svg-icons';

const PieDePaginaAdmin = () => {
  return (
    <footer className="footer has-background-black has-text-white">
      <div className="content has-text-centered" style={styles.content}>
        <div className="columns">
          <div className="column">
            <p>Bienvenido al panel de administración de StudyWeb. Aquí puedes gestionar los recursos y cursos para nuestra comunidad.</p>
            <p>Si necesitas ayuda, no dudes en contactar con el equipo de soporte.</p>
          </div>
        </div>
        <div style={{ marginTop: '20px' }}>
          <p>Síguenos en nuestras redes sociales:</p>
          <div className="buttons is-centered">
            <a className="button is-light" href="https://www.facebook.com/share/fpDSm77DTmYnd8AA/?mibextid=qi2Omg" aria-label="Facebook" style={styles.socialButton}>
              <FontAwesomeIcon icon={faFacebookF} />
            </a>
            <a className="button is-light" href="https://twitter.com" aria-label="Twitter" style={styles.socialButton}>
              <FontAwesomeIcon icon={faTwitter} />
            </a>
            <a className="button is-light" href="https://instagram.com" aria-label="Instagram" style={styles.socialButton}>
              <FontAwesomeIcon icon={faInstagram} />
            </a>
            <a className="button is-light" href="https://linkedin.com" aria-label="LinkedIn" style={styles.socialButton}>
              <FontAwesomeIcon icon={faLinkedinIn} />
            </a>
          </div>
        </div>
        <p style={{ marginTop: '20px' }}>© 2024 StudyWeb. Todos los derechos reservados.</p>
      </div>
    </footer>
  );
};

const styles = {
  content: {
    borderTop: '1px solid white',
    borderBottom: '1px solid white',
    padding: '2rem 0',
  },
  socialButton: {
    margin: '0 10px',
  }
};

export default PieDePaginaAdmin;
