import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "bulma/css/bulma.min.css";

const CrearCursoDocente = () => {
  const [nombreCurso, setNombreCurso] = useState('');
  const [cursos, setCursos] = useState([]);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [usuarioId, setUsuarioId] = useState('');

  useEffect(() => {
    const storedUserId = localStorage.getItem('userId');
    if (storedUserId) {
      setUsuarioId(storedUserId);
    } else {
      setError('No se encontró el ID del usuario en la sesión.');
    }

    // Fetch the list of created courses
    const fetchCursos = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/api/usuario/${storedUserId}/cursos`);
        setCursos(response.data);
      } catch (error) {
        console.error('Error al cargar los cursos:', error);
      }
    };

    fetchCursos();
  }, []);

  const handleNombreCursoChange = (event) => {
    setNombreCurso(event.target.value);
    setError('');
    setSuccessMessage('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!nombreCurso.trim()) {
      setError('El nombre del curso es requerido');
      return;
    }

    if (!usuarioId) {
      setError('No se puede crear el curso sin el ID del usuario.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:3001/api/crearCursoAsignarUsuario', {
        nombre: nombreCurso,
        usuarioId
      });

      setSuccessMessage('¡Curso creado y asignado exitosamente!');
      setCursos([...cursos, response.data]);
      setNombreCurso('');
      setError('');
    } catch (error) {
      console.error('Error al crear y asignar el curso:', error);
      if (error.response && error.response.data && error.response.data.message === 'El curso ya existe') {
        setError('Ya existe un curso con ese nombre.');
      } else {
        setError('Hubo un error al crear y asignar el curso. Por favor, intenta nuevamente.');
      }
    }
  };

  return (
    <div className="section" style={{ minHeight: '100vh', backgroundColor: '#14161A' }}>
      <div className="container">
        <div className="columns is-centered">
          <div className="column is-full-mobile is-half-tablet is-one-third-desktop">
            {error && (
              <div className="notification is-danger">
                <button className="delete" onClick={() => setError('')}></button>
                {error}
              </div>
            )}
            {successMessage && (
              <div className="notification is-success">
                <button className="delete" onClick={() => setSuccessMessage('')}></button>
                {successMessage}
              </div>
            )}
            <div className="box" style={{ padding: '2rem', boxShadow: '0px 0px 10px 0px rgba(0, 255, 0, 0.5)', borderColor: 'green', borderWidth: '2px', borderStyle: 'solid', backgroundColor: '#021929' }}>
              <h1 className="title has-text-white has-text-centered">Crear Nuevo Curso</h1>
              <form onSubmit={handleSubmit}>
                <div className="field">
                  <label className="label has-text-white">Nombre del Curso:</label>
                  <div className="control">
                    <input
                      className={`input ${error && 'is-danger'}`}
                      type="text"
                      placeholder="Ingrese el nombre del curso"
                      value={nombreCurso}
                      onChange={handleNombreCursoChange}
                      required
                    />
                  </div>
                  {error && <p className="help is-danger">{error}</p>}
                </div>
                <div className="field">
                  <div className="control has-text-centered">
                    <button
                      className="button is-dark is-medium"
                      style={{ backgroundColor: '#224df7', borderColor: 'green', borderWidth: '2px', borderStyle: 'solid' }}
                      type="submit"
                    >
                      Crear Curso
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>

        <div className="box" style={{ backgroundColor: '#1F1F1F', borderRadius: '10px', marginTop: '20px' }}>
          <h2 className="subtitle has-text-centered has-text-white">Cursos Creados</h2>
          <table className="table is-fullwidth is-striped is-hoverable">
            <thead>
              <tr>
                <th className="has-text-white">Nombre del Curso</th>
              </tr>
            </thead>
            <tbody>
              {cursos.length > 0 ? (
                cursos.map((curso) => (
                  <tr key={curso._id}>
                    <td className="has-text-white">{curso.nombre}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="has-text-white" colSpan="1">No hay cursos disponibles.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CrearCursoDocente;
