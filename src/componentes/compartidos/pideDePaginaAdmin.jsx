import React from 'react';

const PieDePaginaAdmin = () => {
  return (
    <footer className="footer has-background-black has-text-white">
      <div className="content has-text-centered" style={{ borderTop: '1px solid white', borderBottom: '1px solid white', padding: '2rem 0' }}>
        <div className="columns">
          <div className="column">
            <p>Bienvenido al panel de administración de UniGame. Aquí puedes gestionar los recursos y cursos para nuestra comunidad.</p>
            <p>Si necesitas ayuda, no dudes en contactar con el equipo de soporte.</p>
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
  );
}

export default PieDePaginaAdmin;
