import React, { useState } from 'react';
import '../CSS/subirtemaForm.css';
import 'bulma/css/bulma.min.css';

const SubirTema = () => {
  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [responsable, setResponsable] = useState('');
  const [bibliografia, setBibliografia] = useState('');
  const [pasos, setPasos] = useState([{ Titulo: '', Descripcion: '' }]);
  const [videoFile, setVideoFile] = useState(null);
  const [alert, setAlert] = useState({ type: '', message: '' });
  const [isLoading, setIsLoading] = useState(false);  // Estado para manejar el círculo de carga
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

  const handleFileChange = (e) => {
    setVideoFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validaciones
    if (!titulo || !descripcion || !responsable || !bibliografia || !videoFile || pasos.some(p => !p.Titulo || !p.Descripcion)) {
      setAlert({ type: 'error', message: 'Por favor, completa todos los campos y sube un video.' });
      return;
    }

    setIsLoading(true);  // Comienza el estado de carga
    const formData = new FormData();
    formData.append('titulo', titulo);
    formData.append('descripcion', descripcion);
    formData.append('responsable', responsable);
    formData.append('bibliografia', bibliografia);
    formData.append('video', videoFile);
    formData.append('pasos', JSON.stringify(pasos));

    try {
      const response = await fetch('http://localhost:3001/api/subirTema', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Error al crear el tema. Código de estado: ' + response.status);
      }

      const data = await response.json();
      if (data.error) {
        setAlert({ type: 'error', message: data.error });
      } else {
        setAlert({ type: 'success', message: 'Tema creado con éxito.' });
        // Restablecer el formulario
        setTitulo('');
        setDescripcion('');
        setResponsable('');
        setBibliografia('');
        setPasos([{ Titulo: '', Descripcion: '' }]);
        setVideoFile(null);
      }
    } catch (error) {
      console.error('Error creando el tema:', error);
      setAlert({ type: 'error', message: 'Error creando el tema. Inténtalo de nuevo.' });
    } finally {
      setIsLoading(false);  // Termina el estado de carga
    }
  };

  const startIndex = paginaActual * pasosPorPagina;
  const endIndex = startIndex + pasosPorPagina;

  return (
    <div className="full-screen-container">
      {isLoading && (
        <div className="loading-overlay">
          <div className="loading-circle"></div>
        </div>
      )}
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
              <label className="label has-text-white">Cargar Video</label>
              <div className="file has-name is-fullwidth">
                <label className="file-label">
                  <input
                    className="file-input"
                    type="file"
                    accept="video/*"
                    onChange={handleFileChange}
                    required
                  />
                  <span className="file-cta">
                    <span className="file-icon">
                      <i className="fas fa-upload"></i>
                    </span>
                    <span className="file-label">
                      Escoge un archivo…
                    </span>
                  </span>
                  {videoFile && (
                    <span className="file-name">
                      {videoFile.name}
                    </span>
                  )}
                </label>
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
            <br />

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
