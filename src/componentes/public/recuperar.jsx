import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import img1 from '../img/login1.jpg';
import img2 from '../img/login2.webp';
import img3 from '../img/login3.webp';
import img4 from '../img/login4.webp';
import img5 from '../img/login5.jpg';
import img6 from '../img/login6.jpg';
import img7 from '../img/img11.jpg';
import img8 from '../img/img9.jpg';
import img9 from '../img/img8.jpg';
import 'bulma/css/bulma.min.css';
import '../CSS/style.css';

const backgrounds = [img9, img1, img3, img6, img4, img8, img5, img2, img7];

const preloadImages = (images) => {
  return Promise.all(images.map((image) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = image;
      img.onload = resolve;
    });
  }));
};

const RecuperarContrasena = () => {
  const [email, setEmail] = useState('');
  const [codigo, setCodigo] = useState('');
  const [nuevaContrasena, setNuevaContrasena] = useState('');
  const [confirmarContrasena, setConfirmarContrasena] = useState('');
  const [fase, setFase] = useState(1);
  const [emailValid, setEmailValid] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [backgroundIndex, setBackgroundIndex] = useState(0);
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

  useEffect(() => {
    preloadImages(backgrounds);
    const interval = setInterval(() => {
      setBackgroundIndex((prevIndex) => (prevIndex + 1) % backgrounds.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleEmailSubmit = async (event) => {
    event.preventDefault();
    if (emailValid) {
      try {
        const response = await fetch('http://172.16.19.1:3001/api/recuperar-contrasena', {
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
      const response = await fetch('http://172.16.19.1:3001/api/verificar-codigo', {
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
      const response = await fetch('http://172.16.19.1:3001/api/cambiar-contrasena', {
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
        <div className="control has-icons-left has-icons-right">
          <input
            className="input is-black"
            type={showPassword ? 'text' : 'password'}
            placeholder="********"
            value={nuevaContrasena}
            onChange={e => setNuevaContrasena(e.target.value)}
          />
          <span className="icon is-small is-left has-text-white">
            <i className="fas fa-lock"></i>
          </span>
          <button
            type="button"
            className="button is-small is-right has-text-white"
            onClick={() => setShowPassword(!showPassword)}
            style={{ position: 'absolute', right: '10px', top: '5px', backgroundColor: 'green', color: 'black' }}
          >
            {showPassword ? 'Ocultar' : 'Mostrar'}
          </button>
        </div>
      </div>
      <div className="field">
        <label className="label has-text-white">Confirmar Nueva Contraseña</label>
        <div className="control has-icons-left has-icons-right">
          <input
            className="input is-black"
            type={showConfirmPassword ? 'text' : 'password'}
            placeholder="********"
            value={confirmarContrasena}
            onChange={e => setConfirmarContrasena(e.target.value)}
          />
          <span className="icon is-small is-left has-text-white">
            <i className="fas fa-lock"></i>
          </span>
          <button
            type="button"
            className="button is-small is-right has-text-white"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            style={{ position: 'absolute', right: '10px', top: '5px', backgroundColor: 'green', color: 'black' }}
          >
            {showConfirmPassword ? 'Ocultar' : 'Mostrar'}
          </button>
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
      backgroundImage: `url(${backgrounds[backgroundIndex]})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      transition: 'background-image 1s ease-in-out',
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
