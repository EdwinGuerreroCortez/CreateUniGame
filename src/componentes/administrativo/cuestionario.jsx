import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bulma/css/bulma.min.css';
import '../CSS/adminForms.css';
import "@fortawesome/fontawesome-free/css/all.min.css";

const CuestionariosForm = () => {
  const [newFile, setNewFile] = useState(null);
  const [editFile, setEditFile] = useState(null);
  const [tema, setTema] = useState('');
  const [curso, setCurso] = useState(''); // Estado para curso seleccionado
  const [temas, setTemas] = useState([]);
  const [evaluaciones, setEvaluaciones] = useState([]);
  const [cursos, setCursos] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [alert, setAlert] = useState({ type: '', message: '' });
  const [modalAlert, setModalAlert] = useState({ type: '', message: '' });
  const [editMode, setEditMode] = useState(false);
  const [editEvaluacion, setEditEvaluacion] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);

  useEffect(() => {
    const fetchTemas = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/temas');
        const filteredTemas = response.data.filter(tema => !tema.evaluacion_id);
        setTemas(filteredTemas);
      } catch (error) {
        console.error('Error al obtener los temas:', error);
      }
    };

    const fetchEvaluaciones = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/evaluaciones');
        setEvaluaciones(response.data);
      } catch (error) {
        console.error('Error al obtener las evaluaciones:', error);
      }
    };

    const fetchCursos = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/cursos');
        const cursosMap = response.data.reduce((acc, curso) => {
          acc[curso._id] = curso.nombre;
          return acc;
        }, {});
        setCursos(cursosMap);
      } catch (error) {
        console.error('Error al obtener los cursos:', error);
      }
    };

    fetchTemas();
    fetchEvaluaciones();
    fetchCursos();
  }, []);

  const handleToggleHabilitado = async (evaluacionId, habilitado) => {
    try {
      const response = await axios.put(`http://localhost:3001/api/evaluaciones/${evaluacionId}/habilitar`, { habilitado });
      setEvaluaciones(evaluaciones.map(evaluacion => 
        evaluacion._id === evaluacionId ? { ...evaluacion, habilitado: response.data.evaluacion.habilitado } : evaluacion
      ));
      setAlert({ type: 'success', message: `Evaluación ${habilitado ? 'habilitada' : 'deshabilitada'} exitosamente` });
    } catch (error) {
      console.error('Error al actualizar evaluación:', error);
      setAlert({ type: 'error', message: 'Error al actualizar evaluación' });
    }
  };

  const handleNewFileChange = (e) => {
    setNewFile(e.target.files[0]);
  };

  const handleEditFileChange = (e) => {
    setEditFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newFile && tema.trim()) {
      setIsLoading(true);
      setAlert({ type: '', message: '' });
      const formData = new FormData();
      formData.append('file', newFile);
      formData.append('tema', tema);

      try {
        const response = await axios.post('http://localhost:3001/api/evaluaciones/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        setAlert({ type: 'success', message: 'Archivo subido exitosamente' });
        setNewFile(null);
        setTema('');
        setEvaluaciones([...evaluaciones, response.data.evaluacion]);
      } catch (error) {
        console.error('Error al subir archivo:', error);
        const errorMessage = error.response && error.response.data && Array.isArray(error.response.data.details)
          ? error.response.data.details.join(', ')
          : 'Error al subir archivo';
        setAlert({ type: 'error', message: errorMessage });
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleEdit = (evaluacion) => {
    setEditMode(true);
    setEditEvaluacion(evaluacion);
    setTema(evaluacion.tema_id._id);
  };

  const handleDelete = async (evaluacionId) => {
    try {
      await axios.delete(`http://localhost:3001/api/evaluaciones/${evaluacionId}`);
      setEvaluaciones(evaluaciones.filter(evaluacion => evaluacion._id !== evaluacionId));
      setAlert({ type: 'success', message: 'Evaluación eliminada exitosamente' });
    } catch (error) {
      console.error('Error al eliminar evaluación:', error);
      setAlert({ type: 'error', message: 'Error al eliminar evaluación' });
    }
  };

  const handleCloseAlert = () => {
    setAlert({ type: '', message: '' });
  };

  const handleModalClose = () => {
    setEditMode(false);
    setEditEvaluacion(null);
    setEditFile(null);
    setModalAlert({ type: '', message: '' });
    setCurrentPage(1);
  };

  const validateEvaluacion = () => {
    const errors = [];
    editEvaluacion.evaluacion.forEach((pregunta, index) => {
      if (!pregunta.pregunta || pregunta.pregunta.trim() === '') {
        errors.push(`La pregunta ${index + 1} está vacía`);
      }

      if (!pregunta.respuesta_correcta || pregunta.respuesta_correcta.trim() === '') {
        errors.push(`La respuesta correcta de la pregunta ${index + 1} está vacía`);
      }

      const opciones = pregunta.opciones;
      if (!opciones || opciones.length !== 4) {
        errors.push(`Número incorrecto de opciones en la pregunta ${index + 1} (debe haber 4 opciones)`);
      } else {
        opciones.forEach((opcion, oIdx) => {
          if (!opcion || opcion.trim() === '') {
            errors.push(`La opción ${String.fromCharCode(65 + oIdx)} de la pregunta ${index + 1} está vacía`);
          }
        });
        const opcionesSet = new Set(opciones.map(op => op.trim()));
        if (opcionesSet.size !== 4) {
          errors.push(`Opciones duplicadas en la pregunta ${index + 1}`);
        }
        if (!opcionesSet.has(pregunta.respuesta_correcta.trim())) {
          errors.push(`La respuesta correcta en la pregunta ${index + 1} no coincide con ninguna opción`);
        }
      }
    });
    return errors;
  };

  const handleModalSave = async () => {
    const validationErrors = validateEvaluacion();
    if (validationErrors.length > 0) {
      setModalAlert({ type: 'error', message: validationErrors.join(', ') });
      return;
    }

    setIsLoading(true);
    setModalAlert({ type: '', message: '' });

    try {
      const formData = new FormData();
      if (editFile) {
        formData.append('file', editFile);
      }
      formData.append('tema', tema);
      formData.append('evaluacion', JSON.stringify(editEvaluacion.evaluacion));

      const response = await axios.put(`http://localhost:3001/api/evaluaciones/${editEvaluacion._id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      const updatedEvaluaciones = evaluaciones.map(evaluacion =>
        evaluacion._id === editEvaluacion._id ? { ...evaluacion, tema_id: { ...evaluacion.tema_id, _id: tema }, evaluacion: editEvaluacion.evaluacion } : evaluacion
      );
      setEvaluaciones(updatedEvaluaciones);
      setModalAlert({ type: 'success', message: 'Evaluación actualizada exitosamente' });
      setTimeout(handleModalClose, 2000);
    } catch (error) {
      console.error('Error al actualizar evaluación:', error);
      const errorMessage = error.response && error.response.data && error.response.data.details
        ? error.response.data.details.join(', ')
        : 'Error al actualizar evaluación';
      setModalAlert({ type: 'error', message: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePreguntaChange = (index, field, value) => {
    const newPreguntas = editEvaluacion.evaluacion.map((pregunta, idx) =>
      idx === index ? { ...pregunta, [field]: value } : pregunta
    );
    setEditEvaluacion({ ...editEvaluacion, evaluacion: newPreguntas });
  };

  const handleOptionChange = (index, optionIndex, value) => {
    const newPreguntas = editEvaluacion.evaluacion.map((pregunta, idx) => {
      if (idx === index) {
        const newOpciones = pregunta.opciones.map((opcion, oIdx) => {
          return oIdx === optionIndex ? value : opcion;
        });
        return { ...pregunta, opciones: newOpciones };
      }
      return pregunta;
    });
    setEditEvaluacion({ ...editEvaluacion, evaluacion: newPreguntas });
  };

  const handleDownloadEvaluacion = (evaluacionId) => {
    axios.get(`http://localhost:3001/api/evaluaciones/${evaluacionId}/download`, { responseType: 'blob' })
      .then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `Evaluacion_${evaluacionId}.xlsx`);
        document.body.appendChild(link);
        link.click();
        link.parentNode.removeChild(link);
      })
      .catch((error) => {
        console.error('Error al descargar el archivo:', error);
        setAlert({ type: 'error', message: 'Error al descargar el archivo Excel. Inténtalo de nuevo.' });
      });
  };

  const handleDownloadPlantilla = () => {
    axios.get('http://localhost:3001/api/evaluaciones/plantilla', { responseType: 'blob' })
      .then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'Plantilla_Cuestionario.xlsx');
        document.body.appendChild(link);
        link.click();
        link.parentNode.removeChild(link);
      })
      .catch((error) => {
        console.error('Error al descargar la plantilla:', error);
        setAlert({ type: 'error', message: 'Error al descargar la plantilla. Inténtalo de nuevo.' });
      });
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const getCurrentPageItems = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return editEvaluacion.evaluacion.slice(startIndex, endIndex);
  };

  const totalPages = Math.ceil(editEvaluacion ? editEvaluacion.evaluacion.length / itemsPerPage : 1);

  const filteredEvaluaciones = evaluaciones.filter(evaluacion => {
    if (curso === '') {
      return true;
    }
    return evaluacion.tema_id.curso === curso;
  });

  return (
    <div style={{ backgroundColor: '#14161A', minHeight: '100vh', padding: '20px' }}>
      <div className="container">
        <h1 className="title has-text-centered has-text-white">Subir Cuestionario</h1>

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
                <input className="file-input" type="file" accept=".xlsx, .xls" onChange={handleNewFileChange} />
                <span className="file-cta">
                  <span className="file-icon">
                    <i className="fas fa-upload"></i>
                  </span>
                  <span className="file-label">
                    Elige un archivo...
                  </span>
                </span>
                {newFile && (
                  <span className="file-name">
                    {newFile.name}
                  </span>
                )}
              </label>
            </div>
          </div>
          <div className="field">
            <label className="label has-text-white">Tema</label>
            <div className="control">
              <div className="select">
                <select value={tema} onChange={(e) => setTema(e.target.value)} required>
                  <option value="" disabled>Selecciona un tema</option>
                  {temas.map((tema) => (
                    <option key={tema._id} value={tema._id}>{tema.titulo}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        
          <div className="field is-grouped is-grouped-right">
            <div className="control">
              <button
                type="submit"
                className="button is-success"
                onClick={handleSubmit}
                disabled={isLoading}
                data-tooltip="Subir Cuestionario"
                style={{ paddingRight: '5px' }}
              >
                <span className="icon">
                  <i className={`fas ${isLoading ? 'fa-spinner fa-spin' : 'fa-upload'}`}></i>
                </span>
                <span>{isLoading ? 'Cargando...' : ''}</span>
              </button>
            </div>
            <div className="control">
              <button
                className="button is-info"
                onClick={handleDownloadPlantilla}
                disabled={isLoading}
                data-tooltip="Descargar Plantilla"
                style={{ paddingRight: '5px' }}
              >
                <span className="icon">
                  <i className={`fas ${isLoading ? 'fa-spinner fa-spin' : 'fa-download'}`}></i>
                </span>
                <span>{isLoading ? 'Descargando...' : ''}</span>
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
          <h2 className="title is-4 has-text-centered has-text-white">Lista de Evaluaciones</h2>
          <div className="field">
            <label className="label has-text-white">Filtrar por Curso</label>
            <div className="control">
              <div className="select">
                <select value={curso} onChange={(e) => setCurso(e.target.value)}>
                  <option value="">Todos los cursos</option>
                  {Object.keys(cursos).map((cursoId) => (
                    <option key={cursoId} value={cursoId}>{cursos[cursoId]}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          <table className="table is-fullwidth is-striped is-hoverable">
            <thead>
              <tr>
                <th className="has-text-white">Tema</th>
                <th className="has-text-white">Curso</th>
                <th className="has-text-white">Número de Preguntas</th>
                <th className="has-text-centered has-text-white">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredEvaluaciones && filteredEvaluaciones.length > 0 ? (
                filteredEvaluaciones.map((evaluacion) => {
                  const { tema_id, evaluacion: preguntas, habilitado } = evaluacion;
                  const cursoNombre = cursos[tema_id.curso];
                  return (
                    <tr key={evaluacion._id}>
                      <td className="has-text-white" style={{ verticalAlign: 'middle' }}>
                        {tema_id ? tema_id.titulo : 'Tema no disponible'}
                      </td>
                      <td className="has-text-white" style={{ verticalAlign: 'middle' }}>
                        {cursoNombre || 'Curso no disponible'}
                      </td>
                      <td className="has-text-white" style={{ verticalAlign: 'middle' }}>{preguntas.length} preguntas</td>
                      <td className="has-text-centered has-text-white" style={{ verticalAlign: 'middle' }}>
                        <div className="buttons is-centered">
                          <button className="button is-small is-info" onClick={() => handleEdit(evaluacion)} data-tooltip="Editar">
                            <span className="icon">
                              <i className="fas fa-edit"></i>
                            </span>
                          </button>
                          <button className="button is-small is-danger" onClick={() => handleDelete(evaluacion._id)} style={{ marginRight: '8px' }} data-tooltip="Eliminar">
                            <span className="icon">
                              <i className="fas fa-trash-alt"></i>
                            </span>
                          </button>
                          <button className="button is-small is-warning" onClick={() => handleDownloadEvaluacion(evaluacion._id)} data-tooltip="Descargar Evaluación">
                            <span className="icon">
                              <i className="fas fa-download"></i>
                            </span>
                          </button>
                          <button
                            className={`button is-small ${habilitado ? 'is-success' : 'is-light'}`}
                            onClick={() => handleToggleHabilitado(evaluacion._id, !habilitado)}
                            data-tooltip={habilitado ? 'Deshabilitar' : 'Habilitar'}
                          >
                            <span className="icon">
                              <i className={`fas ${habilitado ? 'fa-check' : 'fa-times'}`}></i>
                            </span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td className="has-text-white" colSpan="4">No hay evaluaciones disponibles.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {editMode && (
          <div className={`modal ${editMode ? 'is-active' : ''}`}>
            <div className="modal-background"></div>
            <div className="modal-card">
              <header className="modal-card-head">
                <p className="modal-card-title">Editar Evaluación</p>
                <button className="delete" aria-label="close" onClick={handleModalClose}></button>
              </header>
              <section className="modal-card-body">
                {modalAlert.message && (
                  <div className={`notification ${modalAlert.type === 'success' ? 'is-success' : 'is-danger'}`}>
                    <button className="delete" onClick={() => setModalAlert({ type: '', message: '' })}></button>
                    {modalAlert.message}
                  </div>
                )}
                <div className="field">
                  <label className="label">Tema</label>
                  <div className="control">
                    <input
                      className="input"
                      type="text"
                      value={editEvaluacion && editEvaluacion.tema_id ? editEvaluacion.tema_id.titulo : ''}
                      readOnly
                    />
                  </div>
                </div>
                {getCurrentPageItems().map((pregunta, index) => (
                  <div key={index} className="box" style={{ marginBottom: '1rem' }}>
                    <div className="field">
                      <label className="label">Pregunta {index + 1 + (currentPage - 1) * itemsPerPage}</label>
                      <div className="control">
                        <input
                          className="input"
                          type="text"
                          value={pregunta.pregunta}
                          onChange={(e) => handlePreguntaChange(index + (currentPage - 1) * itemsPerPage, 'pregunta', e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="field">
                      <label className="label">Opción A</label>
                      <div className="control">
                        <input
                          className="input"
                          type="text"
                          value={pregunta.opciones[0]}
                          onChange={(e) => handleOptionChange(index + (currentPage - 1) * itemsPerPage, 0, e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="field">
                      <label className="label">Opción B</label>
                      <div className="control">
                        <input
                          className="input"
                          type="text"
                          value={pregunta.opciones[1]}
                          onChange={(e) => handleOptionChange(index + (currentPage - 1) * itemsPerPage, 1, e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="field">
                      <label className="label">Opción C</label>
                      <div className="control">
                        <input
                          className="input"
                          type="text"
                          value={pregunta.opciones[2]}
                          onChange={(e) => handleOptionChange(index + (currentPage - 1) * itemsPerPage, 2, e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="field">
                      <label className="label">Opción D</label>
                      <div className="control">
                        <input
                          className="input"
                          type="text"
                          value={pregunta.opciones[3]}
                          onChange={(e) => handleOptionChange(index + (currentPage - 1) * itemsPerPage, 3, e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="field">
                      <label className="label">Respuesta Correcta</label>
                      <div className="control">
                        <input
                          className="input"
                          type="text"
                          value={pregunta.respuesta_correcta}
                          onChange={(e) => handlePreguntaChange(index + (currentPage - 1) * itemsPerPage, 'respuesta_correcta', e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="field">
                      <label className="label">Imagen</label>
                      <div className="control">
                        <input
                          className="input"
                          type="text"
                          value={pregunta.imagen}
                          onChange={(e) => handlePreguntaChange(index + (currentPage - 1) * itemsPerPage, 'imagen', e.target.value)}
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
              <div className="footer-left">
                <button className="button is-success" onClick={handleModalSave}>
                  <span className="icon">
                    <i className="fas fa-save"></i>
                  </span>
                  <span>Guardar</span>
                </button>
                <button className="button" onClick={handleModalClose}>
                  <span className="icon">
                    <i className="fas fa-times"></i>
                  </span>
                  <span>Cancelar</span>
                </button>
              </div>
              <div className="footer-right" style={{ marginLeft: '150px' }}>
                <div className="file is-primary has-name">
                  <label className="file-label">
                    <input className="file-input" type="file" accept=".xlsx, .xls" onChange={handleEditFileChange} />
                    <span className="file-cta">
                      <span className="file-icon">
                        <i className="fas fa-upload"></i>
                      </span>
                      <span className="file-label">
                        Subir actualización...
                      </span>
                    </span>
                    {editFile && (
                      <span className="file-name">
                        {editFile.name}
                      </span>
                    )}
                  </label>
                </div>
              </div>
            </footer>
          </div>
        </div>
      )}
    </div>
  </div>
);
};

export default CuestionariosForm;
