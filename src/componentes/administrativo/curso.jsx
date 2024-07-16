import React, { useState } from 'react';
import axios from 'axios';
import "bulma/css/bulma.min.css";

const CrearCurso = () => {
  const [nombreCurso, setNombreCurso] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

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

    try {
      const response = await axios.post('http://172.16.19.1:3001/api/curso', {
        nombre: nombreCurso,
      });

      setSuccessMessage('¡Curso creado exitosamente!');
      setNombreCurso('');
      setError('');
    } catch (error) {
      console.error('Error al crear el curso:', error);
      if (error.response && error.response.data && error.response.data.message === 'El curso ya existe') {
        setError('Ya existe un curso con ese nombre.');
      } else {
        setError('Hubo un error al crear el curso. Por favor, intenta nuevamente.');
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
      </div>
    </div>
  );
};

export default CrearCurso;
