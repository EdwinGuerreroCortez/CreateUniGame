import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "bulma/css/bulma.min.css";
import "../CSS/adminForms.css";

const CrearCursoDocente = () => {
  const [nombreCurso, setNombreCurso] = useState('');
  const [cursos, setCursos] = useState([]);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [usuarioId, setUsuarioId] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const storedUserId = localStorage.getItem('userId');
    if (storedUserId) {
      setUsuarioId(storedUserId);
    } else {
      setError('No se encontró el ID del usuario en la sesión.');
    }

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

    setIsLoading(true);
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
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ backgroundColor: "#14161A", minHeight: "100vh", padding: "20px" }}>
      <div className="container">
        <h1 className="title has-text-centered has-text-white">Crear Nuevo Curso</h1>
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
        <div className="box" style={{ backgroundColor: "#1F1F1F", borderRadius: "10px", marginBottom: "20px" }}>
          <h2 className="subtitle has-text-centered has-text-white">Crear Nuevo Curso</h2>
          <form onSubmit={handleSubmit}>
            <div className="field">
              <label className="label has-text-white">Nombre del Curso</label>
              <div className="control">
                <input
                  className="input"
                  type="text"
                  value={nombreCurso}
                  onChange={handleNombreCursoChange}
                  required
                  placeholder="Ingrese el nombre del curso"
                />
              </div>
              {error && <p className="help is-danger">{error}</p>}
            </div>
            <div className="field is-grouped is-grouped-right">
              <div className="control">
                <button type="submit" className={`button is-success ${isLoading ? "is-loading" : ""}`}>
                  Crear Curso
                </button>
              </div>
            </div>
          </form>
        </div>
        <div className="box" style={{ backgroundColor: "#1F1F1F", borderRadius: "10px" }}>
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
