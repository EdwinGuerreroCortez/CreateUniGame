import React, { useState, useEffect } from 'react';
import 'bulma/css/bulma.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

const Evaluaciones = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [evaluaciones, setEvaluaciones] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentExamen, setCurrentExamen] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [examenesPerPage] = useState(1);

  useEffect(() => {
    const fetchEvaluaciones = async () => {
      try {
        const userId = localStorage.getItem('userId');
        const response = await fetch(`http://localhost:3001/api/usuario/${userId}/temasbuscar`);
        const data = await response.json();

        const examenesIds = data.examenes.map(examen => examen._id);

        const examenesDetalles = await Promise.all(examenesIds.map(async (id) => {
          const response = await fetch(`http://localhost:3001/api/examenes/${id}`);
          return response.json();
        }));

        setEvaluaciones(examenesDetalles);
      } catch (error) {
        console.error('Error al obtener las evaluaciones:', error);
      }
    };

    fetchEvaluaciones();
  }, []);

  const handleSearch = () => {
    setCurrentPage(1); // Reset pagination when searching
  };

  const handleViewDetails = (examen) => {
    setCurrentExamen(examen);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setCurrentExamen(null);
    setCurrentPage(1); // Reset pagination when closing modal
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

  // Logic for displaying current exam page
  const indexOfLastExamen = currentPage * examenesPerPage;
  const indexOfFirstExamen = indexOfLastExamen - examenesPerPage;
  const currentExamenPage = currentExamen?.preguntasRespondidas.slice(indexOfFirstExamen, indexOfLastExamen);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const filteredEvaluaciones = evaluaciones.filter(item =>
    item.usuarioId && item.usuarioId.datos_personales && item.usuarioId.datos_personales.matricula.includes(searchTerm)
  );

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
            <div className="table-container">
              <h2 className="title is-4 has-text-centered has-text-white">Calificaciones</h2>
              <table className="table is-fullwidth is-striped is-hoverable">
                <thead>
                  <tr>
                    <th className="has-text-white">Matrícula</th>
                    <th className="has-text-white">Examen</th>
                    <th className="has-text-white">Datos del Examen</th>
                    <th className="has-text-white">Número de Intentos</th>
                    <th className="has-text-white">Calificación</th>
                    <th className="has-text-white">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredEvaluaciones.map((item, index) => (
                    <tr key={index}>
                      <td className="has-text-white">{item.usuarioId.datos_personales.matricula}</td>
                      <td className="has-text-white">{item.temaId.titulo}</td>
                      <td className="has-text-white">
                        <button
                          className="button is-small is-info"
                          onClick={() => handleViewDetails(item)}
                        >
                          Ver
                        </button>
                      </td>
                      <td className="has-text-white">{item.intentos}</td>
                      <td className="has-text-white">{item.preguntasRespondidas[item.preguntasRespondidas.length - 1].porcentaje}%</td>
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
                        <p className="has-text-white"><strong>Pregunta:</strong> {respuesta.pregunta}</p>
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
    </div>
  );
};

export default Evaluaciones;
