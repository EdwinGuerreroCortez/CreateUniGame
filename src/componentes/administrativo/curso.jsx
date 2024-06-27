import React, { useState } from 'react';
import "bulma/css/bulma.min.css";

const CrearCurso = () => {
  const [nombreCurso, setNombreCurso] = useState('');

  const handleNombreCursoChange = (event) => {
    setNombreCurso(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // Aquí puedes manejar la lógica para enviar el nombre del curso
    console.log('Nombre del curso:', nombreCurso);
    // Puedes hacer la llamada a API o el almacenamiento necesario aquí
    // Resetear el estado del formulario después de enviar
    setNombreCurso('');
  };

  return (
    <div className="section" style={{ minHeight: '100vh', backgroundColor: '#14161A' }}>
      <div className="container">
        <div className="columns is-centered">
          <div className="column is-full-mobile is-half-tablet is-one-third-desktop">
            <div className="box" style={{ padding: '2rem', boxShadow: '0px 0px 10px 0px rgba(0, 255, 0, 0.5)', borderColor: 'green', borderWidth: '2px', borderStyle: 'solid', backgroundColor: '#021929' }}>
              <h1 className="title has-text-white has-text-centered">Crear Nuevo Curso</h1>
              <form onSubmit={handleSubmit}>
                <div className="field">
                  <label className="label has-text-white">Nombre del Curso:</label>
                  <div className="control">
                    <input
                      className="input"
                      type="text"
                      placeholder="Ingrese el nombre del curso"
                      value={nombreCurso}
                      onChange={handleNombreCursoChange}
                      required
                    />
                  </div>
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
