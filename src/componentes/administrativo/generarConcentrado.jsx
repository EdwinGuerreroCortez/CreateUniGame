import React, { useState, useEffect } from 'react';
import 'bulma/css/bulma.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

const GenerarConcentrado = () => {
  const [cursos, setCursos] = useState([]);
  const [selectedCurso, setSelectedCurso] = useState('');
  const [alumnos, setAlumnos] = useState([]);
  const [selectedAlumnos, setSelectedAlumnos] = useState([]);

  useEffect(() => {
    const fetchCursos = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/cursos');
        const data = await response.json();
        setCursos(data);
      } catch (error) {
        console.error('Error al obtener los cursos:', error);
      }
    };

    fetchCursos();
  }, []);

  const handleCursoChange = async (e) => {
    setSelectedCurso(e.target.value);
    try {
      const response = await fetch(`http://localhost:3001/api/cursos/${e.target.value}/alumnos`);
      const data = await response.json();
      setAlumnos(data);
    } catch (error) {
      console.error('Error al obtener los alumnos:', error);
    }
  };

  const handleAlumnoChange = (alumnoId) => {
    setSelectedAlumnos((prevSelected) =>
      prevSelected.includes(alumnoId)
        ? prevSelected.filter((id) => id !== alumnoId)
        : [...prevSelected, alumnoId]
    );
  };

  const handleGenerateConcentrado = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/generar-concentrado', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cursoId: selectedCurso, alumnos: selectedAlumnos }),
      });
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'concentrado.xlsx';
      a.click();
    } catch (error) {
      console.error('Error al generar el concentrado:', error);
    }
  };

  return (
    <div className='has-background-black-bis'>
      <section className="section">
        <h1 className="title has-text-centered has-text-white">Generar Concentrado</h1>
        <div className="card has-background-black" style={{ border: `2px solid #48C78E` }}>
          <div className="card-content">
            <div className="field">
              <label className="label has-text-white">Seleccionar Curso</label>
              <div className="control">
                <div className="select is-info">
                  <select value={selectedCurso} onChange={handleCursoChange}>
                    <option value="">Seleccione un curso</option>
                    {cursos.map((curso) => (
                      <option key={curso._id} value={curso._id}>{curso.nombre}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="field">
              <label className="label has-text-white">Seleccionar Alumnos</label>
              <div className="control">
                {alumnos.map((alumno) => (
                  <div key={alumno._id} className="checkbox">
                    <label className="has-text-white">
                      <input
                        type="checkbox"
                        checked={selectedAlumnos.includes(alumno._id)}
                        onChange={() => handleAlumnoChange(alumno._id)}
                      />
                      {alumno.datos_personales.nombre} {alumno.datos_personales.apellido_paterno}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div className="field">
              <div className="control">
                <button className="button is-info" onClick={handleGenerateConcentrado}>Generar Concentrado</button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default GenerarConcentrado;
