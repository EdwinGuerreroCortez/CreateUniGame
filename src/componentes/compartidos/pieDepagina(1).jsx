import React from 'react';

const pieDePagina = () => {
  return (
    <footer className="footer has-background-black has-text-white">
      <div className="content has-text-centered">
        <p>
          Síguenos en nuestras redes sociales:
        </p>
        <div className="buttons is-centered">
          <a className="button is-white is-rounded" href="#">
            <span className="icon">
              <i className="fab fa-facebook"></i>
            </span>
          </a>
          <a className="button is-white is-rounded" href="#">
            <span className="icon">
              <i className="fab fa-twitter"></i>
            </span>
          </a>
          <a className="button is-white is-rounded" href="#">
            <span className="icon">
              <i className="fab fa-instagram"></i>
            </span>
          </a>
          <a className="button is-white is-rounded" href="#">
            <span className="icon">
              <i className="fab fa-linkedin"></i>
            </span>
          </a>
        </div>
        <p>
          © 2024 Tu Empresa. Todos los derechos reservados.
        </p>
        <p>
          Yo soy Gera y todos nosotros lo somos, tu puedes si crees en ti
        </p>
      </div>
    </footer>
  );
}

export default pieDePagina;
