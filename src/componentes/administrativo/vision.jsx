// src/componentes/administrativo/VisionForm.js

import React, { useState } from 'react';
import 'bulma/css/bulma.min.css';
import '../CSS/adminForms.css'; // Archivo CSS adicional para estilos específicos

const VisionForm = () => {
  const [vision, setVision] = useState('');
  const [visiones, setVisiones] = useState([]);

  const handleAgregarVision = () => {
    setVisiones([...visiones, vision]);
    setVision('');
  };

  const handleEliminarVision = (index) => {
    setVisiones(visiones.filter((_, i) => i !== index));
  };

  return (
    <div className="container">
      <h1 className="title has-text-centered">Administrar Visión</h1>
      <div className="box">
        <div className="field">
          <label className="label">Visión</label>
          <div className="control">
            <textarea
              className="textarea"
              value={vision}
              onChange={(e) => setVision(e.target.value)}
              placeholder="Escribe la visión"
            />
          </div>
        </div>
        <div className="field is-grouped">
          <div className="control">
            <button className="button is-success" onClick={handleAgregarVision}>
              Agregar Visión
            </button>
          </div>
        </div>
        <hr />
        <h2 className="title is-4">Lista de Visiones</h2>
        <ul>
          {visiones.map((v, index) => (
            <li key={index} className="box">
              <p>{v}</p>
              <button className="button is-danger" onClick={() => handleEliminarVision(index)}>
                Eliminar
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default VisionForm;
