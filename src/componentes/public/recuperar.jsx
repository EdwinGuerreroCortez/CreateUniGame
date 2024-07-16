import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bulma/css/bulma.min.css';
import '../CSS/style.css';

const RecuperarContrasena = () => {
  const [email, setEmail] = useState('');
  const [codigo, setCodigo] = useState('');
  const [nuevaContrasena, setNuevaContrasena] = useState('');
  const [confirmarContrasena, setConfirmarContrasena] = useState('');
  const [fase, setFase] = useState(1);
  const [emailValid, setEmailValid] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (errorMessage) {
      const timer = setTimeout(() => setErrorMessage(''), 3000);
      return () => clearTimeout(timer);
    }
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(''), 3000);
      return () => clearTimeout(timer);
    }
  }, [errorMessage, successMessage]);

  const handleEmailSubmit = async (event) => {
    event.preventDefault();
    if (emailValid) {
      try {
        const response = await fetch('http://localhost:3001/api/recuperar-contrasena', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Error desconocido');
        }

        setSuccessMessage('Se ha enviado un código de verificación a tu correo electrónico.');
        setFase(2);
      } catch (error) {
        setErrorMessage(error.message);
      }
    } else {
      setErrorMessage('Por favor ingresa un correo válido.');
    }
  };

  const handleCodigoSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch('http://localhost:3001/api/verificar-codigo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, codigoVerificacion: codigo }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Código de verificación incorrecto o expirado.');
      }

      setSuccessMessage('Código de verificación correcto. Ahora puedes cambiar tu contraseña.');
      setFase(3);
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  const handleContrasenaSubmit = async (event) => {
    event.preventDefault();
    if (nuevaContrasena !== confirmarContrasena) {
      setErrorMessage('Las contraseñas no coinciden.');
      return;
    }

    // Validar la nueva contraseña
    const contrasenaRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!contrasenaRegex.test(nuevaContrasena)) {
      setErrorMessage('La contraseña debe tener al menos 8 caracteres, incluir una letra mayúscula, una letra minúscula, un número y un carácter especial.');
      return;
    }

    try {
      const response = await fetch('http://localhost:3001/api/cambiar-contrasena', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, codigoVerificacion: codigo, nuevaContrasena }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error desconocido');
      }

      setSuccessMessage('Contraseña cambiada exitosamente.');
      setTimeout(() => navigate('/public/login'), 2000);
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  const handleBack = () => {
    navigate('/');
  };

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    setEmailValid(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value));
  };

  const renderFase1 = () => (
    <form onSubmit={handleEmailSubmit}>
      <div className="field">
        <label className="label has-text-white">Email</label>
        <div className="control has-icons-left">
          <input className="input is-black" type="email" placeholder="e.g. alex@example.com" value={email} onChange={handleEmailChange} />
          <span className="icon is-small is-left has-text-white">
            <i className="fas fa-envelope"></i>
          </span>
        </div>
      </div>
      <div className="field">
        <div className="control">
          <button type="submit" className="button is-primary is-fullwidth">Enviar</button>
        </div>
      </div>
    </form>
  );

  const renderFase2 = () => (
    <form onSubmit={handleCodigoSubmit}>
      <div className="field">
        <label className="label has-text-white">Código de Verificación</label>
        <div className="control has-icons-left">
          <input className="input is-black" type="text" placeholder="e.g. ABC123" value={codigo} onChange={e => setCodigo(e.target.value)} />
          <span className="icon is-small is-left has-text-white">
            <i className="fas fa-key"></i>
          </span>
        </div>
      </div>
      <div className="field">
        <div className="control">
          <button type="submit" className="button is-primary is-fullwidth">Verificar Código</button>
        </div>
      </div>
    </form>
  );

  const renderFase3 = () => (
    <form onSubmit={handleContrasenaSubmit}>
      <div className="field">
        <label className="label has-text-white">Nueva Contraseña</label>
        <div className="control has-icons-left">
          <input className="input is-black" type="password" placeholder="********" value={nuevaContrasena} onChange={e => setNuevaContrasena(e.target.value)} />
          <span className="icon is-small is-left has-text-white">
            <i className="fas fa-lock"></i>
          </span>
        </div>
      </div>
      <div className="field">
        <label className="label has-text-white">Confirmar Nueva Contraseña</label>
        <div className="control has-icons-left">
          <input className="input is-black" type="password" placeholder="********" value={confirmarContrasena} onChange={e => setConfirmarContrasena(e.target.value)} />
          <span className="icon is-small is-left has-text-white">
            <i className="fas fa-lock"></i>
          </span>
        </div>
      </div>
      <div className="field">
        <div className="control">
          <button type="submit" className="button is-primary is-fullwidth">Cambiar Contraseña</button>
        </div>
      </div>
    </form>
  );

  return (
    <div style={{
      backgroundColor: '#14161A',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      position: 'relative'
    }}>
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        transition: 'background-color 1s ease-in-out'
      }}></div>

      <button onClick={handleBack} className="button is-light button-back" style={{ position: 'absolute', top: '10px', left: '10px' }}>
        Atrás
      </button>

      {errorMessage && (
        <div className="notification is-danger is-light" style={{ position: 'absolute', top: '10px', width: '100%', textAlign: 'center' }}>
          {errorMessage}
        </div>
      )}
      {successMessage && (
        <div className="notification is-success is-light" style={{ position: 'absolute', top: '10px', width: '100%', textAlign: 'center' }}>
          {successMessage}
        </div>
      )}

      <div className="card has-background-black has-text-white" style={{ maxWidth: '400px', margin: '40px auto', padding: '10px', display: 'flex', flexDirection: 'column', justifyContent: 'center', boxShadow: '0px 0px 20px 0px rgba(255,255,255,0.8)', borderRadius: '10px' }}>
        <div className="card-content">
          <h2 className="title has-text-centered has-text-white">Recuperar Contraseña</h2>
          <p className="has-text-centered" style={{ marginBottom: '10px' }}>Ingresa tu correo para recibir instrucciones de recuperación.</p>
          {fase === 1 && renderFase1()}
          {fase === 2 && renderFase2()}
          {fase === 3 && renderFase3()}
        </div>
      </div>
    </div>
  );
};

export default RecuperarContrasena;
