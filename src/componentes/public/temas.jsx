import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../CSS/style_temas.css'; // Asegúrate de importar tu archivo CSS

const Temas = () => {
  const [cursos, setCursos] = useState([]);
  const [cursoActivo, setCursoActivo] = useState(null);

  useEffect(() => {
    const obtenerCursos = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/cursos');
        const cursosConTemas = response.data.filter(curso => curso.temas && curso.temas.length > 0);
        const cursosAleatorios = cursosConTemas.sort(() => 0.5 - Math.random()).slice(0, 12);
        setCursos(cursosAleatorios);
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
    <div className="temas-container">
      <h1 className="temas-header">Cursos Disponibles</h1>
      <div className="temas-grid">
        {cursos.map((curso, index) => (
          <div key={curso._id} className="temas-card-container">
            <div
              className="temas-card"
              style={{ '--card-index': index, border: cursoActivo === curso._id ? '1px solid #4CAF50' : '1px solid #333' }}
              onMouseEnter={() => mostrarModal(curso._id)}
              onMouseLeave={ocultarModal}
            >
              <h2 className="temas-card-title">{curso.nombre}</h2>
            </div>
            {cursoActivo === curso._id && (
              <div className="temas-modal" style={{ border: '1px solid #4CAF50' }}>
                <div className="temas-modal-content">
                  <p><strong>Temas aprender:</strong></p>
                  <ul className="temas-list">
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

export default Temas;
