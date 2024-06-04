import React, { useState, useEffect } from 'react';
import 'bulma/css/bulma.min.css';
import '../CSS/adminForms2.css'; // Archivo CSS adicional para estilos específicos

const TemaForm = () => {
  const [file, setFile] = useState(null);
  const [videoFile, setVideoFile] = useState(null);
  const [temas, setTemas] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [alert, setAlert] = useState({ type: '', message: '' });

  useEffect(() => {
    fetch('http://localhost:3001/api/temas') // Asegúrate de apuntar a la URL correcta
      .then((response) => response.json())
      .then((data) => setTemas(data))
      .catch((error) => console.error('Error fetching temas:', error));
  }, []);

  useEffect(() => {
    if (alert.message) {
      const timer = setTimeout(() => {
        setAlert({ type: '', message: '' });
      }, 5000); // Desaparece después de 5 segundos

      return () => clearTimeout(timer);
    }
  }, [alert]);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleVideoFileChange = (e) => {
    setVideoFile(e.target.files[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (file && videoFile) {
      setIsLoading(true);
      setAlert({ type: '', message: '' });

      const formData = new FormData();
      formData.append('file', file);
      formData.append('video', videoFile);

      fetch('http://localhost:3001/api/upload-excel-video', { // Asegúrate de apuntar a la URL correcta
        method: 'POST',
        body: formData,
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.error) {
            setAlert({ type: 'error', message: data.details.join(', ') });
            setIsLoading(false);
          } else {
            console.log('Archivo y video subidos con éxito:', data);
            setTemas([...temas, data]); // Agrega el nuevo tema a la lista
            setIsLoading(false);
            setAlert({ type: 'success', message: 'Archivo y video subidos y procesados con éxito.' });
          }
        })
        .catch((error) => {
          console.error('Error subiendo el archivo y video:', error);
          setIsLoading(false);
          setAlert({ type: 'error', message: 'Error subiendo el archivo y video. Inténtalo de nuevo.' });
        });
    }
  };

  const handleEliminarTema = (id) => {
    fetch(`http://localhost:3001/api/temas/${id}`, { 
      method: 'DELETE',
    })
      .then(() => {
        setTemas(temas.filter((tema) => tema._id !== id));
        setAlert({ type: 'success', message: 'Tema eliminado con éxito.' });
      })
      .catch((error) => {
        console.error('Error eliminando el tema:', error);
        setAlert({ type: 'error', message: 'Error eliminando el tema. Inténtalo de nuevo.' });
      });
  };

  const handleCloseAlert = () => {
    setAlert({ type: '', message: '' });
  };

  const handleDownloadTema = (id) => {
    fetch(`http://localhost:3001/api/download-tema/${id}`)
      .then((response) => response.blob())
      .then((blob) => {
        const url = window.URL.createObjectURL(new Blob([blob]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `${id}.xlsx`);
        document.body.appendChild(link);
        link.click();
        link.parentNode.removeChild(link);
      })
      .catch((error) => {
        console.error('Error descargando el archivo Excel:', error);
        setAlert({ type: 'error', message: 'Error descargando el archivo Excel. Inténtalo de nuevo.' });
      });
  };

  return (
    <div style={{ backgroundColor: '#14161A', minHeight: '100vh', padding: '20px' }}>
      <div className="container">
        <h1 className="title has-text-centered has-text-white">Administrar Temas</h1>
        
        {alert.message && (
          <div className={`notification ${alert.type === 'success' ? 'is-success' : 'is-danger'}`}>
            <button className="delete" onClick={handleCloseAlert}></button>
            {alert.message}
          </div>
        )}

        <div className="box" style={{ backgroundColor: '#1F1F1F', borderRadius: '10px' }}>
          <div className="field">
            <label className="label has-text-white">Subir Archivo Excel</label>
            <div className="file is-primary has-name">
              <label className="file-label">
                <input className="file-input" type="file" accept=".xlsx, .xls" onChange={handleFileChange} />
                <span className="file-cta">
                  <span className="file-icon">
                    <i className="fas fa-upload"></i>
                  </span>
                  <span className="file-label">
                    Elige un archivo...
                  </span>
                </span>
                {file && (
                  <span className="file-name">
                    {file.name}
                  </span>
                )}
              </label>
            </div>
          </div>
          <div className="field">
            <label className="label has-text-white">Subir Video</label>
            <div className="file is-primary has-name">
              <label className="file-label">
                <input className="file-input" type="file" accept="video/*" onChange={handleVideoFileChange} />
                <span className="file-cta">
                  <span className="file-icon">
                    <i className="fas fa-upload"></i>
                  </span>
                  <span className="file-label">
                    Elige un video...
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
          <div className="field is-grouped is-grouped-right">
            <div className="control">
              <button className="button is-success" onClick={handleSubmit} disabled={isLoading}>
                {isLoading ? 'Cargando...' : 'Subir y Procesar'}
              </button>
            </div>
          </div>
        </div>
        
        {isLoading && (
          <div className="has-text-centered">
            <button className="button is-loading is-large is-info">Cargando</button>
          </div>
        )}
        
        <div className="box" style={{ backgroundColor: '#090A0C' }}>
          <h2 className="title is-4 has-text-centered has-text-white">Lista de Temas</h2>
          <table className="table is-fullwidth is-striped is-hoverable">
            <thead>
              <tr>
                <th className="has-text-white">Título</th>
                <th className="has-text-white">Autor</th>
                <th className="has-text-white">Fecha</th>
                <th className="has-text-white">Descripción</th>
                <th className="has-text-white">Pasos</th>
                <th className="has-text-white">Video</th>
                <th className="has-text-white">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {temas && temas.length > 0 ? (
                temas.map((tema) => (
                  <tr key={tema._id}>
                    <td className="has-text-white">{tema.titulo}</td>
                    <td className="has-text-white">{tema.autor}</td>
                    <td className="has-text-white">{new Date(tema.fecha_creacion).toLocaleDateString()}</td>
                    <td className="has-text-white">{tema.descripcion}</td>
                    <td className="has-text-white">{tema.pasos && tema.pasos.length > 0 ? (
                      tema.pasos.map((paso, index) => (
                        <div key={index}>{paso.Descripcion}</div>
                      ))
                    ) : (
                      <span>No hay pasos definidos</span>
                    )}</td>
                    <td>
                      {tema.video ? (
                        <a className="has-text-link" href={tema.video} target="_blank" rel="noopener noreferrer">Ver Video</a>
                      ) : (
                        <span className="has-text-grey">No disponible</span>
                      )}
                    </td>
                    <td>
                    <div className="buttons are-small">
                        <button className="button is-danger" onClick={() => handleEliminarTema(tema._id)}>Eliminar</button>
                        <button className="button is-info" onClick={() => handleDownloadTema(tema._id)}>Descargar Excel</button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="has-text-white" colSpan="7">No hay temas disponibles.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TemaForm;

