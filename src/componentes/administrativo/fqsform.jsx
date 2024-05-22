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
                <label className="label has-text-white">Pregunta</label>
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
                <label className="label has-text-white">Respuesta</label>
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
              <h2 className="title is-4 has-text-centered has-text-white">Lista de Preguntas Frecuentes</h2>
              <table className="table is-fullwidth is-striped is-hoverable">
                <thead>
                  <tr>
                    <th className="has-text-white">Pregunta</th>
                    <th className="has-text-white">Respuesta</th>
                    <th className="has-text-white">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {faqs.map((faq, index) => (
                    <tr key={index} style={{ backgroundColor: '#2C2F33' }}>
                      <td className="has-text-white">{faq.pregunta}</td>
                      <td className="has-text-white">{faq.respuesta}</td>
                      <td>
                        <button className="button is-danger is-small" onClick={() => handleEliminarFAQ(index)}>
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQsForm;
