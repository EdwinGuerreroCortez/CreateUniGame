import React, { useState, useEffect } from 'react';
import 'bulma/css/bulma.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import * as XLSX from 'sheetjs-style';
import { saveAs } from 'file-saver';

const Evaluaciones = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [evaluaciones, setEvaluaciones] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentExamen, setCurrentExamen] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [examenesPerPage] = useState(1);
  const [selectedCurso, setSelectedCurso] = useState('');
  const [cursos, setCursos] = useState([]);
  const [showConcentradoModal, setShowConcentradoModal] = useState(false);
  const [filteredConcentrado, setFilteredConcentrado] = useState([]);
  const [maxEvaluaciones, setMaxEvaluaciones] = useState(0);
  const [selectedDate, setSelectedDate] = useState('');
  const [concentradoDate, setConcentradoDate] = useState('');

  useEffect(() => {
    const fetchEvaluaciones = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/examenes');
        const data = await response.json();
        setEvaluaciones(data);

        const cursosUnicos = Array.from(new Set(data.map(examen => examen.nombreCurso)));
        setCursos(cursosUnicos);
      } catch (error) {
        console.error('Error al obtener las evaluaciones:', error);
      }
    };

    fetchEvaluaciones();
  }, []);

  const handleSearch = () => {
    setCurrentPage(1);
  };

  const handleViewDetails = (examen) => {
    setCurrentExamen(examen);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setCurrentExamen(null);
    setCurrentPage(1);
  };

  const toggleExamenPermitido = async (examen) => {
    try {
      const response = await fetch(`http://localhost:3001/api/examenes/${examen._id}/toggle`, {
        method: 'PUT',
      });
      if (response.ok) {
        setEvaluaciones(evaluaciones.map(e =>
          e._id === examen._id ? { ...e, examenPermitido: !e.examenPermitido } : e
        ));
      } else {
        console.error('Error al actualizar el estado del examen permitido');
      }
    } catch (error) {
      console.error('Error al actualizar el estado del examen permitido:', error);
    }
  };

  const indexOfLastExamen = currentPage * examenesPerPage;
  const indexOfFirstExamen = indexOfLastExamen - examenesPerPage;
  const currentExamenPage = currentExamen?.preguntasRespondidas.slice(indexOfFirstExamen, indexOfLastExamen);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const filteredEvaluaciones = evaluaciones.filter(item =>
    item.usuarioId && item.usuarioId.datos_personales &&
    item.usuarioId.datos_personales.matricula.includes(searchTerm) &&
    (selectedCurso === '' || item.nombreCurso === selectedCurso) &&
    (selectedDate === '' || new Date(item.fechaUltimoIntento).setHours(0, 0, 0, 0) >= new Date(selectedDate).setHours(0, 0, 0, 0))
  );

  const handleGenerateConcentrado = () => {
    setShowConcentradoModal(true);
    handleFilterConcentrado(selectedCurso, concentradoDate);
  };

  const handleFilterConcentrado = (curso, date) => {
    setSelectedCurso(curso);
    setConcentradoDate(date);

    if (!curso && !date) {
      setFilteredConcentrado([]);
      setMaxEvaluaciones(0);
      return;
    }

    const concentrado = evaluaciones.filter(evaluacion =>
      (curso === '' || evaluacion.nombreCurso === curso) &&
      (date === '' || new Date(evaluacion.fechaUltimoIntento) >= new Date(date))
    ).reduce((acc, evaluacion) => {
      const matricula = evaluacion.usuarioId?.datos_personales?.matricula || 'Matrícula no disponible';
      const nombreCompleto = evaluacion.usuarioId?.datos_personales 
        ? `${evaluacion.usuarioId.datos_personales.nombre} ${evaluacion.usuarioId.datos_personales.apellido_paterno} ${evaluacion.usuarioId.datos_personales.apellido_materno}` 
        : 'Nombre no disponible';
      if (!acc[matricula]) {
        acc[matricula] = { matricula, nombreCompleto, calificaciones: [] };
      }
      acc[matricula].calificaciones.push(evaluacion.preguntasRespondidas[evaluacion.preguntasRespondidas.length - 1].porcentaje);
      return acc;
    }, {});

    const maxEval = Math.max(...Object.values(concentrado).map(item => item.calificaciones.length), 0);
    setMaxEvaluaciones(maxEval);

    const concentradoCompleto = Object.values(concentrado).map(item => {
      const calificacionesCompletas = [...item.calificaciones, ...Array(Math.max(0, maxEval - item.calificaciones.length)).fill('N/P')];
      const sum = calificacionesCompletas.reduce((acc, cal) => acc + (cal !== 'N/P' ? cal : 0), 0);
      const promedio = (sum / maxEval).toFixed(2);
      return {
        matricula: item.matricula,
        nombreCompleto: item.nombreCompleto,
        calificaciones: calificacionesCompletas,
        promedio: promedio
      };
    });

    setFilteredConcentrado(concentradoCompleto);
  };

  const handleDownloadConcentrado = () => {
    const worksheetData = [
      [],
      ['', { v: 'Datos del Concentrado', s: { alignment: { horizontal: "center" }, font: { bold: true }, fill: { fgColor: { rgb: "CCFFCC" } } } }],
      ['', { v: `Curso: ${selectedCurso || 'Todos los cursos'}`, s: { alignment: { horizontal: "left" }, font: { bold: true } } }],
      ['', { v: `Fecha de generación: ${new Date().toLocaleDateString()}`, s: { alignment: { horizontal: "left" }, font: { bold: true } } }],
      [],
      ['NO.', 'Matrícula', 'Nombre Completo', ...Array.from({ length: maxEvaluaciones }, (_, index) => `Evaluación ${index + 1}`), 'Promedio']
    ];

    filteredConcentrado.forEach((item, index) => {
      const row = [index + 1, item.matricula, item.nombreCompleto, ...item.calificaciones, item.promedio];
      worksheetData.push(row);
    });

    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);

    const range = XLSX.utils.decode_range(worksheet['!ref']);
    worksheet['!cols'] = [
      { wch: 5 },  // NO.
      { wch: 15 }, // Matrícula
      { wch: 35 }, // Nombre Completo
      ...Array(maxEvaluaciones).fill({ wch: 12 }), // Evaluaciones
      { wch: 10 }  // Promedio
    ];

    worksheet['!merges'] = [
      { s: { r: 1, c: 1 }, e: { r: 1, c: 4 } },
      { s: { r: 2, c: 1 }, e: { r: 2, c: 4 } },
      { s: { r: 3, c: 1 }, e: { r: 3, c: 4 } }
    ];

    for (let R = 1; R <= 3; ++R) {
      for (let C = 1; C <= 4; ++C) {
        const cellAddress = { c: C, r: R };
        const cellRef = XLSX.utils.encode_cell(cellAddress);
        if (worksheet[cellRef]) {
          worksheet[cellRef].s = {
            fill: { fgColor: { rgb: "CCFFCC" } },
            font: { bold: true },
            alignment: { horizontal: "center", vertical: "center" }
          };
        }
      }
    }

    for (let R = 5; R <= range.e.r; ++R) {
      for (let C = 0; C <= range.e.c; ++C) {
        const cellAddress = { c: C, r: R };
        const cellRef = XLSX.utils.encode_cell(cellAddress);
        if (worksheet[cellRef]) {
          if (R === 5) {
            worksheet[cellRef].s = {
              font: { bold: true, color: { rgb: "000000" } },
              fill: { fgColor: { rgb: "FFD700" } },
              alignment: { horizontal: "center", vertical: "center" },
              border: {
                top: { style: "thin", color: { rgb: "000000" } },
                bottom: { style: "thin", color: { rgb: "000000" } },
                left: { style: "thin", color: { rgb: "000000" } },
                right: { style: "thin", color: { rgb: "000000" } }
              }
            };
          } else {
            worksheet[cellRef].s = {
              alignment: { horizontal: "center", vertical: "center" },
              border: {
                top: { style: "thin", color: { rgb: "000000" } },
                bottom: { style: "thin", color: { rgb: "000000" } },
                left: { style: "thin", color: { rgb: "000000" } },
                right: { style: "thin", color: { rgb: "000000" } }
              }
            };
            if (C === 0) {
              worksheet[cellRef].s.fill = { fgColor: { rgb: "FFA500" } };
              worksheet[cellRef].s.font = { bold: true, color: { rgb: "000000" } };
            }
            if (worksheet[cellRef].v === 'N/P') {
              worksheet[cellRef].s.fill = { fgColor: { rgb: "FF0000" } };
            }
          }
        }
      }
    }

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Concentrado');

    let fileName = `Concentrado_${selectedCurso ? selectedCurso : 'Todos_los_cursos'}`;
    if (selectedDate) {
      fileName += `_${selectedDate}`;
    }
    fileName += '.xlsx';

    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(blob, fileName);
  };

  const getLastAttempt = (preguntasRespondidas) => {
    if (preguntasRespondidas.length === 0) {
      return null;
    }
    return preguntasRespondidas.reduce((lastAttempt, currentAttempt) => {
      return currentAttempt.intento > lastAttempt.intento ? currentAttempt : lastAttempt;
    });
  };
  
  return (
    <div className='has-background-black-bis'>
      <section className="section">
        <h1 className="title has-text-centered has-text-white">Evaluaciones</h1>
        <div className="card has-background-black" style={{ border: `2px solid #48C78E` }}>
          <div className="card-content">
            <div className="field has-addons">
              <div className="control is-expanded">
                <input
                  className="input is-info"
                  type="text"
                  placeholder="Buscar por matrícula"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="control">
                <button className="button is-info" onClick={handleSearch}>
                  <span className="icon">
                    <i className="fas fa-search"></i>
                  </span>
                </button>
              </div>
            </div>
            <div className="field has-addons">
              <div className="control">
                <div className="select is-info">
                  <select value={selectedCurso} onChange={(e) => setSelectedCurso(e.target.value)}>
                    <option value="">Todos los cursos</option>
                    {cursos.map((curso, index) => (
                      <option key={index} value={curso}>{curso}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="control">
                <input
                  className="input is-info"
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                />
              </div>
            </div>
            <div className="field">
              <div className="control">
                <button className="button is-primary" onClick={handleGenerateConcentrado}>
                  Generar Concentrado
                </button>
              </div>
            </div>
            <div className="table-container">
              <h2 className="title is-4 has-text-centered has-text-white">Calificaciones</h2>
              <table className="table is-fullwidth is-striped is-hoverable">
                <thead>
                  <tr>
                    <th className="has-text-white">Matrícula</th>
                    <th className="has-text-white">Examen</th>
                    <th className="has-text-white">Curso</th>
                    <th className="has-text-white">Fecha del Último Intento</th>
                    <th className="has-text-white">Datos del Examen</th>
                    <th className="has-text-white">Número de Intentos</th>
                    <th className="has-text-white">Calificación</th>
                    <th className="has-text-white">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredEvaluaciones.map((item, index) => (
                    <tr key={index}>
                      <td className="has-text-white">{item.usuarioId?.datos_personales?.matricula || 'Matrícula no disponible'}</td>
                      <td className="has-text-white">{item.tituloTema || 'Tema no disponible'}</td>
                      <td className="has-text-white">{item.nombreCurso || 'Curso no disponible'}</td>
                      <td className="has-text-white">{item.fechaUltimoIntento ? new Date(item.fechaUltimoIntento).toLocaleDateString() : 'Fecha no disponible'}</td>
                      <td className="has-text-white">
                        <button
                          className="button is-small is-info"
                          onClick={() => handleViewDetails(item)}
                        >
                          Ver
                        </button>
                      </td>
                      <td className="has-text-white">{item.intentos}</td>
                      <td className="has-text-white">
                        {(() => {
                          const lastAttempt = getLastAttempt(item.preguntasRespondidas);
                          return lastAttempt ? lastAttempt.porcentaje + '%' : 'Calificación no disponible';
                        })()}
                      </td>
                      <td className="has-text-white">
                        <div className="tooltip" data-tooltip={item.examenPermitido ? 'No permitir examen' : 'Permitir examen'}>
                          <button
                            className="button is-small"
                            style={{
                              backgroundColor: item.examenPermitido ? '#ffdddd' : '#ddffdd',
                              borderColor: item.examenPermitido ? 'red' : 'green',
                              color: item.examenPermitido ? 'red' : 'green',
                            }}
                            onClick={() => toggleExamenPermitido(item)}
                          >
                            <i className={item.examenPermitido ? 'fas fa-ban' : 'fas fa-check'}></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {showModal && currentExamen && (
        <div className="modal is-active">
          <div className="modal-background" onClick={handleCloseModal}></div>
          <div className="modal-content">
            <div className="box has-background-black" style={{ border: '2px solid #48C78E' }}>
              <h2 className="title has-text-white">Detalles del Examen</h2>
              <div className="content">
                {currentExamenPage.map((intento, index) => (
                  <div key={index} className="box" style={{ backgroundColor: '#14161A', border: '2px solid #48C78E', marginBottom: '1rem' }}>
                    <h3 className="subtitle has-text-white">Intento {intento.intento}</h3>
                    <p className="has-text-white"><strong>Fecha:</strong> {new Date(intento.fecha).toLocaleString()}</p>
                    <p className="has-text-white"><strong>Calificación:</strong> {intento.porcentaje}%</p>
                    {intento.respuestas.map((respuesta, i) => (
                      <div
                        key={i}
                        className="box"
                        style={{
                          backgroundColor: '#14161A',
                          border: respuesta.correcta ? '2px solid green' : '2px solid red',
                          marginBottom: '1rem'
                        }}
                      >
                        <p className="has-text-white"><strong>Pregunta {i + 1}:</strong> {respuesta.pregunta}</p>
                        <p className="has-text-white"><strong>Respuesta:</strong> {respuesta.respuesta}</p>
                        <p className="has-text-white"><strong>Correcta:</strong> {respuesta.correcta ? 'Sí' : 'No'}</p>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
              <nav className="pagination is-centered" role="navigation" aria-label="pagination">
                <a
                  className="pagination-previous"
                  onClick={() => paginate(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  Anterior
                </a>
                <a
                  className="pagination-next"
                  onClick={() => paginate(currentPage + 1)}
                  disabled={currentPage * examenesPerPage >= currentExamen.preguntasRespondidas.length}
                >
                  Siguiente
                </a>
                <ul className="pagination-list">
                  {Array.from({ length: Math.ceil(currentExamen.preguntasRespondidas.length / examenesPerPage) }, (_, i) => (
                    <li key={i}>
                      <a
                        className={`pagination-link ${i + 1 === currentPage ? 'is-current' : ''}`}
                        onClick={() => paginate(i + 1)}
                      >
                        {i + 1}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>
          </div>
          <button className="modal-close is-large" aria-label="close" onClick={handleCloseModal}></button>
        </div>
      )}

      {showConcentradoModal && (
        <div className="modal is-active">
          <div className="modal-background" onClick={() => setShowConcentradoModal(false)}></div>
          <div className="modal-content">
            <div className="box has-background-black" style={{ border: '2px solid #48C78E' }}>
              <h2 className="title has-text-white">Generar Concentrado</h2>
              <div className="field has-addons">
                <div className="control">
                  <div className="select is-info">
                    <select onChange={(e) => handleFilterConcentrado(e.target.value, concentradoDate)}>
                      <option value="">Seleccione un curso</option>
                      {cursos.map((curso, index) => (
                        <option key={index} value={curso}>{curso}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="control">
                  <input
                    className="input is-info"
                    type="date"
                    value={concentradoDate}
                    onChange={(e) => {
                      setConcentradoDate(e.target.value);
                      handleFilterConcentrado(selectedCurso, e.target.value);
                    }}
                  />
                </div>
              </div>
              <div className="table-container">
                <h2 className="title is-4 has-text-centered has-text-white">Concentrado de Evaluaciones</h2>
                <table className="table is-fullwidth is-striped is-hoverable">
                  <thead>
                    <tr>
                      <th className="has-text-white">Matrícula</th>
                      <th className="has-text-white">Nombre Completo</th>
                      {[...Array(maxEvaluaciones)].map((_, index) => (
                        <th key={index} className="has-text-white">Evaluación {index + 1}</th>
                      ))}
                      <th className="has-text-white">Promedio</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredConcentrado.map((item, index) => (
                      <tr key={index}>
                        <td className="has-text-white">{item.matricula}</td>
                        <td className="has-text-white">{item.nombreCompleto}</td>
                        {item.calificaciones.map((calificacion, i) => (
                          <td key={i} className="has-text-white" style={{ backgroundColor: calificacion === 'N/P' ? '#FF0000' : 'transparent' }}>{calificacion !== 'N/P' ? calificacion : 'N/P'}</td>
                        ))}
                        <td className="has-text-white">{item.promedio}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <button className="button is-info" onClick={handleDownloadConcentrado} style={{ marginTop: '10px' }}>
                  <span className="icon">
                    <i className="fas fa-download"></i>
                  </span>
                  <span>Descargar Concentrado</span>
                </button>
              </div>
            </div>
          </div>
          <button className="modal-close is-large" aria-label="close" onClick={() => setShowConcentradoModal(false)}></button>
        </div>
      )}
    </div>
  );
};

export default Evaluaciones;
