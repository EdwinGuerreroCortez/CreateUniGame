// src/componentes/administrativo/CuestionariosForm.js

import React, { useState } from 'react';
import 'bulma/css/bulma.min.css';
import '../CSS/adminForms.css'; // Archivo CSS adicional para estilos específicos

const CuestionariosForm = () => {
  const [url, setUrl] = useState('');
  const [tema, setTema] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [cuestionarios, setCuestionarios] = useState([]);
  const [editIndex, setEditIndex] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    const fecha = new Date().toLocaleString();
    if (url.trim() && tema.trim() && descripcion.trim()) {
      const nuevoCuestionario = { url, tema, descripcion, fecha };
      if (editIndex !== null) {
        const cuestionariosActualizados = [...cuestionarios];
        cuestionariosActualizados[editIndex] = nuevoCuestionario;
        setCuestionarios(cuestionariosActualizados);
        setEditIndex(null);
      } else {
        setCuestionarios([...cuestionarios, nuevoCuestionario]);
      }
      setUrl('');
      setTema('');
      setDescripcion('');
    }
  };

  const handleEditarCuestionario = (index) => {
    const cuestionarioAEditar = cuestionarios[index];
    setUrl(cuestionarioAEditar.url);
    setTema(cuestionarioAEditar.tema);
    setDescripcion(cuestionarioAEditar.descripcion);
    setEditIndex(index);
  };

  const handleEliminarCuestionario = (index) => {
    setCuestionarios(cuestionarios.filter((_, i) => i !== index));
  };

  return (
    <div className="container" style={{ backgroundColor: '#14161A', minHeight: '100vh', padding: '20px' }}>
      <div className="box" style={{ backgroundColor: '#1F1F1F', borderRadius: '10px' }}>
        <h1 className="title has-text-centered has-text-white">
          {editIndex !== null ? 'Editar Cuestionario' : 'Subir Cuestionario'}
        </h1>
        <form onSubmit={handleSubmit}>
          <div className="field">
            <label className="label has-text-white">URL de Google Form</label>
            <div className="control">
              <input
                className="input"
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://forms.gle/..."
                required
              />
            </div>
          </div>
          <div className="field">
            <label className="label has-text-white">Tema</label>
            <div className="control">
              <div className="select">
                <select value={tema} onChange={(e) => setTema(e.target.value)} required>
                  <option value="" disabled>Selecciona un tema</option>
                  <option value="Tema 1">Tema 1</option>
                  <option value="Tema 2">Tema 2</option>
                  <option value="Tema 3">Tema 3</option>
                </select>
              </div>
            </div>
          </div>
          <div className="field">
            <label className="label has-text-white">Descripción</label>
            <div className="control">
              <textarea
                className="textarea"
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                placeholder="Agrega una descripción"
                required
              ></textarea>
            </div>
          </div>
          <div className="field is-grouped is-grouped-centered">
            <div className="control">
              <button type="submit" className="button is-success">
                {editIndex !== null ? 'Guardar Cambios' : 'Subir Cuestionario'}
              </button>
            </div>
          </div>
        </form>
        {cuestionarios.length > 0 && (
          <div>
            <h2 className="title is-4 has-text-centered has-text-white">Formularios Guardados</h2>
            <div className="columns is-multiline">
              {cuestionarios.map((cuestionario, index) => (
                <div key={index} className="column is-half">
                  <div className="card" style={{ backgroundColor: '#2C2F33', borderRadius: '10px' }}>
                    <div className="card-content">
                      <h3 className="subtitle has-text-white">Formulario del Tema: {cuestionario.tema}</h3>
                      <p className="has-text-white">
                        URL del formulario: <a href={cuestionario.url} target="_blank" rel="noopener noreferrer" className="has-text-info">{cuestionario.url}</a>
                      </p>
                      <p className="has-text-white">Descripción: {cuestionario.descripcion}</p>
                      <p className="has-text-white">Última Actualización: {cuestionario.fecha}</p>
                      <div className="buttons">
                        <button
                          className="button is-primary is-small"
                          onClick={() => handleEditarCuestionario(index)}
                        >
                          {editIndex === index ? 'Cancelar Edición' : 'Editar'}
                        </button>
                        <button
                          className="button is-danger is-small"
                          onClick={() => handleEliminarCuestionario(index)}
                        >
                          Eliminar
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CuestionariosForm;
