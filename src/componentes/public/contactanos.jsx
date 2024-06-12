// src/components/ContactForm.js
import React, { useState } from 'react';
import contactImage from '../img/contactanos.webp';
import 'bulma/css/bulma.min.css';
import '../CSS/ContactForm.css';

const ContactForm = () => {
  const [formData, setFormData] = useState({
    tipoMensaje: 'Pregunta',
    correo: '',
    mensaje: '',
    preguntaEspecifica: '', // Nuevo campo para pregunta específica
  });
  const [alert, setAlert] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.tipoMensaje === 'Pregunta') {
      if (formData.preguntaEspecifica.trim() === '') {
        setAlert({ type: 'is-danger', message: 'Debe especificar su pregunta.' });
        setTimeout(() => {
          setAlert(null);
        }, 3000); // Ocultar la alerta después de 5 segundos
        return;
      }
    } else {
      if (formData.mensaje.trim() === '') {
        setAlert({ type: 'is-danger', message: 'El mensaje no puede estar vacío.' });
        setTimeout(() => {
          setAlert(null);
        }, 3000); // Ocultar la alerta después de 5 segundos
        return;
      }
    }

    let apiUrl = 'http://localhost:3001/api/contact/messages/faqs';
    if (formData.tipoMensaje === 'Sugerencia') {
      apiUrl = 'http://localhost:3001/api/contact/messages/suggestions';
    } else if (formData.tipoMensaje === 'Queja') {
      apiUrl = 'http://localhost:3001/api/contact/messages/complaints';
    }

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          tipoMensaje: formData.tipoMensaje,
          correo: formData.correo,
          mensaje: formData.tipoMensaje === 'Pregunta' ? formData.preguntaEspecifica : formData.mensaje
        })
      });
      if (response.ok) {
        let successMessage = 'Mensaje enviado con éxito.';
        if (formData.tipoMensaje === 'Pregunta') {
          successMessage = 'Gracias por su pregunta. La atenderemos pronto.';
        } else if (formData.tipoMensaje === 'Sugerencia') {
          successMessage = 'Gracias por su sugerencia. La tomaremos en cuenta.';
        } else if (formData.tipoMensaje === 'Queja') {
          successMessage = 'Gracias por su queja. La atenderemos a la brevedad.';
        }

        setAlert({ type: 'is-success', message: successMessage });
        setFormData({
          tipoMensaje: 'Pregunta',
          correo: '',
          mensaje: '',
          preguntaEspecifica: '', // Reiniciar campo de pregunta específica
        });
        setTimeout(() => {
          setAlert(null);
        }, 3000); // Ocultar la alerta después de 5 segundos

      } else {
        setAlert({ type: 'is-danger', message: 'Error al enviar el mensaje.' });
      }
    } catch (error) {
      setAlert({ type: 'is-danger', message: 'Error al enviar el mensaje.' });
    }
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
                Para cualquier sugerencia, pregunta o queja, por favor completa el siguiente formulario.
              </p>
              {alert && (
                <div className={`notification ${alert.type}`}>
                  {alert.message}
                </div>
              )}
              <form onSubmit={handleSubmit}>
                <div className="field">
                  <label className="label has-text-white">Tipo de Mensaje</label>
                  <div className="control">
                    <div className="select is-fullwidth" style={styles.select}>
                      <select name="tipoMensaje" value={formData.tipoMensaje} onChange={handleChange}>
                        <option>Pregunta</option>
                        <option>Sugerencia</option>
                        <option>Queja</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div className="field">
                  <label className="label has-text-white">Correo Electrónico</label>
                  <div className="control has-icons-left">
                    <input
                      className="input"
                      type="email"
                      name="correo"
                      value={formData.correo}
                      onChange={handleChange}
                      required
                      placeholder="ej. alex@example.com"
                      style={styles.input}
                    />
                    <span className="icon is-small is-left">
                      <i className="fas fa-envelope"></i>
                    </span>
                  </div>
                </div>
                {formData.tipoMensaje === 'Pregunta' ? (
                  <div className="field">
                    <label className="label has-text-white">¿Cuál es su pregunta específica?</label>
                    <div className="control has-icons-left">
                      <input
                        className="input"
                        type="text"
                        name="preguntaEspecifica"
                        value={formData.preguntaEspecifica}
                        onChange={handleChange}
                        placeholder="Escriba su pregunta aquí"
                        style={styles.input}
                      />
                      <span className="icon is-small is-left">
                        <i className="fas fa-question-circle"></i>
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="field">
                    <label className="label has-text-white">Mensaje</label>
                    <div className="control has-icons-left">
                      <textarea
                        className="textarea"
                        name="mensaje"
                        value={formData.mensaje}
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
                )}
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
    border: '1px solid #48C78E',
    boxShadow: '0 0 10px rgba(72, 199, 142, 0.5)',
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
    paddingLeft: '40px'
  },
  button: {
    backgroundColor: '#48C78E',
    borderColor: '#48C78E',
    color: 'white',
  },
  select: {
    backgroundColor: '#2C2F33',
    color: 'white',
    border: '1px solid #48C78E',
    height: '42px'
  },
};

export default ContactForm;
