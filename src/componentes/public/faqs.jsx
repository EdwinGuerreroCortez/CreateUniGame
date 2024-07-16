import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bulma/css/bulma.min.css';

const FAQ = () => {
  const [faqs, setFaqs] = useState([]);
  const [activeIndex, setActiveIndex] = useState(null);
  const [hoveredIndex, setHoveredIndex] = useState(null);

  useEffect(() => {
    const fetchFaqs = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/contact/messages/questions');
        // Filtrar las FAQs para mostrar solo las que tienen respuesta
        const faqsWithAnswer = response.data.filter(faq => faq.respuesta);
        // Seleccionar 10 preguntas aleatorias
        const faqsAleatorias = faqsWithAnswer.sort(() => 0.5 - Math.random()).slice(0, 10);
        setFaqs(faqsAleatorias);
      } catch (error) {
        console.error('Error al obtener las FAQs:', error);
      }
    };

    fetchFaqs();
  }, []);

  useEffect(() => {
    let timer;
    if (activeIndex !== null && hoveredIndex !== activeIndex) {
      timer = setTimeout(() => {
        setActiveIndex(null);
      }, 3000);
    }
    return () => clearTimeout(timer);
  }, [activeIndex, hoveredIndex]);

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div style={{ backgroundColor: '#14161A', display: 'flex', justifyContent: 'center' }}>
      <div style={styles.container}>
        <h1 style={styles.header}>
          <span style={styles.title}>Preguntas Frecuentes</span>
        </h1>
        {faqs.map((faq, index) => (
          <div key={faq._id} style={styles.faqItem}>
            <div
              style={{
                ...styles.question,
                backgroundColor: hoveredIndex === index ? '#2c2f33' : 'transparent',
              }}
              onClick={() => toggleFAQ(index)}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              {activeIndex === index ? '▼' : '▶'} {faq.mensaje}
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

const styles = {
  container: {
    backgroundColor: '#14161A',
    padding: '20px',
    borderRadius: '8px',
    maxWidth: '800px',
    margin: '20px auto',
    marginTop:'20px',
    color: 'white',
    width: '90%',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)'
  },
  header: {
    fontSize: '32px',
    color: 'white',
    textAlign: 'center',
    margin: '20px 0',
    position: 'relative',
    fontWeight: 'bold',
  },
  title: {
    textShadow: '0 0 1px white',
    position: 'relative'
  },
  faqItem: {
    marginBottom: '15px',
    padding: '15px',
    borderBottom: '1px solid grey',
    borderRadius: '8px',
    backgroundColor: '#2c2f33',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  },
  question: {
    fontWeight: 'bold',
    cursor: 'pointer',
    fontSize: '18px',
    transition: 'background-color 0.3s',
    padding: '10px',
    borderRadius: '8px'
  },
  answer: {
    marginTop: '10px',
    fontSize: '16px',
    lineHeight: '1.5',
    padding: '10px',
    borderRadius: '8px',
    backgroundColor: '#3a3d41'
  }
};

export default FAQ;
