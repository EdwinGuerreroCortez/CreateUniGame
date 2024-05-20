// src/componentes/administrativo/FAQsForm.js

import React, { useState } from 'react';
import 'bulma/css/bulma.min.css';
import '../CSS/adminForms.css'; // Archivo CSS adicional para estilos específicos

const FAQsForm = () => {
  const [pregunta, setPregunta] = useState('');
  const [respuesta, setRespuesta] = useState('');
  const [faqs, setFaqs] = useState([]);

  const handleAgregarFAQ = () => {
    if (pregunta && respuesta) {
      setFaqs([...faqs, { pregunta, respuesta }]);
      setPregunta('');
      setRespuesta('');
    }
  };

  const handleEliminarFAQ = (index) => {
    setFaqs(faqs.filter((_, i) => i !== index));
  };

  return (
    <div style={{ backgroundColor: '#14161A', minHeight: '100vh', padding: '20px' }}>
    <div className="container">
      <h1 className="title has-text-centered has-text-white">Administrar Preguntas Frecuentes</h1>
      <div className="box" style={{ backgroundColor: '#1F1F1F', borderRadius: '10px' }}>
        <div className="columns is-multiline">
          <div className="column is-half">
            <div className="field">
              <label className="label">Pregunta</label>
              <div className="control">
                <input
                  className="input"
                  type="text"
                  value={pregunta}
                  onChange={(e) => setPregunta(e.target.value)}
                  placeholder="Escribe la pregunta"
                  required
                />
              </div>
            </div>
            <div className="field">
              <label className="label">Respuesta</label>
              <div className="control">
                <textarea
                  className="textarea"
                  value={respuesta}
                  onChange={(e) => setRespuesta(e.target.value)}
                  placeholder="Escribe la respuesta"
                  required
                />
              </div>
            </div>
            <div className="field is-grouped">
              <div className="control">
                <button className="button is-success" onClick={handleAgregarFAQ}>
                  Agregar Pregunta Frecuente
                </button>
              </div>
            </div>
          </div>
          <div className="column is-half">
            <h2 className="title is-4 has-text-white">Lista de Preguntas Frecuentes</h2>
            <ul>
              {faqs.map((faq, index) => (
                <li key={index} className="box" style={{ backgroundColor: '#2C2F33', marginBottom: '1rem' }}>
                  <strong>{faq.pregunta}</strong>
                  <p>{faq.respuesta}</p>
                  <button className="button is-danger is-small" onClick={() => handleEliminarFAQ(index)}>
                    Eliminar
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
};

export default FAQsForm;
