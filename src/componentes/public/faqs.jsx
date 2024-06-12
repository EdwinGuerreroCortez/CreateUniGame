import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bulma/css/bulma.min.css';

const FAQ = () => {
  const [faqs, setFaqs] = useState([]);
  const [activeIndex, setActiveIndex] = useState(null);

  useEffect(() => {
    const fetchFaqs = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/contact/messages/questions');
        setFaqs(response.data);
      } catch (error) {
        console.error('Error al obtener las FAQs:', error);
      }
    };

    fetchFaqs();
  }, []);

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div style={{ backgroundColor: '#14161A', display: 'flex', justifyContent: 'center' }}>
      <div style={styles.container}>
        <h1 style={styles.header}>Preguntas Frecuentes</h1>
        {faqs.map((faq, index) => (
          <div key={faq._id} style={styles.faqItem}>
            <div style={styles.question} onClick={() => toggleFAQ(index)}>
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
    color: 'white',
    width: '90%'
  },
  header: {
    fontSize: '28px',
    color: 'white',
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
