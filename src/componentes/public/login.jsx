import React, { useState, useEffect } from 'react';
import 'bulma/css/bulma.min.css';
import { useNavigate } from 'react-router-dom';
import img1 from '../img/login1.jpg';
import img2 from '../img/login2.webp';
import img3 from '../img/login3.webp';
import img4 from '../img/login4.webp';
import img5 from '../img/login5.jpg';
import img6 from '../img/login6.jpg';
import { FaEye, FaEyeSlash } from 'react-icons/fa'; // Importa los íconos para el ojo

import '../CSS/style.css';

const backgrounds = [img1, img3, img6, img4, img5, img2];

const FormRegistro = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailValid, setEmailValid] = useState(false);
  const [backgroundIndex, setBackgroundIndex] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setEmailValid(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email));
  }, [email]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setBackgroundIndex((current) => (current + 1) % backgrounds.length);
    }, 5000);
    return () => clearInterval(intervalId);
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (emailValid && password) {
      console.log('Formulario enviado:', email, password);
    } else {
      alert('Por favor ingresa un correo válido y una contraseña.');
    }
  };

  const handleBack = () => {
    navigate('/');
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword); // Use a callback to toggle based on previous state
    console.log('Toggling password visibility'); // This will log to the console every time you click the icon
  };


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
      minHeight: '100vh'
    }}>
      <button onClick={handleBack} className="button is-light button-back" style={{ position: 'absolute', top: '10px', left: '10px' }}>
        Atrás
      </button>

      <div className="card has-background-black has-text-white" style={{ maxWidth: '400px', margin: '40px auto', padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'center', boxShadow: '0px 0px 10px 0px rgba(255,255,255,0.5)' }}>
        <div className="card-content">
          <h2 className="title has-text-centered has-text-white">Iniciar Sesión</h2>
          <p className="has-text-centered" style={{ marginBottom: '20px' }}>Ingresa tus datos para acceder a tu cuenta.</p>
          <form onSubmit={handleSubmit}>
            <div className="field">
              <label className="label has-text-white">Email</label>
              <div className="control has-icons-left">
                <input className="input is-black" type="email" placeholder="e.g. alex@example.com" value={email} onChange={e => setEmail(e.target.value)} />
                <span className="icon is-small is-left has-text-white">
                  <i className="fas fa-envelope"></i>
                </span>
              </div>
            </div>

            <div className="field">
              <label className="label has-text-white">Contraseña</label>
              <div className="control has-icons-left has-icons-right">
                <input className="input is-black" type={showPassword ? 'text' : 'password'} placeholder="********" value={password} onChange={e => setPassword(e.target.value)} />
                <span className="icon is-small is-left has-text-white">
                  <i className="fas fa-lock"></i>
                </span>
                <span className="icon is-small is-right has-text-white" onClick={togglePasswordVisibility} style={{ cursor: 'pointer' }}>
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </span>


              </div>

            </div>

            <div className="field">
              <div className="control">
                <button type="submit" className="button is-primary is-fullwidth">Iniciar sesión</button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default FormRegistro;
