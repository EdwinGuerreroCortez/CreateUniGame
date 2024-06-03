import React, { useState } from 'react';
import '../CSS/buzon.css'; // Archivo CSS para estilos personalizados

const Buzon = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const username = 'Gerardo Domingo';

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      setMessages([...messages, { username, text: newMessage }]);
      setNewMessage('');
    }
  };

  const handleDeleteMessage = (index) => {
    setMessages(messages.filter((_, i) => i !== index));
  };

  return (
    <div className="buzon-container">
      <h1 className="title is-2 has-text-white has-text-centered">Buzón</h1>
      <div className="messages">
        {messages.map((message, index) => (
          <div
            key={index}
            className="message-wrapper"
            style={{ alignSelf: message.username === username ? 'flex-end' : 'flex-start' }}
          >
            <p className="username">{message.username}</p>
            <div className="message-card">
              <p className="message-text">{message.text}</p>
            </div>
            {message.username === username && (
              <button className="delete-button" onClick={() => handleDeleteMessage(index)}>
                Eliminar
              </button>
            )}
          </div>
        ))}
      </div>
      <div className="message-input-container">
        <input
          className="input message-input"
          type="text"
          placeholder="Escribe tu mensaje..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <button className="send-button" onClick={handleSendMessage}>
          Enviar
        </button>
      </div>
    </div>
  );
};

export default Buzon;
