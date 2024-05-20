// src/componentes/administrativo/MisionForm.js

import React, { useState } from 'react';
import 'bulma/css/bulma.min.css';
import '../CSS/adminForms.css'; // Archivo CSS adicional para estilos específicos

const MisionForm = () => {
  const [mision, setMision] = useState('');
  const [misiones, setMisiones] = useState([]);

  const handleAgregarMision = () => {
    if (mision.trim()) {
      setMisiones([...misiones, mision]);
      setMision('');
    }
  };

  const handleEliminarMision = (index) => {
    setMisiones(misiones.filter((_, i) => i !== index));
  };

  return (
    <div className="container">
      <h1 className="title has-text-centered">Administrar Misión</h1>
      <div className="box" style={{ backgroundColor: '#1F1F1F', borderRadius: '10px' }}>
        <div className="columns is-multiline">
          <div className="column is-half">
            <div className="field">
              <label className="label">Misión</label>
              <div className="control">
                <textarea
                  className="textarea"
                  value={mision}
                  onChange={(e) => setMision(e.target.value)}
                  placeholder="Escribe la misión"
                  required
                />
              </div>
            </div>
            <div className="field is-grouped">
              <div className="control">
                <button className="button is-success" onClick={handleAgregarMision}>
                  Agregar Misión
                </button>
              </div>
            </div>
          </div>
          <div className="column is-half">
            <h2 className="title is-4">Lista de Misiones</h2>
            <ul>
              {misiones.map((m, index) => (
                <li key={index} className="box" style={{ backgroundColor: '#2C2F33', marginBottom: '1rem' }}>
                  <p>{m}</p>
                  <button className="button is-danger is-small" onClick={() => handleEliminarMision(index)}>
                    Eliminar
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MisionForm;
