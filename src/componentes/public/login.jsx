import React from 'react';
import 'bulma/css/bulma.min.css'; // Importar Bulma CSS
import { Link } from 'react-router-dom';
const FormRegistro = () => {
  return (
    <div style={{ backgroundColor: '#14161A', display: 'flex', justifyContent: 'center', alignItems: 'center'  }}>
      <div className="card has-background-black has-text-white" style={{ maxWidth: '400px', margin: '40px auto', padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'center', boxShadow: '0px 0px 10px 0px rgba(255,255,255,0.5)' }} >
        <div className="card-content">
          <h2 className="title has-text-centered">Iniciar Sesión</h2>
          <p className="has-text-centered" style={{ marginBottom: '20px' }}>Ingresa tus datos para acceder a tu cuenta.</p>
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
              <label className="label has-text-white">Contraseña</label>
              <div className="control has-icons-left">
                <input className="input is-black" type="password" placeholder="********" />
                <span className="icon is-small is-left has-text-white">
                  <i className="fas fa-lock"></i>
                </span>
              </div>
            </div>

            <div className="field">
              <div className="control">
             <Link  to="/bienvenida">
              <button className="button is-primary is-fullwidth">Iniciar sesión</button>
             </Link>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default FormRegistro;
