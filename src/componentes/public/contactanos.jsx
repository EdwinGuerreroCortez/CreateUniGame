// src/componentes/public/ContactForm.js

import React, { useState } from 'react';
import contactImage from '../img/login1.jpg'; // Suponiendo que tienes una imagen representativa
import 'bulma/css/bulma.min.css';
import '../CSS/ContactForm.css'; // Archivo CSS para los estilos adicionales

const ContactForm = () => {
  const [formData, setFormData] = useState({
    email: '',
    message: '',
    type: 'sugerencia' // valor predeterminado
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aquí puedes manejar el envío del formulario, por ejemplo, enviando los datos a una API
    console.log('Form data submitted:', formData);
  };

  return (
    <section className="section" style={styles.section}>
      <div className="container">
        <div className="columns is-vcentered is-variable is-8">
          <div className="column is-half">
            <figure className="image-container" style={styles.imageContainer}>
              <img src={contactImage} alt="Contact Us" style={styles.image} />
            </figure>
          </div>
          <div className="column is-half">
            <div className="box has-background-dark" style={styles.box}>
              <h1 className="title has-text-white is-size-3">Contáctanos</h1>
              <p className="has-text-white">
                Para cualquier sugerencia o queja, por favor completa el siguiente formulario.
              </p>
              <form onSubmit={handleSubmit}>
                <div className="field">
                  <label className="label has-text-white">Tipo de Mensaje</label>
                  <div className="control">
                    <div className="select is-fullwidth">
                      <select name="type" value={formData.type} onChange={handleChange}>
                        <option value="sugerencia">Sugerencia</option>
                        <option value="queja">Queja</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div className="field">
                  <label className="label has-text-white">Correo Electrónico</label>
                  <div className="control has-icons-left">
                    <input 
                      className="input has-icons-left" 
                      type="email" 
                      name="email" 
                      value={formData.email} 
                      onChange={handleChange} 
                      required 
                      placeholder="e.g. alex@example.com"
                      style={styles.input} 
                    />
                    <span className="icon is-small is-left">
                      <i className="fas fa-envelope"></i>
                    </span>
                  </div>
                </div>
                <div className="field">
                  <label className="label has-text-white">Mensaje</label>
                  <div className="control has-icons-left">
                    <textarea 
                      className="textarea has-icons-left" 
                      name="message" 
                      value={formData.message} 
                      onChange={handleChange} 
                      required 
                      placeholder="Escribe tu mensaje aquí"
                      style={styles.textarea} 
                    />
                    <span className="icon is-small is-left">
                      <i className="fas fa-comment-dots"></i>
                    </span>
                  </div>
                </div>
                <div className="field">
                  <div className="control">
                    <button className="button is-primary" type="submit" style={styles.button}>
                      Enviar
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

const styles = {
  section: {
    backgroundColor: '#14161A',
    color: 'white',
    padding: '40px 20px',
    fontFamily: 'Poppins, sans-serif',
  },
  imageContainer: {
    position: 'relative',
    display: 'inline-block',
    boxShadow: '0 0 15px 5px rgba(72, 199, 142, 0.5)', // Borde luminoso alrededor de la imagen
    borderRadius: '10px',
  },
  image: {
    display: 'block',
    borderRadius: '10px',
    maxWidth: '100%',
    height: 'auto',
  },
  box: {
    backgroundColor: '#090A0C',
    padding: '30px',
    borderRadius: '10px',
  },
  input: {
    backgroundColor: '#2C2F33',
    color: 'white',
    border: '1px solid #48C78E',
  },
  textarea: {
    backgroundColor: '#2C2F33',
    color: 'white',
    border: '1px solid #48C78E',
  },
  button: {
    backgroundColor: '#48C78E',
    borderColor: '#48C78E',
    color: 'white',
  },
};

export default ContactForm;
