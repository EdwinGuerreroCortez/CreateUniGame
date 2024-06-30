import React, { useState, useEffect } from 'react';
import 'bulma/css/bulma.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBan, faUnlock } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';

const AlumnosSubcritosAdmi = () => {
  const [cursos, setCursos] = useState([]);
  const [selectedCursoId, setSelectedCursoId] = useState('');

  useEffect(() => {
    const fetchCursos = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/api/cursos-subscritores`);
        setCursos(response.data);
      } catch (error) {
        console.error('Error al obtener los cursos:', error);
      }
    };

    fetchCursos();
  }, []);

  const handleCursoChange = (e) => {
    setSelectedCursoId(e.target.value);
  };

  const toggleBan = async (cursoId, subId) => {
    try {
      await axios.put(`http://localhost:3001/api/cursos/${cursoId}/subscritores/${subId}/banear`);
      setCursos((prevCursos) =>
        prevCursos.map((curso) =>
          curso._id === cursoId
            ? {
                ...curso,
                subscritores: curso.subscritores.map((sub) =>
                  sub._id === subId ? { ...sub, banear: !sub.banear } : sub
                ),
              }
            : curso
        )
      );
    } catch (error) {
      console.error('Error al actualizar el estado de ban:', error);
    }
  };

  const filteredCursos = selectedCursoId
    ? cursos.filter((curso) => curso._id === selectedCursoId)
    : cursos;

  return (
    <div style={{ backgroundColor: "#14161A", minHeight: "100vh", padding: "20px" }}>
      <div className="container">
        <h1 className="title has-text-centered has-text-white">Alumnos Suscritos</h1>
        <div className="field">
          <label className="label has-text-white">Selecciona un curso</label>
          <div className="control">
            <div className="select">
              <select onChange={handleCursoChange} value={selectedCursoId}>
                <option value="">Todos los cursos</option>
                {cursos.map((curso) => (
                  <option key={curso._id} value={curso._id}>
                    {curso.nombre}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
        {filteredCursos.map((curso) => (
          <div key={curso._id} className="box" style={{ backgroundColor: "#090A0C", marginBottom: '20px' }}>
            <h2 className="subtitle has-text-white">{curso.nombre}</h2>
            <div className="table-container">
              <table className="table is-striped is-hoverable is-fullwidth">
                <thead>
                  <tr>
                    <th className="has-text-white">Alumno</th>
                    <th className="has-text-white">Matrícula</th>
                    <th className="has-text-white">Correo</th>
                    <th className="has-text-white">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {curso.subscritores.length > 0 ? (
                    curso.subscritores.map((sub) => (
                      <tr key={sub._id}>
                        <td className="has-text-white">
                          {sub.usuario.datos_personales.nombre} {sub.usuario.datos_personales.apellido_paterno}
                        </td>
                        <td className="has-text-white">{sub.usuario.datos_personales.matricula}</td>
                        <td className="has-text-white">{sub.usuario.datos_personales.correo}</td>
                        <td className="has-text-centered has-text-white">
                          <span
                            className="icon has-tooltip-arrow has-tooltip-multiline"
                            data-tooltip={sub.banear ? 'Desbanear' : 'Banear'}
                            onClick={() => toggleBan(curso._id, sub._id)}
                            style={{ cursor: 'pointer' }}
                          >
                            <FontAwesomeIcon
                              icon={sub.banear ? faUnlock : faBan}
                              color={sub.banear ? 'green' : 'red'}
                            />
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td className="has-text-centered has-text-white" colSpan="4">
                        No hay suscriptores para este curso.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AlumnosSubcritosAdmi;
