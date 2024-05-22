// login.js
import React, { useState, useEffect } from 'react';
import 'bulma/css/bulma.min.css';
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

import '../CSS/style.css';

const backgrounds = [img9, img1, img3, img6, img4, img8, img5, img2, img7];

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

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (emailValid && password) {
      try {
        const response = await fetch('https://gamebackend-1.onrender.com/api/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password }),
        });
  
        if (!response.ok) {
          throw new Error('Correo o contraseña incorrectos');
        }
  
        const data = await response.json();
        console.log('Inicio de sesión exitoso:', data);
  
        // Verificar si el ID del usuario y el tipo están presentes en la respuesta
        const userId = data.userId;
        const userType = data.tipo;
  
        if (userId && userType) {
          // Almacenar el ID del usuario y el tipo en localStorage
          localStorage.setItem('userId', userId);
          localStorage.setItem('userType', userType);
  
          // Redirigir según el tipo de usuario
          if (userType === 'cliente') {
            navigate('/bienvenida'); // Redirigir a la página de bienvenida
          } else if (userType === 'administrador') {
            navigate('/administrativa'); // Redirigir a la página administrativa
          } else {
            throw new Error('Tipo de usuario desconocido');
          }
        } else {
          throw new Error('ID del usuario o tipo no encontrados en la respuesta');
        }
      } catch (error) {
        alert(error.message);
      }
    } else {
      alert('Por favor ingresa un correo válido y una contraseña.');
    }
  };
  

  const handleBack = () => {
    navigate('/');
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
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

      <div className="card has-background-black has-text-white" style={{ maxWidth: '400px', margin: '40px auto', padding: '10px', display: 'flex', flexDirection: 'column', justifyContent: 'center', boxShadow: '0px 0px 20px 0px rgba(255,255,255,0.8)', borderRadius: '10px' }}>
        <div className="card-content">
          <h2 className="title has-text-centered has-text-white">Iniciar Sesión</h2>
          <p className="has-text-centered" style={{ marginBottom: '10px' }}>Ingresa tus datos para acceder a tu cuenta.</p>
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
              <div className="control has-icons-left has-icons-right is-flex">
                <div style={{ display: 'flex', width: '100%' }}>
                  <input className="input is-black" type={showPassword ? 'text' : 'password'} placeholder="********" value={password} onChange={e => setPassword(e.target.value)} style={{ flexGrow: 1 }} />
                  <button type="button" onClick={togglePasswordVisibility} className="button is-light is-small" style={{ marginLeft: '10px', height: '70%' }}>
                    {showPassword ? 'Ocultar' : 'Mostrar'}
                  </button>
                </div>
                <span className="icon is-small is-left has-text-white">
                  <i className="fas fa-lock"></i>
                </span>
              </div>
            </div>

            <div className="field">
              <div className="control">
                <button type="submit" className="button is-primary is-fullwidth">Iniciar sesión</button>
              </div>
            </div>
          </form>
          <div className="has-text-centered" style={{ marginTop: '10px' }}>
            <p className="has-text-white" style={{ fontSize: '15px' }} >¿No tienes cuenta? <a href="/registro" className="has-text-link" style={{ fontSize: '15px' }}>Regístrate</a></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormRegistro;
