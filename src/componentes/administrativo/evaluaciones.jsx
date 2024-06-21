import React, { useState } from 'react';
import 'bulma/css/bulma.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import '../CSS/evaluaciones.css'

const Evaluaciones = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [evaluaciones, setEvaluaciones] = useState([
    { matricula: '12345', examen: 'Math', datosExamen: 'Algebra', intentos: 2, calificacion: 85 },
    { matricula: '67890', examen: 'Science', datosExamen: 'Biology', intentos: 1, calificacion: 90 },
    // Agrega más datos según sea necesario
  ]);

  const handleSearch = () => {
    // Implementa la lógica de búsqueda aquí si es necesario
  };

  const handleAddAttempt = (index) => {
    const newEvaluaciones = [...evaluaciones];
    newEvaluaciones[index].intentos += 1;
    setEvaluaciones(newEvaluaciones);
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
                <button className="button is-info" onClick={handleSearch}
                  >
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
                  {evaluaciones
                    .filter(item => item.matricula.includes(searchTerm))
                    .map((item, index) => (
                      <tr key={index}>
                        <td className="has-text-white">{item.matricula}</td>
                        <td className="has-text-white">{item.examen}</td>
                        <td className="has-text-white">{item.datosExamen}</td>
                        <td className="has-text-white">{item.intentos}</td>
                        <td className="has-text-white">{item.calificacion}</td>
                        <td>
                        <button
                            className="button is-small is-info"
                            onClick={() => handleAddAttempt(index)}
                          >
                            <span className="icon " data-tooltip="Añadir otro intento">
                              <i className="fas fa-plus" ></i>
                            </span>
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Evaluaciones;
