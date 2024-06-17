import React, { useState } from 'react';
import '../CSS/subirtemaForm.css';
import 'bulma/css/bulma.min.css';

const SubirTema = () => {
  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [responsable, setResponsable] = useState('');
  const [bibliografia, setBibliografia] = useState('');
  const [pasos, setPasos] = useState([{ Titulo: '', Descripcion: '' }]);
  const [video, setVideo] = useState('');
  const [evaluacionId, setEvaluacionId] = useState(null);
  const [alert, setAlert] = useState({ type: '', message: '' });

  const [paginaActual, setPaginaActual] = useState(0);
  const pasosPorPagina = 2; 

  const handleInputChange = (index, field, value) => {
    const newPasos = [...pasos];
    newPasos[index][field] = value;
    setPasos(newPasos);
  };

  const handleAgregarPaso = () => {
    setPasos([...pasos, { Titulo: '', Descripcion: '' }]);
  };

  const handleEliminarPaso = (index) => {
    const newPasos = [...pasos];
    newPasos.splice(index, 1);
    setPasos(newPasos);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const tema = { 
      titulo, 
      descripcion, 
      responsable, 
      bibliografia, 
      pasos,
      video: video || null,
      evaluacion_id: evaluacionId || null,
    };
  
    try {
      const response = await fetch('http://localhost:3001/api/subirTemaManual', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(tema),
      });
  
      if (!response.ok) {
        throw new Error('Error al crear el tema manualmente. Código de estado: ' + response.status);
      }
  
      const data = await response.json();
  
      if (data.error) {
        setAlert({ type: 'error', message: data.error });
      } else {
        setAlert({ type: 'success', message: 'Tema creado con éxito.' });
        setTitulo('');
        setDescripcion('');
        setResponsable('');
        setBibliografia('');
        setPasos([{ Titulo: '', Descripcion: '' }]);
        setVideo('');
        setEvaluacionId(null);
      }
    } catch (error) {
      console.error('Error creando el tema manualmente:', error);
      setAlert({ type: 'error', message: 'Error creando el tema manualmente. Inténtalo de nuevo.' });
    }
  };

  const startIndex = paginaActual * pasosPorPagina;
  const endIndex = startIndex + pasosPorPagina;

  return (
    <div className="full-screen-container">
      <div className="container">
        <div className="box">
          <h1 className="title has-text-centered has-text-white">Subir Tema</h1>

          {alert.message && (
            <div className={`notification ${alert.type === 'success' ? 'is-success' : 'is-danger'}`}>
              <button className="delete" onClick={() => setAlert({ type: '', message: '' })}></button>
              {alert.message}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="field">
              <label className="label has-text-white">Título</label>
              <div className="control">
                <input
                  className="input"
                  type="text"
                  value={titulo}
                  onChange={(e) => setTitulo(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="field">
              <label className="label has-text-white">Descripción</label>
              <div className="control">
                <textarea
                  className="textarea"
                  value={descripcion}
                  onChange={(e) => setDescripcion(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="field">
              <label className="label has-text-white">Responsable</label>
              <div className="control">
                <input
                  className="input"
                  type="text"
                  value={responsable}
                  onChange={(e) => setResponsable(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="field">
              <label className="label has-text-white">Bibliografía</label>
              <div className="control">
                <input
                  className="input"
                  type="text"
                  value={bibliografia}
                  onChange={(e) => setBibliografia(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="field">
              <label className="label has-text-white">Link del Video</label>
              <div className="control">
                <input
                  className="input"
                  type="text"
                  value={video}
                  onChange={(e) => setVideo(e.target.value)}
                />
              </div>
            </div>

            <div className="field">
              <label className="label has-text-white">Pasos</label>
              {pasos.slice(startIndex, endIndex).map((paso, index) => (
                <div key={index} className="box" style={{ backgroundColor: '#272727', marginBottom: '10px', padding: '10px' }}>
                  <div className="field">
                    <label className="label has-text-white">Título del Paso {startIndex + index + 1}</label>
                    <div className="control">
                      <input
                        className="input"
                        type="text"
                        value={paso.Titulo}
                        onChange={(e) => handleInputChange(startIndex + index, 'Titulo', e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="field">
                    <label className="label has-text-white">Descripción del Paso {startIndex + index + 1}</label>
                    <div className="control">
                      <textarea
                        className="textarea"
                        value={paso.Descripcion}
                        onChange={(e) => handleInputChange(startIndex + index, 'Descripcion', e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="control">
                    <button
                      type="button"
                      className="button is-danger"
                      onClick={() => handleEliminarPaso(startIndex + index)}
                    >
                      Eliminar Paso
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="control">
              <button type="button" className="button is-link" onClick={handleAgregarPaso}>
                Agregar Paso
              </button>
            </div>

            <div className="pagination is-centered">
              <button
                className="pagination-previous button is-link"
                onClick={() => setPaginaActual(paginaActual - 1)}
                disabled={paginaActual === 0}
              >
                Anterior
              </button>
              <button
                className="pagination-next button is-link"
                onClick={() => setPaginaActual(paginaActual + 1)}
                disabled={endIndex >= pasos.length}
              >
                Siguiente
              </button>
            </div>

            <div className="control">
              <button type="submit" className="button is-primary">Subir Tema</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SubirTema;
