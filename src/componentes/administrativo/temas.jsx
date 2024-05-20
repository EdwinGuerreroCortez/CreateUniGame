// src/componentes/administrativo/TemaForm.js

import React, { useState } from 'react';
import 'bulma/css/bulma.min.css';
import '../CSS/adminForms.css'; // Archivo CSS adicional para estilos específicos

const TemaForm = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    titulo: '',
    autor: '',
    fecha: '',
    descripcion: '',
    pasos: '',
    video: ''
  });

  const [temas, setTemas] = useState([]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleNextStep = () => {
    setStep(step + 1);
  };

  const handlePrevStep = () => {
    setStep(step - 1);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setTemas([...temas, formData]);
    setFormData({
      titulo: '',
      autor: '',
      fecha: '',
      descripcion: '',
      pasos: '',
      video: ''
    });
    setStep(1);
    console.log('Form data submitted:', formData);
  };

  const handleEliminarTema = (index) => {
    setTemas(temas.filter((_, i) => i !== index));
  };

  return (
    <div className="container">
      <h1 className="title has-text-centered">Administrar Temas</h1>
      <div className="box" style={{ backgroundColor: '#1F1F1F', borderRadius: '10px' }}>
        {step === 1 && (
          <div>
            <div className="field">
              <label className="label">Título</label>
              <div className="control">
                <input className="input" type="text" name="titulo" value={formData.titulo} onChange={handleChange} placeholder="Título" required />
              </div>
            </div>
            <div className="field">
              <label className="label">Autor</label>
              <div className="control">
                <input className="input" type="text" name="autor" value={formData.autor} onChange={handleChange} placeholder="Autor" required />
              </div>
            </div>
            <div className="field">
              <label className="label">Fecha</label>
              <div className="control">
                <input className="input" type="date" name="fecha" value={formData.fecha} onChange={handleChange} placeholder="Fecha" required />
              </div>
            </div>
            <div className="field">
              <label className="label">Descripción</label>
              <div className="control">
                <textarea className="textarea" name="descripcion" value={formData.descripcion} onChange={handleChange} placeholder="Descripción" required></textarea>
              </div>
            </div>
            <div className="field is-grouped is-grouped-right">
              <div className="control">
                <button className="button is-primary" onClick={handleNextStep}>Siguiente</button>
              </div>
            </div>
          </div>
        )}
        {step === 2 && (
          <div>
            <h1 className="title has-text-centered">Pasos a seguir</h1>
            <div className="field">
              <label className="label">Pasos</label>
              <div className="control">
                <textarea className="textarea" name="pasos" value={formData.pasos} onChange={handleChange} placeholder="Escribe los pasos" required></textarea>
              </div>
            </div>
            <div className="field is-grouped is-grouped-right">
              <div className="control">
                <button className="button is-light" onClick={handlePrevStep}>Anterior</button>
              </div>
              <div className="control">
                <button className="button is-primary" onClick={handleNextStep}>Siguiente</button>
              </div>
            </div>
          </div>
        )}
        {step === 3 && (
          <div>
            <h1 className="title has-text-centered">Video</h1>
            <div className="field">
              <label className="label">URL del Video</label>
              <div className="control">
                <input className="input" type="url" name="video" value={formData.video} onChange={handleChange} placeholder="URL del video" required />
              </div>
            </div>
            <div className="field is-grouped is-grouped-right">
              <div className="control">
                <button className="button is-light" onClick={handlePrevStep}>Anterior</button>
              </div>
              <div className="control">
                <button className="button is-success" onClick={handleSubmit}>Insertar</button>
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="box">
        <h2 className="title is-4 has-text-centered">Lista de Temas</h2>
        <table className="table is-fullwidth is-striped is-hoverable">
          <thead>
            <tr>
              <th>Título</th>
              <th>Autor</th>
              <th>Fecha</th>
              <th>Descripción</th>
              <th>Pasos</th>
              <th>Video</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {temas.map((tema, index) => (
              <tr key={index}>
                <td>{tema.titulo}</td>
                <td>{tema.autor}</td>
                <td>{tema.fecha}</td>
                <td>{tema.descripcion}</td>
                <td>{tema.pasos}</td>
                <td><a href={tema.video} target="_blank" rel="noopener noreferrer">Ver Video</a></td>
                <td>
                  <button className="button is-danger is-small" onClick={() => handleEliminarTema(index)}>Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TemaForm;
