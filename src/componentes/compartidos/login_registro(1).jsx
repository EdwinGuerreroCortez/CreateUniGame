import React from 'react';
import 'bulma/css/bulma.min.css'; // Importar Bulma CSS

const FormRegistro = () => {
  return (
    <div className="card has-background-black has-text-white" style={{ maxWidth: '400px', margin: '0 auto' }}>
      <div className="card-content">
        <h2 className="title has-text-centered">Login</h2>
        <form>
          <div className="field">
            <label className="label has-text-white">Email</label>
            <div className="control has-icons-left">
              <input className="input is-black" type="email" placeholder="e.g. alex@example.com" />
              <span className="icon is-small is-left has-text-white">
                <i className="fas fa-envelope"></i>
              </span>
            </div>
          </div>

          <div className="field">
            <label className="label has-text-white">Password</label>
            <div className="control has-icons-left">
              <input className="input is-black" type="password" placeholder="********" />
              <span className="icon is-small is-left has-text-white">
                <i className="fas fa-lock"></i>
              </span>
            </div>
          </div>

          <div className="field">
            <div className="control">
              <button className="button is-primary is-fullwidth">Sign in</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default FormRegistro;
