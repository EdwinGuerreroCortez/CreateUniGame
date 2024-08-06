import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bulma/css/bulma.min.css';
import '../CSS/adminForms.css'; // Archivo CSS adicional para estilos específicos

const Buzon = () => {
  const [messages, setMessages] = useState([]);
  const [selectedMessage, setSelectedMessage] = useState('');
  const [response, setResponse] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [tab, setTab] = useState('preguntas');
  const [latestMessage, setLatestMessage] = useState(null);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await axios.get('http://172.16.19.1:3001/api/contact/messages');
        const sortedMessages = response.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setMessages(sortedMessages);
        setLatestMessage(sortedMessages[0] || null); // Actualizar el último mensaje
      } catch (error) {
        console.error('Error al obtener los mensajes:', error);
      }
    };

    fetchMessages();
  }, []);

  const handleSelectMessage = (messageId) => {
    setSelectedMessage(messageId);
    const message = messages.find(message => message._id === messageId);
    if (message) {
      setResponse(message.respuesta || '');
    }
  };

  useEffect(() => {
    if (latestMessage) {
      const timer = setTimeout(() => {
        setLatestMessage(null);
      }, 10000); // Cambiar a 8 segundos

      return () => clearTimeout(timer); // Cleanup the timer if the component unmounts or latestMessage changes
    }
  }, [latestMessage]);

  const handleRespondMessage = async () => {
    if (selectedMessage && response) {
      try {
        const res = await axios.put(`http://172.16.19.1:3001/api/contact/messages/questions/${selectedMessage}`, { respuesta: response });
        const updatedMessages = messages.map(message => message._id === selectedMessage ? res.data : message);
        setMessages(updatedMessages);
        setSelectedMessage('');
        setResponse('');
        setSuccessMessage('Respuesta enviada con éxito.');
        setErrorMessage('');
        setTimeout(() => {
          setSuccessMessage('');
        }, 5000); // Ocultar alerta después de 4 segundos
      } catch (error) {
        console.error('Error al enviar la respuesta:', error);
        setErrorMessage('Error al enviar la respuesta.');
        setSuccessMessage('');
        setTimeout(() => {
          setErrorMessage('');
        }, 5000); // Ocultar alerta después de 4 segundos
      }
    } else {
      setErrorMessage('Por favor, seleccione un mensaje y complete la respuesta.');
      setSuccessMessage('');
      setTimeout(() => {
        setErrorMessage('');
      }, 5000); // Ocultar alerta después de 4 segundos
    }
  };

  const handleEliminarMessage = async (id) => {
    try {
      await axios.delete(`http://172.16.19.1:3001/api/contact/messages/${id}`);
      const updatedMessages = messages.filter(message => message._id !== id);
      setMessages(updatedMessages);
      setLatestMessage(updatedMessages[0] || null); // Actualizar el último mensaje
      setSuccessMessage('Mensaje eliminado exitosamente.');
      setErrorMessage('');
      setTimeout(() => {
        setSuccessMessage('');
      }, 5000); // Ocultar alerta después de 4 segundos
    } catch (error) {
      setErrorMessage('Error al eliminar el mensaje.');
      setSuccessMessage('');
      setTimeout(() => {
        setErrorMessage('');
      }, 5000); // Ocultar alerta después de 4 segundos
    }
  };

  const filteredMessages = messages.filter(message => {
    switch (tab) {
      case 'preguntas':
        return message.tipoMensaje === 'Pregunta';
      case 'quejas':
        return message.tipoMensaje === 'Queja';
      case 'sugerencias':
        return message.tipoMensaje === 'Sugerencia';
      default:
        return true;
    }
  });

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div style={{ backgroundColor: '#14161A', minHeight: '100vh', padding: '20px' }}>
      <div className="container" style={{ maxWidth: '1450px', margin: '0 auto' }}> {/* Aumenta el tamaño del contenedor */}
        <h1 className="title has-text-centered has-text-white">Buzón de Contacto</h1>

        {successMessage && (
          <div className="notification is-success">
            <button className="delete" onClick={() => setSuccessMessage('')}></button>
            {successMessage}
          </div>
        )}

        {errorMessage && (
          <div className="notification is-danger">
            <button className="delete" onClick={() => setErrorMessage('')}></button>
            {errorMessage}
          </div>
        )}

        <div className="tabs is-boxed is-centered">
          <ul>
            <li className={tab === 'preguntas' ? 'is-active' : ''} onClick={() => setTab('preguntas')}>
              <a>Preguntas</a>
            </li>
            <li className={tab === 'quejas' ? 'is-active' : ''} onClick={() => setTab('quejas')}>
              <a>Quejas</a>
            </li>
            <li className={tab === 'sugerencias' ? 'is-active' : ''} onClick={() => setTab('sugerencias')}>
              <a>Sugerencias</a>
            </li>
          </ul>
        </div>

        <div className="box" style={{ backgroundColor: '#1F1F1F', borderRadius: '20px' }}>
          {latestMessage && (
            <div className="message is-info" style={{ display: 'flex', alignItems: 'center', fontSize: '0.9em', padding: '0.5em' }}>
              <div className="message-header" style={{ borderTopLeftRadius: '20px', borderBottomLeftRadius: '20px', padding: '0.5em 1em' }}>
                <p className="is-size-6">Último mensaje:</p>
              </div>
              <div className="message-body" style={{ flex: '1', borderTopRightRadius: '20px', borderBottomRightRadius: '20px', padding: '0.5em 1em' }}>
                <p className="is-size-6">
                  <strong>Correo: {latestMessage.correo}</strong>, Tipo: {latestMessage.tipoMensaje}, Mensaje: {latestMessage.mensaje} Fecha: {formatDate(latestMessage.createdAt)}
                </p>
              </div>
            </div>
          )}

          <div className="column is-half">
            {tab === 'preguntas' && (
              <div className="columns">
                <div className="column is-half is-full-mobile" style={{ width: '100%' }}>
                  <h2 className="title is-4 has-text-centered has-text-white">Responder Mensajes de Contacto</h2>
                  <div className="field">
                    <label className="label has-text-white">Seleccionar Mensaje</label>
                    <div className="control">
                      <div className="select is-fullwidth">
                        <select value={selectedMessage} onChange={(e) => handleSelectMessage(e.target.value)}>
                          <option value="">Selecciona un mensaje</option>
                          {filteredMessages.map(message => (
                            <option key={message._id} value={message._id}>
                              {message.correo} - {message.mensaje}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                  <div className="field">
                    <label className="label has-text-white">Respuesta</label>
                    <div className="control">
                      <textarea
                        className="textarea"
                        value={response}
                        onChange={(e) => setResponse(e.target.value)}
                        placeholder="Escribe la respuesta"
                        required
                        style={{ fontSize: '1em' }} // Reducir tamaño de la fuente
                      />
                    </div>
                  </div>
                  <div className="field is-grouped">
                    <div className="control">
                      <button className="button is-success" onClick={handleRespondMessage}>
                        Responder Mensaje
                      </button>
                    </div>
                  </div>
                </div>
                <div className="column is-half is-full-mobile" style={{ width: '100%' }}>
                  <div className="table-container">
                    <table className="table is-fullwidth is-striped is-hoverable" style={{ fontSize: '1em' }}> {/* Reducir tamaño de la fuente */}
                      <thead>
                        <tr>
                          <th className="has-text-white">Correo</th>
                          <th className="has-text-white">Mensaje</th>
                          <th className="has-text-white">Respuesta</th>
                          <th className="has-text-white">Acciones</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredMessages.map(message => (
                          <tr key={message._id} style={{ backgroundColor: '#2C2F33' }}>
                            <td>{message.correo}</td>
                            <td>{message.mensaje}</td>
                            <td>
                              {message.respuesta || <span className="tag is-danger">Sin respuesta</span>} {/* Indicador para sin respuesta */}
                            </td>
                            <td>
                              <button
                                className="button is-danger"
                                onClick={() => handleEliminarMessage(message._id)}
                                data-tooltip="Eliminar Mensaje"
                              >
                                <span className="icon">
                                  <i className="fas fa-trash-alt"></i>
                                </span>
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </div>
          {(tab === 'quejas' || tab === 'sugerencias') && (
            <table className="table is-fullwidth is-striped is-hoverable" style={{ fontSize: '0.9em', width: '100%' }}> {/* Reducir tamaño de la fuente */}
              <thead>
                <tr>
                  <th className="has-text-white">Correo</th>
                  <th className="has-text-white">Mensaje</th>
                  <th className="has-text-white">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredMessages.map(message => (
                  <tr key={message._id} style={{ backgroundColor: '#2C2F33' }}>
                    <td>{message.correo}</td>
                    <td>{message.mensaje}</td>
                    <td>
                      <button
                        className="button is-danger"
                        onClick={() => handleEliminarMessage(message._id)}
                        data-tooltip="Eliminar"
                      >
                        <span className="icon">
                          <i className="fas fa-trash-alt"></i>
                        </span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default Buzon;
