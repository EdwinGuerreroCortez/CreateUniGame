import React from 'react';
import logo1 from '../img/icono_ap.png'
import logo2 from '../img/icono_con.png'
import logo3 from '../img/icono_herra.png'

const caracteristicas = [
  {
    id: 1,
    icono: logo1, 
    titulo: "Aprendizaje personalizado",
    descripcion: "Los estudiantes practican a su propio ritmo; primero para llenar las lagunas en su comprensión y luego acelerar su aprendizaje."
  },
  {
    id: 2,
    icono: logo2, 
    titulo: "Contenido de confianza",
    descripcion: "Creado por expertos, la biblioteca de ejercicios y lecciones de Khan Academy cubre matemáticas, ciencias y más. Y siempre es gratis para estudiantes y maestros."
  },
  {
    id: 3,
    icono: logo3, 
    titulo: "Herramientas para empoderar a los maestros",
    descripcion: "Con Khan Academy los maestros pueden identificar las lagunas en comprensión de sus estudiantes, crear una clase a la medida y satisfacer las necesidades de cada uno."
  }
];

const Extra = () => {
  return (
    <div style={styles.container}>
      <h1 style={styles.header}>¿Por qué funciona Khan Academy?</h1>
      <div style={styles.grid}>
        {caracteristicas.map((item) => (
          <div key={item.id} style={styles.card}>
            <img src={item.icono} alt={`Icono de ${item.titulo}`} style={styles.icono} />
            <h2 style={styles.titulo}>{item.titulo}</h2>
            <p style={styles.descripcion}>{item.descripcion}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '20px',
    backgroundColor: '#14161A' // Color de fondo actualizado
  },
  header: {
    fontSize: '28px', // Tamaño de fuente aumentado
    color: 'white', // Color de texto para mejorar la legibilidad sobre fondo oscuro
    textAlign: 'center',
    margin: '20px 0'
  },
  grid: {
    display: 'flex',
    justifyContent: 'space-around',
    width: '100%'
  },
  card: {
    width: '30%',
    padding: '20px',
    textAlign: 'center',
    backgroundColor: '#e8e8e8',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    borderRadius: '8px',
    margin: '10px'
  },
  icono: {
    width: '80px',
    height: '80px',
    marginBottom: '10px'
  },
  titulo: {
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#333'
  },
  descripcion: {
    fontSize: '16px',
    color: '#666'
  }
};

export default Extra;
