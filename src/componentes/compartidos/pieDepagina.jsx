import React from 'react';

const PieDePagina = () => {
  return (
    <footer className="footer has-background-black has-text-white">
      <div className="content has-text-centered">
        <p>Síguenos en nuestras redes sociales:</p>
        <div className="buttons is-centered">
          <a className="button is-white is-rounded" href="#" aria-label="Facebook">
            <span className="icon">
              <i className="fab fa-facebook-f"></i>
            </span>
          </a>
          <a className="button is-white is-rounded" href="#" aria-label="Twitter">
            <span className="icon">
              <i className="fab fa-twitter"></i>
            </span>
          </a>
          <a className="button is-white is-rounded" href="#" aria-label="Instagram">
            <span className="icon">
              <i className="fab fa-instagram"></i>
            </span>
          </a>
          <a className="button is-white is-rounded" href="#" aria-label="LinkedIn">
            <span className="icon">
              <i className="fab fa-linkedin-in"></i>
            </span>
          </a>
        </div>
        <p>© 2024 Tu Empresa. Todos los derechos reservados.</p>
      </div>
    </footer>
  );
}

export default PieDePagina;
