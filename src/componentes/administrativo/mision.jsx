import React, { useState } from 'react';
import 'bulma/css/bulma.min.css';
import '../CSS/adminForms.css'; // Archivo CSS adicional para estilos específicos

const MisionVisionForm = () => {
  const [mision, setMision] = useState('');
  const [misiones, setMisiones] = useState([]);
  const [vision, setVision] = useState('');
  const [visiones, setVisiones] = useState([]);

  const handleAgregar = () => {
    if (mision.trim() && vision.trim()) {
      setMisiones([...misiones, mision]);
      setVisiones([...visiones, vision]);
      setMision('');
      setVision('');
    }
  };

  const handleEliminarMision = (index) => {
    setMisiones(misiones.filter((_, i) => i !== index));
  };

  const handleEliminarVision = (index) => {
    setVisiones(visiones.filter((_, i) => i !== index));
  };

  return (
    <div style={{ backgroundColor: '#14161A', minHeight: '100vh', padding: '20px' }}>
      <div className="container">
        <h1 className="title has-text-centered has-text-white">Administrar Misión y Visión</h1>
        <div className="box" style={{ backgroundColor: '#1F1F1F', borderRadius: '10px' }}>
          <div className="columns is-multiline">
            <div className="column is-half">
              <div className="field">
                <label className="label has-text-white">Misión</label>
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
            </div>
            <div className="column is-half">
              <div className="field">
                <label className="label has-text-white">Visión</label>
                <div className="control">
                  <textarea
                    className="textarea"
                    value={vision}
                    onChange={(e) => setVision(e.target.value)}
                    placeholder="Escribe la visión"
                    required
                  />
                </div>
              </div>
            </div>
            <div className="column is-full">
              <div className="field is-grouped is-grouped-centered">
                <div className="control">
                  <button className="button is-success" onClick={handleAgregar}>
                    Agregar Misión y Visión
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="columns is-multiline">
            <div className="column is-half">
              <h2 className="title is-4 has-text-centered has-text-white">Lista de Misiones</h2>
              <table className="table is-fullwidth is-striped is-hoverable">
                <thead>
                  <tr>
                    <th className="has-text-white">Misión</th>
                    <th className="has-text-white">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {misiones.map((m, index) => (
                    <tr key={index} style={{ backgroundColor: '#2C2F33' }}>
                      <td className="has-text-white">{m}</td>
                      <td>
                        <button className="button is-danger is-small" onClick={() => handleEliminarMision(index)}>
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="column is-half">
              <h2 className="title is-4 has-text-centered has-text-white">Lista de Visiones</h2>
              <table className="table is-fullwidth is-striped is-hoverable">
                <thead>
                  <tr>
                    <th className="has-text-white">Visión</th>
                    <th className="has-text-white">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {visiones.map((v, index) => (
                    <tr key={index} style={{ backgroundColor: '#2C2F33' }}>
                      <td className="has-text-white">{v}</td>
                      <td>
                        <button className="button is-danger is-small" onClick={() => handleEliminarVision(index)}>
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MisionVisionForm;
