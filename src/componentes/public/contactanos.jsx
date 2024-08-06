import React, { useState, useEffect } from 'react';
import contactImage from '../img/contactanos.webp';
import 'bulma/css/bulma.min.css';
import '../CSS/ContactForm.css';

const ContactForm = () => {
  const [formData, setFormData] = useState({
    tipoMensaje: 'Pregunta',
    correo: '',
    mensaje: '',
    preguntaEspecifica: '',
  });
  const [alert, setAlert] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Limpiar el temporizador si el componente se desmonta
    let timer;
    if (alert) {
      timer = setTimeout(() => {
        setAlert(null);
      }, 2000); // 2000 ms = 2 segundos
    }
    return () => clearTimeout(timer);
  }, [alert]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const validateEmail = async (email) => {
    try {
      const response = await fetch(`http://172.16.19.1:3001/api/usuarios/validarCorreo`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ correo: email }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Server response:', data); // Imprimir respuesta del servidor

        if (data.message === 'Correo electrónico válido y autorizado.') {
          return true;
        } else if (data.message === 'No tiene permiso para acceder a esta funcionalidad.') {
          setAlert({ type: 'is-warning', message: 'Aún no se ha otorgado permiso desde el sistema.' });
          return false;
        } else if (data.message === 'Usuario no existe.') {
          setAlert({ type: 'is-warning', message: 'El correo electrónico no está registrado.' });
          return false;
        } else {
          setAlert({ type: 'is-danger', message: 'Respuesta del servidor desconocida.' });
          return false;
        }
      } else {
        const errorData = await response.json();
        setAlert({ type: 'is-danger', message: errorData.message || 'Error al validar el correo electrónico.' });
        return false;
      }
    } catch (error) {
      console.error('Error:', error); // Imprimir error en consola
      setAlert({ type: 'is-danger', message: 'Error al validar el correo electrónico.' });
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Validar correo electrónico
    const emailExists = await validateEmail(formData.correo);
    if (!emailExists) {
      setIsLoading(false);
      return;
    }

    // Validar campos requeridos
    if (formData.tipoMensaje === 'Pregunta') {
      if (formData.preguntaEspecifica.trim() === '') {
        setAlert({ type: 'is-danger', message: 'Debe especificar su pregunta.' });
        setIsLoading(false);
        return;
      }
    } else {
      if (formData.mensaje.trim() === '') {
        setAlert({ type: 'is-danger', message: 'El mensaje no puede estar vacío.' });
        setIsLoading(false);
        return;
      }
    }

    // Determinar URL del endpoint basado en el tipo de mensaje
    let apiUrl = 'http://172.16.19.1:3001/api/contact/messages/faqs';
    if (formData.tipoMensaje === 'Sugerencia') {
      apiUrl = 'http://172.16.19.1:3001/api/contact/messages/suggestions';
    } else if (formData.tipoMensaje === 'Queja') {
      apiUrl = 'http://172.16.19.1:3001/api/contact/messages/complaints';
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
          preguntaEspecifica: '',
        });
      } else {
        const errorData = await response.json();
        setAlert({ type: 'is-danger', message: errorData.message || 'Error al enviar el mensaje.' });
      }
    } catch (error) {
      setAlert({ type: 'is-danger', message: 'Error al enviar el mensaje.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="contact-section">
      <div className="container">
        <div className="columns is-vcentered is-variable is-8">
          <div className="column is-half">
            <figure className="image-container">
              <img src={contactImage} alt="Contact Us" className="contact-image" />
            </figure>
          </div>
          <div className="column is-half">
            <div className="box contact-box" id='contact'>
              <h1 className="title contact-title" id='titlee'>
                Contáctanos
              </h1>
              <p className="contact-description">
                Para cualquier sugerencia, pregunta o queja, por favor completa el siguiente formulario.
              </p>
              {alert && (
                <div className={`notification ${alert.type}`}>
                  {alert.message}
                </div>
              )}
              <form onSubmit={handleSubmit}>
                <div className="field">
                  <label className="label contact-label">Tipo de Mensaje</label>
                  <div className="control">
                    <div className="select is-fullwidth contact-select">
                      <select name="tipoMensaje" value={formData.tipoMensaje} onChange={handleChange}>
                        <option>Pregunta</option>
                        <option>Sugerencia</option>
                        <option>Queja</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div className="field">
                  <label className="label contact-label">Correo Electrónico</label>
                  <div className="control has-icons-left">
                    <input
                      className="input contact-input"
                      type="email"
                      name="correo"
                      value={formData.correo}
                      onChange={handleChange}
                      required
                      placeholder="ej. alex@example.com"
                    />
                    <span className="icon is-small is-left">
                      <i className="fas fa-envelope"></i>
                    </span>
                  </div>
                </div>
                {formData.tipoMensaje === 'Pregunta' ? (
                  <div className="field">
                    <label className="label contact-label">¿Cuál es su pregunta específica?</label>
                    <div className="control has-icons-left">
                      <input
                        className="input contact-input"
                        type="text"
                        name="preguntaEspecifica"
                        value={formData.preguntaEspecifica}
                        onChange={handleChange}
                        placeholder="Escriba su pregunta aquí"
                      />
                      <span className="icon is-small is-left">
                        <i className="fas fa-question-circle"></i>
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="field">
                    <label className="label contact-label">Mensaje</label>
                    <div className="control has-icons-left">
                      <textarea
                        className="textarea contact-textarea"
                        name="mensaje"
                        value={formData.mensaje}
                        onChange={handleChange}
                        required
                        placeholder="Escribe tu mensaje aquí"
                      />
                      <span className="icon is-small is-left">
                        <i className="fas fa-comment-dots"></i>
                      </span>
                    </div>
                  </div>
                )}
                <div className="field">
                  <div className="control">
                    <button className="button is-primary contact-button" type="submit" disabled={isLoading}>
                      {isLoading ? (
                        <span className="icon">
                          <i className="fas fa-spinner fa-spin"></i>
                        </span>
                      ) : (
                        <span className="icon">
                          <i className="fas fa-paper-plane"></i>
                        </span>
                      )}
                      <span>{isLoading ? 'Enviando...' : 'Enviar'}</span>
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

export default ContactForm;
