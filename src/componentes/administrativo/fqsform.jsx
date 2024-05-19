// src/componentes/administrativo/FAQsForm.js

import React, { useState } from 'react';
import 'bulma/css/bulma.min.css';
import '../CSS/adminForms.css'; // Archivo CSS adicional para estilos específicos

const FAQsForm = () => {
  const [pregunta, setPregunta] = useState('');
  const [respuesta, setRespuesta] = useState('');
  const [faqs, setFaqs] = useState([]);

  const handleAgregarFAQ = () => {
    setFaqs([...faqs, { pregunta, respuesta }]);
    setPregunta('');
    setRespuesta('');
  };

  const handleEliminarFAQ = (index) => {
    setFaqs(faqs.filter((_, i) => i !== index));
  };

  return (
    <div className="container">
      <h1 className="title has-text-centered">Administrar Preguntas Frecuentes</h1>
      <div className="box">
        <div className="field">
          <label className="label">Pregunta</label>
          <div className="control">
            <input
              className="input"
              type="text"
              value={pregunta}
              onChange={(e) => setPregunta(e.target.value)}
              placeholder="Escribe la pregunta"
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
        <hr />
        <h2 className="title is-4">Lista de Preguntas Frecuentes</h2>
        <ul>
          {faqs.map((faq, index) => (
            <li key={index} className="box">
              <strong>{faq.pregunta}</strong>
              <p>{faq.respuesta}</p>
              <button className="button is-danger" onClick={() => handleEliminarFAQ(index)}>
                Eliminar
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default FAQsForm;
