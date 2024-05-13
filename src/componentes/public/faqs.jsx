import React, { useState } from 'react';

// Datos de las preguntas frecuentes
const faqs = [
    {
      pregunta: "▶ ¿Cómo comienzo a desarrollar juegos?",
      respuesta: "Puedes comenzar aprendiendo los fundamentos de Unity y C#, que son esenciales para la creación de juegos modernos."
    },
    {
      pregunta: "▶ ¿Qué herramientas necesito para crear un juego?",
      respuesta: "Necesitarás un entorno de desarrollo como Unity, conocimientos en C# y recursos gráficos y de audio para tu juego."
    },
    {
      pregunta: "▶ ¿Es necesario tener conocimientos previos de programación?",
      respuesta: "No es estrictamente necesario, pero tener una base en programación puede acelerar tu aprendizaje significativamente."
    },
    {
      pregunta: "▶ ¿Qué tipo de juegos puedo crear con el curso?",
      respuesta: "Desde juegos 2D simples hasta complejas experiencias 3D, dependiendo de tu curva de aprendizaje y creatividad."
    },
    {
      pregunta: "▶ ¿Cómo puedo monetizar los juegos que desarrolle?",
      respuesta: "Puedes monetizar tus juegos mediante ventas directas, suscripciones, publicidad in-game o compras dentro de la aplicación."
    },
    {
      pregunta: "▶ ¿Dónde puedo encontrar recursos gráficos y de audio para mis juegos?",
      respuesta: "Existen múltiples bibliotecas en línea donde puedes comprar o descargar gratuitamente recursos gráficos y de audio, como Unity Asset Store, OpenGameArt, o incluso sitios como Freesound para efectos de sonido."
    },
    {
      pregunta: "▶ ¿Unity es adecuado para desarrolladores principiantes?",
      respuesta: "Sí, Unity es muy amigable para los principiantes debido a su extensa documentación, una gran comunidad, y numerosos recursos de aprendizaje disponibles en línea."
    },
    {
      pregunta: "▶ ¿Cuánto tiempo toma aprender Unity y desarrollar mi primer juego?",
      respuesta: "El tiempo varía según tus conocimientos previos y el alcance del juego, pero muchos estudiantes pueden crear un juego simple en unos pocos meses de aprendizaje dedicado."
    },
    {
      pregunta: "▶ ¿Unity ofrece soporte para la publicación de juegos en diferentes plataformas?",
      respuesta: "Sí, Unity te permite construir juegos para múltiples plataformas como Windows, MacOS, iOS, Android y consolas de juegos, todo desde un único proyecto."
    },
    {
      pregunta: "▶ ¿Cómo puedo recibir feedback sobre mi juego en desarrollo?",
      respuesta: "Puedes participar en comunidades en línea como Reddit, Discord y foros de Unity, o incluso lanzar una versión beta de tu juego para recibir comentarios de los usuarios."
    },
    {
      pregunta: "▶ ¿Existen restricciones de licencia para los juegos desarrollados en Unity?",
      respuesta: "Unity tiene diferentes licencias dependiendo del tamaño de tus ingresos o financiación, pero puedes empezar completamente gratis con Unity Personal si tu empresa gana menos de $100,000 al año."
    }
  ];
  

const FAQ = () => {
  const [activeIndex, setActiveIndex] = useState(null); // Controla qué FAQ está expandido

  const toggleFAQ = index => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div style={{ backgroundColor: '#14161A', display: 'flex', justifyContent: 'center'  }}>
    <div style={styles.container}>
      <h1 style={styles.header}>Preguntas Frecuentes</h1>
      {faqs.map((faq, index) => (
        <div key={index} style={styles.faqItem}>
          <div style={styles.question} onClick={() => toggleFAQ(index)}>
            {faq.pregunta}
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
  container: {
    backgroundColor: '#14161A',
    padding: '20px',
    borderRadius: '8px',
    maxWidth: '800px',
    margin: '20px auto',
    color: 'white'
  },
  header: {
    fontSize: '28px', // Tamaño de fuente aumentado
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
