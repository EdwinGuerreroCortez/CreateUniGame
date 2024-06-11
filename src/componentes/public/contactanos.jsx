import React, { useState } from 'react';
import contactImage from '../img/contactanos.webp'; // Suponiendo que tienes una imagen representativa
import 'bulma/css/bulma.min.css';
import '../CSS/ContactForm.css'; // Archivo CSS para los estilos adicionales

const ContactForm = () => {
  const [formData, setFormData] = useState({
    pregunta: '',
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
    if (formData.pregunta.trim() === '') {
      setAlert({ type: 'is-danger', message: 'La pregunta no puede estar vacía.' });
      return;
    }

    try {
      const response = await fetch('http://localhost:3001/api/faqs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      if (response.ok) {
        setAlert({ type: 'is-success', message: 'Pregunta enviada con éxito.' });
        // Limpiar el formulario después del envío
        setFormData({
          pregunta: '',
        });
      } else {
        setAlert({ type: 'is-danger', message: 'Error al enviar la pregunta.' });
      }
    } catch (error) {
      setAlert({ type: 'is-danger', message: 'Error al enviar la pregunta.' });
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
                Para cualquier duda que tengas, por favor completa el siguiente formulario.
              </p>
              {alert && (
                <div className={`notification ${alert.type}`}>
                  {alert.message}
                </div>
              )}
              <form onSubmit={handleSubmit}>
                <div className="field">
                  <label className="label has-text-white">Mensaje</label>
                  <div className="control has-icons-left">
                    <textarea 
                      className="textarea has-icons-left" 
                      name="pregunta" 
                      value={formData.pregunta} 
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
