import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Temas = () => {
  const [cursos, setCursos] = useState([]);
  const [cursoActivo, setCursoActivo] = useState(null);

  useEffect(() => {
    const obtenerCursos = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/cursos');
        setCursos(response.data);
      } catch (error) {
        console.error('Error al obtener los cursos', error);
      }
    };

    obtenerCursos();
  }, []);

  const mostrarModal = (id) => {
    setCursoActivo(id);
  };

  const ocultarModal = () => {
    setCursoActivo(null);
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>Cursos Disponibles</h1>
      <div style={styles.grid}>
        {cursos.map((curso) => (
          <div
            key={curso._id}
            style={{ ...styles.card, border: cursoActivo === curso._id ? '2px solid #4CAF50' : '1px solid #333' }}
            onMouseEnter={() => mostrarModal(curso._id)}
            onMouseLeave={ocultarModal}
          >
            <h2 style={styles.title}>{curso.nombre}</h2>
            {cursoActivo === curso._id && (
              <div style={{ ...styles.modal, border: '2px solid #4CAF50' }}>
                <div style={styles.modalContent}>
                  <p><strong>Temas:</strong></p>
                  <ul style={styles.list}>
                    {curso.temas.map((tema, index) => (
                      <li key={index}>{tema.titulo}</li>
                    ))}
                  </ul>
                </div>
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
    margin: '0 auto',
    backgroundColor: '#14161A',
    padding: '20px',
    paddingInline: '10%',
  },
  header: {
    fontSize: '28px',
    color: 'white',
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
    borderRadius: '5px',
    padding: '10px',
    cursor: 'pointer',
    position: 'relative',
    overflow: 'visible',
    transition: 'border-color 0.3s',
  },
  title: {
    fontWeight: 'bold',
    color: 'white',
    marginBottom: '12px',
  },
  modal: {
    position: 'absolute',
    width: '100%',
    backgroundColor: '#2c2f33',
    padding: '20px',
    borderRadius: '5px',
    boxShadow: '0 4px 8px rgba(0,0,0,0.5)',
    zIndex: 1000,
    marginTop: '10px',
    transition: 'opacity 0.3s',
  },
  modalContent: {
    color: 'white',
  },
  list: {
    listStyleType: 'disc',
    marginLeft: '20px',
  },
};

export default Temas;
