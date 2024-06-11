import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bulma/css/bulma.min.css';

// Componente FAQ
const FAQ = () => {
  const [faqs, setFaqs] = useState([]);
  const [activeIndex, setActiveIndex] = useState(null); // Controla qué FAQ está expandido

  useEffect(() => {
    const fetchFaqs = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/faqs');
        const respondedFaqs = response.data.filter(faq => faq.respuesta);
        setFaqs(respondedFaqs);
      } catch (error) {
        console.error('Error al obtener las FAQs:', error);
      }
    };

    fetchFaqs();
  }, []);

  const toggleFAQ = index => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div style={{ backgroundColor: '#14161A', display: 'flex', justifyContent: 'center' }}>
      <div style={styles.container}>
        <h1 style={styles.header}>Preguntas Frecuentes</h1>
        {faqs.map((faq, index) => (
          <div key={faq._id} style={styles.faqItem}>
            <div style={styles.question} onClick={() => toggleFAQ(index)}>
              {activeIndex === index ? '▼' : '▶'} {faq.pregunta}
            </div>
            {activeIndex === index && (
              <div style={styles.answer}>
                {faq.respuesta}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

// Estilos para el componente
const styles = {
  outerContainer: {
    backgroundColor: '#14161A',
    minHeight: '100vh',
    paddingBottom: '20px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  container: {
    backgroundColor: '#14161A',
    padding: '20px',
    borderRadius: '8px',
    maxWidth: '800px',
    margin: '20px auto',
    color: 'white',
    width: '90%' // Agregado para asegurarse de que el contenedor no se expanda fuera de la pantalla
  },
  header: {
    fontSize: '28px', // Tamaño de fuente aumentado
    color: 'white', // Color de texto para mejorar la legibilidad sobre fondo oscuro
    textAlign: 'center',
    margin: '20px 0'
  },
  faqItem: {
    marginBottom: '10px',
    padding: '10px',
    borderBottom: '1px solid grey'
  },
  question: {
    fontWeight: 'bold',
    cursor: 'pointer'
  },
  answer: {
    marginTop: '5px'
  }
};

export default FAQ;
