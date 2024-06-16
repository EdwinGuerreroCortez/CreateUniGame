import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom'; // Importar Link desde React Router
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
  const [modalOpen, setModalOpen] = useState(false);
  const [nuevoPaso, setNuevoPaso] = useState({ Titulo: '', Descripcion: '' });
  const [descripcionTema, setDescripcionTema] = useState('');
  const [autorTema, setAutorTema] = useState('');
  const [pasosTema, setPasosTema] = useState([]);
  const [tituloTema, setTituloTema] = useState('');
  const [responsableTema, setResponsableTema] = useState('');
  const [bibliografiaTema, setBibliografiaTema] = useState('');
  const fileInputRef = useRef(null);

  if (pasosTema.length === 0) {
    setPasosTema([{ Titulo: '', Descripcion: '' }]);
  }

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
  //abrir y cerrar del modal
  const handleOpenModal = () => {
    setModalOpen(true);
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleVideoFileChange = (e) => {
    setVideoFile(e.target.files[0]);
  };

  //agregar pasos
  const handleAgregarPaso = () => {
    setPasosTema([...pasosTema, { Titulo: '', Descripcion: '' }]);
  };

  const handlePasoChange = (e, index, field) => {
    const newPasos = [...pasosTema];
    newPasos[index][field] = e.target.value;
    setPasosTema(newPasos);
  };
  const handleEliminarPaso = (index) => {
    const nuevosPasos = [...pasosTema];
    nuevosPasos.splice(index, 1);
    setPasosTema(nuevosPasos);
  };
  const handleModalClose = () => {
    if (tituloTema.trim() || descripcionTema.trim() || pasosTema.some(paso => paso.Titulo.trim() || paso.Descripcion.trim())) {
      if (window.confirm('¿Estás seguro de que quieres salir? Los cambios no se guardarán.')) {
        setModalOpen(false);
        setValidationErrors([]);
      }
    } else {
      setModalOpen(false);
      setValidationErrors([]);
    }
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
          setAlert({ type: 'error', message: 'Tema actualizado con éxito.' });
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
  
        <div className="box" style={{ backgroundColor: '#1F1F1F', borderRadius: '10px', marginBottom: '20px', maxWidth: '800px', margin: '0 auto' }}>
          <div className="field is-grouped is-grouped-centered">
            <div className="control">
              <button className="button is-primary" onClick={handleOpenModal}>Subir Tema</button>
            </div>
            {modalOpen && (
                <div className="modal is-active">
                  <div className="modal-background" onClick={handleModalClose}></div>
                  <div className="modal-content">
                    <div className="box" style={{ backgroundColor: '#2F2F2F', borderRadius: '10px', padding: '20px' }}>
                      <h1 className="title has-text-centered has-text-white">Nuevo Tema</h1>
                      <form onSubmit={handleSubmit}>
                        <div className="field">
                          <label className="label has-text-white">Título del Tema:</label>
                          <div className="control">
                            <input
                              type="text"
                              className="input"
                              placeholder="Ingresa el título del tema"
                              value={tituloTema}
                              onChange={(e) => setTituloTema(e.target.value)}
                              required
                            />
                          </div>
                        </div>
                        <div className="field">
                          <label className="label has-text-white">Responsable:</label>
                          <div className="control">
                            <input
                              type="text"
                              className="input"
                              placeholder="Ingresa el responsable del tema"
                              value={responsableTema}
                              onChange={(e) => setResponsableTema(e.target.value)}
                              required
                            />
                          </div>
                        </div>
                        <div className="field">
                          <label className="label has-text-white">Descripción del Tema:</label>
                          <div className="control">
                            <textarea
                              className="textarea"
                              placeholder="Ingresa la descripción del tema"
                              value={descripcionTema}
                              onChange={(e) => setDescripcionTema(e.target.value)}
                              required
                            ></textarea>
                          </div>
                        </div>
                        <div className="field">
                          <label className="label has-text-white">Pasos:</label>
                          {pasosTema.map((paso, index) => (
                            <div key={index} className="field" style={{ marginBottom: '5px' }}>
                              <div className="control is-expanded">
                                <label>Titulo del paso:</label>
                                <input
                                  type="text"
                                  className="input"
                                  placeholder={`Paso ${index + 1}`}
                                  value={paso.Titulo}
                                  onChange={(e) => handlePasoChange(e, index, 'Titulo')}
                                  required
                                />
                              </div>
                              <div className="control is-expanded">
                                <label>Descripcion del paso:</label>
                                <textarea
                                  className="textarea"
                                  placeholder={`Descripción del Paso ${index + 1}`}
                                  value={paso.Descripcion}
                                  onChange={(e) => handlePasoChange(e, index, 'Descripcion')}
                                  required
                                />
                              </div>
                              {index === pasosTema.length - 1 && (
                                <div className="control">
                                  <label>Agregar nuevo paso: </label>
                                  <button
                                    type="button"
                                    className={`button is-info is-small ${pasosTema[index].Titulo === '' || pasosTema[index].Descripcion === '' ? 'is-disabled' : ''}`}
                                    onClick={handleAgregarPaso}
                                    disabled={pasosTema[index].Titulo === '' || pasosTema[index].Descripcion === ''}
                                  >
                                    +
                                  </button>
                                </div>
                              )}
                              {index !== pasosTema.length && (
                                <div className="control">
                                  <label>Eliminar paso: </label>
                                  <button
                                    type="button"
                                    className="button is-danger is-small"
                                    onClick={() => {
                                      if (window.confirm('¿Estás seguro de que quieres eliminar este paso?')) {
                                        handleEliminarPaso(index);
                                      }
                                    }}
                                  >
                                    -
                                  </button>
                                </div>
                              )}
                            </div>
                          ))}
                          <div className="field">
                            <label className="label has-text-white">Bibliografía:</label>
                            <div className="control">
                              <textarea
                                className="textarea"
                                placeholder="Ingresa la bibliografía del tema"
                                value={bibliografiaTema}
                                onChange={(e) => setBibliografiaTema(e.target.value)}
                                required
                              ></textarea>
                            </div>
                          </div>
                        </div>
                        <div className="field">
                          <label className="label has-text-white">Archivo de Video:</label>
                          <div className="control">
                            <input
                              type="file"
                              className="input"
                              onChange={handleVideoFileChange}
                              accept=".mp4,.webm,.ogg"
                              required
                            />
                          </div>
                        </div>
                        <div className="field is-grouped is-grouped-centered">
                          <div className="control">
                            <button type="submit" className={`button is-primary ${isLoading ? 'is-loading' : ''}`}>
                              Subir Tema
                            </button>
                            <button type="button" className="button" onClick={handleModalClose} style={{ marginLeft: '10px' }}>
                              Cancelar
                            </button>
                          </div>
                        </div>
                      </form>
                  </div>
                </div>
                <button className="modal-close is-large" aria-label="close" onClick={handleModalClose}></button>
              </div>
            )}

            <div className="control">
              <button className="button is-info" onClick={handleDownloadPlantilla}>Descargar Plantilla</button>
            </div>
            <div className="control">
              <button className="button is-primary" onClick={() => fileInputRef.current.click()}>Subir Temas en Formato Excel</button>
              <input
                type="file"
                ref={fileInputRef}
                style={{ display: 'none' }}
                onChange={handleFileChange}
                accept=".xlsx,.xls"
              />
            </div>
            <div className="control">
              <Link to="/admin/temas/contenidos" className="button is-primary">Ver Temas</Link>
            </div>
          </div>
        </div>
        <hr className="hr" style={{ backgroundColor: '#fff' }} />
      </div>
    </div>
  );
  



};
export default TemaForm;


