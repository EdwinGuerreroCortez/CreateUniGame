import React, { useState } from 'react';

const temasIniciales = [
    { id: 1, titulo: "Introducción a Unity", contenido: "Aprende a navegar por el entorno de desarrollo de Unity, configurar proyectos y entender la interfaz de usuario básica." },
    { id: 2, titulo: "Fundamentos de C# para Unity", contenido: "Explora los conceptos básicos de programación en C#, incluyendo sintaxis, control de flujo, y estructuras de datos esenciales para el desarrollo de juegos." },
    { id: 3, titulo: "Trabajando con Assets", contenido: "Descubre cómo importar y administrar assets como texturas, modelos 3D y sonidos dentro del editor de Unity." },
    { id: 4, titulo: "Scripting de Personajes", contenido: "Aprende a crear scripts que controlen las acciones y comportamientos de los personajes en tus juegos." },
    { id: 5, titulo: "Físicas y Colisiones", contenido: "Implementa físicas realistas y gestiona colisiones y interacciones entre objetos en el juego utilizando el motor de físicas de Unity." },
    { id: 6, titulo: "Desarrollo de la Interfaz de Usuario (UI)", contenido: "Diseña y desarrolla interfaces de usuario interactivas, incluyendo menús, barras de salud, y más." },
    { id: 7, titulo: "Sistemas de Partículas y Efectos Visuales", contenido: "Crea efectos visuales impresionantes usando el sistema de partículas de Unity para añadir realismo y dinamismo a tus juegos." },
    { id: 8, titulo: "Iluminación y Renderizado", contenido: "Mejora la atmósfera y el estilo visual de tus juegos ajustando la iluminación y las técnicas de renderizado en Unity." },
    { id: 9, titulo: "Animación de Personajes", contenido: "Utiliza herramientas de Unity para animar personajes y objetos, aprendiendo sobre animaciones basadas en esqueletos y estados de animación." },
    { id: 10, titulo: "Sonido y Música", contenido: "Integra audio en tus juegos de manera efectiva, incluyendo efectos de sonido ambientales y bandas sonoras." },
    { id: 11, titulo: "Inteligencia Artificial (IA)", contenido: "Implementa comportamientos básicos de IA para que los NPC (personajes no jugables) puedan tomar decisiones y interactuar con el jugador." },
    { id: 12, titulo: "Optimización del Juego", contenido: "Aprende técnicas para mejorar el rendimiento de tus juegos, optimizando recursos y asegurando una experiencia fluida en diversas plataformas." },
    { id: 13, titulo: "Construcción y Publicación", contenido: "Conoce los pasos necesarios para construir tu juego para diferentes plataformas y los requisitos para su publicación." },
    { id: 14, titulo: "Realidad Virtual y Aumentada", contenido: "Explora cómo desarrollar juegos en Realidad Virtual y Aumentada utilizando Unity y sus SDKs específicos." },
    { id: 15, titulo: "Trabajando con Redes y Multijugador", contenido: "Desarrolla juegos multijugador aprendiendo sobre la sincronización de estados entre varios jugadores y gestión de la red." }
  ];
  const Temas = () => {
    const [temaActivo, setTemaActivo] = useState(null);
  
    const mostrarModal = id => {
      setTemaActivo(id);
    };
  
    const ocultarModal = () => {
      setTemaActivo(null);
    };
  
    return (
      <div style={{ backgroundColor: '#14161A' }}>
      <div style={styles.container}>
        <h1 style={styles.header}>Temas a Aprender</h1>
        <div style={styles.grid}>
          {temasIniciales.map(tema => (
            <div key={tema.id} style={styles.card} 
                 onMouseEnter={() => mostrarModal(tema.id)}
                 onMouseLeave={ocultarModal}>
              <h2 style={styles.title}>{tema.titulo}</h2>
              {temaActivo === tema.id && (
                <div style={styles.modal}>
                  <div style={styles.modalContent}>
                    <h2>{tema.titulo}</h2>
                    <p>{tema.contenido}</p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      </div>
    );
  };
  
  const styles = {
    container: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '20px',
      backgroundColor: '#14161A',
    },
    header: {
        fontSize: '28px', // Tamaño de fuente aumentado
        color: 'white', // Color de texto para mejorar la legibilidad sobre fondo oscuro
        textAlign: 'center',
        margin: '20px 0'
      },
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
      gap: '15px',
    },
    card: {
      backgroundColor: '#1e2025',
      border: '1px solid #333',
      borderRadius: '5px',
      padding: '10px',
      cursor: 'pointer',
      position: 'relative',
    },
    title: {
      fontWeight: 'bold',
      color: 'white',
      marginBottom: '10px',
    },
    modal: {
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: '90%',
      backgroundColor: '#2c2f33',
      padding: '20px',
      borderRadius: '5px',
      boxShadow: '0 4px 8px rgba(0,0,0,0.5)',
      zIndex: 1000,
    },
    modalContent: {
      color: 'white',
    }
  };
  
  export default Temas;