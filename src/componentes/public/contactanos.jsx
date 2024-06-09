import React, { useState } from 'react';
import 'bulma/css/bulma.min.css';
import '../CSS/ContactForm.css'; // Archivo CSS para los estilos adicionales
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';

const ContactForm = () => {
  const [formData, setFormData] = useState({
    email: '',
    message: '',
    type: 'sugerencia' // valor predeterminado
  });

  const [messages, setMessages] = useState([]);
  const username = 'Gerardo Domingo';

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newMessage = {
      type: formData.type.toUpperCase(),
      text: formData.message,
      email: formData.email
    };
    setMessages([...messages, { username, ...newMessage }]);
    setFormData({
      email: '',
      message: '',
      type: 'sugerencia'
    });
  };

  const handleDeleteMessage = (index) => {
    setMessages(messages.filter((_, i) => i !== index));
  };

  return (
    <section className="section" style={styles.section}>
      <div className="container">
        <div className="columns is-variable is-8">
          <div className="column is-half">
            <div className="box has-background-dark">
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
                      className="input has-background-dark has-text-white" 
                      type="email" 
                      name="email" 
                      value={formData.email} 
                      onChange={handleChange} 
                      required 
                      placeholder="e.g. alex@example.com"
                      style={styles.input}
                    />
                    <span className="icon is-small is-left">
                      <FontAwesomeIcon icon={faEnvelope} />
                    </span>
                  </div>
                </div>
                <div className="field">
                  <label className="label has-text-white">Mensaje</label>
                  <div className="control">
                    <textarea 
                      className="textarea has-background-dark has-text-white" 
                      name="message" 
                      value={formData.message} 
                      onChange={handleChange} 
                      required 
                      placeholder="Escribe tu mensaje aquí"
                      style={styles.textarea}
                    />
                  </div>
                </div>
                <div className="field">
                  <div className="control">
                    <button className="button is-primary" type="submit" style={styles.btnenviar}>
                      Enviar
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
          <div className="column is-half">
            <div className="box has-background-dark">
              <div className="has-text-centered">
                <FontAwesomeIcon icon={faEnvelope} size="2x" color="white" />
              </div>
              <div className="messages" style={styles.messages}>
              {messages.map((message, index) => (
             <div key={index} className="message-box">
             <p className="has-text-info">{message.username}</p>
            <div className="box has-background-dark">
           <p className="has-text-white">{message.type}</p>
           <div className="message-content">
           <p className="has-text-white message-text">{message.text}</p> {/* Aplica la clase message-text aquí */}
           </div>
      <p className="has-text-grey-light">{message.email}</p>
    </div>
    <button 
      className="button is-danger is-small" 
      onClick={() => handleDeleteMessage(index)}>
      Eliminar
    </button>
  </div>
))}

              </div>
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
  messages: {
    maxHeight: '400px',
    overflowY: 'auto',
    padding: '10px',
  },
  btnenviar:{
    backgroundColor: ' #48C78E'
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
};

export default ContactForm;
