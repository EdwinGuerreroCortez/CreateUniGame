import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bulma/css/bulma.min.css';
import '../CSS/adminForms.css'; // Archivo CSS adicional para estilos específicos

const FAQsForm = () => {
  const [respuesta, setRespuesta] = useState('');
  const [faqs, setFaqs] = useState([]);
  const [unansweredFaqs, setUnansweredFaqs] = useState([]);
  const [selectedFaq, setSelectedFaq] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const fetchFaqs = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/faqs');
        setFaqs(response.data);
        setUnansweredFaqs(response.data.filter(faq => !faq.respuesta));
      } catch (error) {
        console.error('Error al obtener las FAQs:', error);
      }
    };

    fetchFaqs();
  }, []);

  const handleSeleccionarPregunta = (e) => {
    const faqId = e.target.value;
    setSelectedFaq(faqId);
    const faq = faqs.find(faq => faq._id === faqId);
    if (faq) {
      setRespuesta(faq.respuesta || '');
    }
  };

  const handleResponderFAQ = async () => {
    if (selectedFaq && respuesta) {
      try {
        const response = await axios.put(`http://localhost:3001/api/faqs/${selectedFaq}`, { respuesta });
        const updatedFaqs = faqs.map(faq => faq._id === selectedFaq ? response.data : faq);
        setFaqs(updatedFaqs);
        setUnansweredFaqs(unansweredFaqs.filter(faq => faq._id !== selectedFaq));
        setSelectedFaq('');
        setRespuesta('');
        setSuccessMessage('Respuesta agregada exitosamente.');
        setErrorMessage('');
        setTimeout(() => {
          setSuccessMessage('');
        }, 3000); // Ocultar alerta después de 3 segundos
      } catch (error) {
        setErrorMessage('Error al agregar la respuesta.');
        setSuccessMessage('');
        setTimeout(() => {
          setErrorMessage('');
        }, 3000); // Ocultar alerta después de 3 segundos
      }
    } else {
      setErrorMessage('Por favor, seleccione una pregunta y complete la respuesta.');
      setSuccessMessage('');
      setTimeout(() => {
        setErrorMessage('');
      }, 3000); // Ocultar alerta después de 3 segundos
    }
  };

  const handleEliminarFAQ = async (id) => {
    try {
      await axios.delete(`http://localhost:3001/api/faqs/${id}`);
      setFaqs(faqs.filter(faq => faq._id !== id));
      setSuccessMessage('FAQ eliminada exitosamente.');
      setErrorMessage('');
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000); // Ocultar alerta después de 3 segundos
    } catch (error) {
      setErrorMessage('Error al eliminar la FAQ.');
      setSuccessMessage('');
      setTimeout(() => {
        setErrorMessage('');
      }, 3000); // Ocultar alerta después de 3 segundos
    }
  };

  return (
    <div style={{ backgroundColor: '#14161A', minHeight: '100vh', padding: '20px' }}>
      <div className="container">
        <h1 className="title has-text-centered has-text-white">Administrar Preguntas Frecuentes</h1>
        
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

        <div className="box" style={{ backgroundColor: '#1F1F1F', borderRadius: '10px' }}>
          <div className="columns is-multiline">
            <div className="column is-half">
              <h2 className="title is-4 has-text-centered has-text-white">Responder Preguntas Frecuentes</h2>
              <div className="field">
                <label className="label has-text-white">Seleccionar Pregunta Sin Responder</label>
                <div className="control">
                  <div className="select is-fullwidth">
                    <select value={selectedFaq} onChange={handleSeleccionarPregunta}>
                      <option value="">Selecciona una pregunta</option>
                      {unansweredFaqs.map(faq => (
                        <option key={faq._id} value={faq._id}>
                          {faq.pregunta}
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
                    value={respuesta}
                    onChange={(e) => setRespuesta(e.target.value)}
                    placeholder="Escribe la respuesta"
                    required
                  />
                </div>
              </div>
              <div className="field is-grouped">
                <div className="control">
                  <button className="button is-success" onClick={handleResponderFAQ}>
                    Responder Pregunta
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
                  {faqs.map((faq) => (
                    <tr key={faq._id} style={{ backgroundColor: '#2C2F33' }}>
                      <td className="has-text-white">{faq.pregunta}</td>
                      <td className="has-text-white">{faq.respuesta}</td>
                      <td>
                        <button className="button is-danger is-small" onClick={() => handleEliminarFAQ(faq._id)}>
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
