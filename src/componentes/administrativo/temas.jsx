import React, { useState, useEffect } from 'react';
import 'bulma/css/bulma.min.css';
import '../CSS/adminForms2.css'; // Archivo CSS adicional para estilos específicos

const TemaForm = () => {
  const [file, setFile] = useState(null);
  const [videoFile, setVideoFile] = useState(null);
  const [temas, setTemas] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [alert, setAlert] = useState({ type: '', message: '' });
  const [editMode, setEditMode] = useState(false);
  const [editTema, setEditTema] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [validationErrors, setValidationErrors] = useState([]);

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

  const handleDownloadPlantilla = () => {
    fetch(`http://localhost:3001/api/download-plantilla`)
      .then((response) => response.blob())
      .then((blob) => {
        const url = window.URL.createObjectURL(new Blob([blob]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'Plantilla_tema.xlsx');
        document.body.appendChild(link);
        link.click();
        link.parentNode.removeChild(link);
      })
      .catch((error) => {
        console.error('Error descargando la plantilla:', error);
        setAlert({ type: 'error', message: 'Error descargando la plantilla. Inténtalo de nuevo.' });
      });
  };

  const handleEdit = (tema) => {
    setEditMode(true);
    setEditTema(tema);
    setCurrentPage(1); // Reset page to 1 when editing a new tema
  };

  const handleModalClose = () => {
    setEditMode(false);
    setEditTema(null);
    setValidationErrors([]);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const getCurrentPageItems = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return editTema.pasos.slice(startIndex, endIndex);
  };

  const totalPages = Math.ceil(editTema ? editTema.pasos.length / itemsPerPage : 1);

  const handleSaveEdit = () => {
    const { titulo, descripcion, autor, pasos } = editTema;

    const errors = [];
    pasos.forEach((paso, index) => {
      if (!paso.Titulo.trim()) {
        errors.push(`El título del paso ${index + 1} está vacío.`);
      }
      if (!paso.Descripcion.trim()) {
        errors.push(`La descripción del paso ${index + 1} está vacía.`);
      }
    });

    if (errors.length > 0) {
      setValidationErrors(errors);
      return;
    }

    const updatedTema = {
      titulo: titulo.trim(),
      descripcion: descripcion.trim(),
      autor: autor.trim(),
      pasos: JSON.stringify(pasos.map(p => ({
        Titulo: p.Titulo.trim(),
        Descripcion: p.Descripcion.trim()
      })))
    };

    fetch(`http://localhost:3001/api/temas/${editTema._id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updatedTema)
    })
      .then(response => response.json())
      .then(data => {
        if (data.error) {
          setAlert({ type: 'error', message: data.details.join(', ') });
        } else {
          setTemas(temas.map(t => (t._id === data._id ? data : t)));
          setAlert({ type: 'success', message: 'Tema actualizado con éxito.' });
          setValidationErrors([]);
          // No cerrar el modal de edición
        }
      })
      .catch(error => {
        console.error('Error actualizando el tema:', error);
        setAlert({ type: 'error', message: 'Error actualizando el tema. Inténtalo de nuevo.' });
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
              <button className="button is-info" onClick={handleDownloadPlantilla}>
                Descargar Plantilla
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
                <th className="has-text-white">Número de Pasos</th>
                <th className="has-text-white">Video</th>
                <th className="has-text-centered has-text-white">Acciones</th>
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
                    <td className="has-text-white">{tema.pasos ? tema.pasos.length : 0} pasos</td>
                    <td>
                      {tema.video ? (
                        <a className="has-text-link" href={tema.video} target="_blank" rel="noopener noreferrer">Ver Video</a>
                      ) : (
                        <span className="has-text-grey">No disponible</span>
                      )}
                    </td>
                    <td className="has-text-centered has-text-white">
                      <div className="buttons is-centered">
                        <button className="button is-small is-info" onClick={() => handleEdit(tema)}>Editar</button>
                        <button className="button is-small is-danger" onClick={() => handleEliminarTema(tema._id)}>Eliminar</button>
                        <button className="button is-small is-warning" onClick={() => handleDownloadTema(tema._id)}>Descargar Excel</button>
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

        {editMode && editTema && (
          <div className={`modal ${editMode ? 'is-active' : ''}`}>
            <div className="modal-background"></div>
            <div className="modal-card">
              <header className="modal-card-head">
                <p className="modal-card-title">Editar Tema</p>
                <button className="delete" aria-label="close" onClick={handleModalClose}></button>
              </header>
              <section className="modal-card-body">
                {alert.message && (
                  <div className={`notification ${alert.type === 'success' ? 'is-success' : 'is-danger'}`}>
                    <button className="delete" onClick={() => setAlert({ type: '', message: '' })}></button>
                    {alert.message}
                  </div>
                )}
                {validationErrors.length > 0 && (
                  <div className="notification is-danger">
                    <button className="delete" onClick={() => setValidationErrors([])}></button>
                    {validationErrors.map((error, index) => (
                      <p key={index}>{error}</p>
                    ))}
                  </div>
                )}
                <div className="field">
                  <label className="label">Título</label>
                  <div className="control">
                    <input
                      className="input"
                      type="text"
                      value={editTema.titulo}
                      onChange={(e) => setEditTema({ ...editTema, titulo: e.target.value })}
                    />
                  </div>
                </div>
                <div className="field">
                  <label className="label">Descripción</label>
                  <div className="control">
                    <input
                      className="input"
                      type="text"
                      value={editTema.descripcion}
                      onChange={(e) => setEditTema({ ...editTema, descripcion: e.target.value })}
                    />
                  </div>
                </div>
                <div className="field">
                  <label className="label">Autor</label>
                  <div className="control">
                    <input
                      className="input"
                      type="text"
                      value={editTema.autor}
                      onChange={(e) => setEditTema({ ...editTema, autor: e.target.value })}
                    />
                  </div>
                </div>
                {getCurrentPageItems().map((paso, index) => (
                  <div key={index} className="box" style={{ marginBottom: '1rem' }}>
                    <div className="field">
                      <label className="label">Paso {index + 1 + (currentPage - 1) * itemsPerPage}</label>
                      <div className="control">
                        <input
                          className="input"
                          type="text"
                          value={paso.Titulo}
                          onChange={(e) => {
                            const newPasos = [...editTema.pasos];
                            newPasos[index + (currentPage - 1) * itemsPerPage].Titulo = e.target.value;
                            setEditTema({ ...editTema, pasos: newPasos });
                          }}
                        />
                      </div>
                    </div>
                    <div className="field">
                      <label className="label">Descripción</label>
                      <div className="control">
                        <input
                          className="input"
                          type="text"
                          value={paso.Descripcion}
                          onChange={(e) => {
                            const newPasos = [...editTema.pasos];
                            newPasos[index + (currentPage - 1) * itemsPerPage].Descripcion = e.target.value;
                            setEditTema({ ...editTema, pasos: newPasos });
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
                <nav className="pagination is-centered" role="navigation" aria-label="pagination">
                  <button
                    className="pagination-previous"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    Anterior
                  </button>
                  <button
                    className="pagination-next"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    Siguiente
                  </button>
                  <ul className="pagination-list">
                    {Array.from({ length: totalPages }, (_, i) => (
                      <li key={i}>
                        <button
                          className={`pagination-link ${currentPage === i + 1 ? 'is-current' : ''}`}
                          onClick={() => handlePageChange(i + 1)}
                        >
                          {i + 1}
                        </button>
                      </li>
                    ))}
                  </ul>
                </nav>
              </section>
              <footer className="modal-card-foot">
                <button className="button is-success" onClick={handleSaveEdit}>Guardar</button>
                <button className="button" onClick={handleModalClose}>Cancelar</button>
              </footer>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TemaForm;
