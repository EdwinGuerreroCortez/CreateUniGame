import React from 'react';

const barraNav= () => {
  return (
    <nav className="navbar has-background-black has-text-white" role="navigation" aria-label="main navigation">
      <div className="navbar-brand">
        <a className="navbar-item" href="#">
          <strong>My App</strong>
        </a>

        <a role="button" className="navbar-burger burger" aria-label="menu" aria-expanded="false" data-target="navbarBasicExample">
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
        </a>
      </div>

      <div id="navbarBasicExample" className="navbar-menu">
        <div className="navbar-start">
          <a className="navbar-item" href="#">
            Inicio
          </a>
        </div>

        <div className="navbar-end">
          <div className="navbar-item">
            <div className="buttons">
              <a className="button is-light" href="#">
                Login
              </a>
              <a className="button is-primary" href="#">
                Registro
              </a>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default barraNav;
