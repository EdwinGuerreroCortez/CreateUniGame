import React, { useState, useEffect } from 'react';
import "bulma/css/bulma.min.css";
import axios from 'axios';

const Evaluacion = () => {
  const [preguntas, setPreguntas] = useState([]);
  const [respuestas, setRespuestas] = useState([]);
  const [mostrarResultados, setMostrarResultados] = useState(false);
  const [evaluacionId, setEvaluacionId] = useState('');
  const [calificacion, setCalificacion] = useState(null);
  const [evaluacionRealizada, setEvaluacionRealizada] = useState(false);
  const [incorrectas, setIncorrectas] = useState([]);

  useEffect(() => {
    const obtenerEvaluaciones = async () => {
      try {
        const userId = localStorage.getItem('userId'); // Obtén el userId desde el localStorage
        const response = await axios.get('http://localhost:3001/api/evaluaciones');
        const evaluacionData = response.data[0]; // Asume que obtienes un arreglo y tomas el primer elemento
        setEvaluacionId(evaluacionData._id);
        
        // Verificar si la evaluación ya ha sido realizada
        const userResponse = await axios.get(`http://localhost:3001/api/usuarios/${userId}`);
        const evaluacionRealizada = userResponse.data.evaluaciones_realizadas.find(evaluacion => evaluacion.tema_id === evaluacionData._id);

        if (evaluacionRealizada) {
          setCalificacion(evaluacionRealizada.calificacion);
          setEvaluacionRealizada(true);
          const respuestasGuardadas = evaluacionRealizada.preguntas_respondidas.map((pregunta) => pregunta.respuesta);
          setRespuestas(respuestasGuardadas);
          setPreguntas(evaluacionData.evaluacion);
          setMostrarResultados(true); // Asegúrate de mostrar los resultados
        } else {
          setPreguntas(evaluacionData.evaluacion);
          setRespuestas(Array(evaluacionData.evaluacion.length).fill(null));
        }
      } catch (error) {
        console.error('Error al obtener las evaluaciones:', error);
      }
    };

    obtenerEvaluaciones();
  }, []);

  const handleOptionChange = (index, opcion) => {
    const nuevasRespuestas = [...respuestas];
    nuevasRespuestas[index] = opcion;
    setRespuestas(nuevasRespuestas);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMostrarResultados(true);
    const [calificacion, incorrectas, respuestasConDetalle] = calcularResultados();
    const userId = localStorage.getItem('userId'); // Obtén el userId desde el localStorage

    try {
      await axios.post(`http://localhost:3001/api/usuarios/${userId}/evaluaciones`, {
        evaluacionId,
        calificacion,
        respuestas: respuestasConDetalle
      });
      setIncorrectas(incorrectas);
      setCalificacion(calificacion);
      console.log('Calificación guardada exitosamente');
    } catch (error) {
      console.error('Error al guardar la calificación:', error);
    }
  };

  const calcularResultados = () => {
    let correctas = 0;
    let incorrectas = [];
    const respuestasConDetalle = preguntas.map((pregunta, index) => {
      const correcta = respuestas[index] === pregunta.respuesta_correcta;
      if (correcta) {
        correctas++;
      } else {
        incorrectas.push(index);
      }
      return { pregunta: pregunta.pregunta, respuesta: respuestas[index], correcta };
    });
    const calificacion = (correctas / preguntas.length) * 100;
    return [calificacion, incorrectas, respuestasConDetalle];
  };

  const obtenerColorRespuesta = (index, opcion) => {
    if (!mostrarResultados && !evaluacionRealizada) return '';
    if (respuestas[index] === opcion) {
      return opcion === preguntas[index].respuesta_correcta ? 'has-text-success' : 'has-text-danger';
    }
    return '';
  };

  return (
    <div className="section" style={{ minHeight: '100vh' }}>
      <div className="container">
        <div className="columns is-centered">
          <div className="column is-half">
            <div className="box" style={{ padding: '2rem', boxShadow: '0px 0px 10px 0px rgba(0, 255, 0, 0.5)', borderColor: 'green', borderWidth: '2px', borderStyle: 'solid', backgroundColor: '#333' }}>
              <h1 className="title has-text-white has-text-centered">Evaluación sobre Creación de Videojuegos</h1>
              <form onSubmit={handleSubmit}>
                {preguntas.map((pregunta, index) => (
                  <div key={index} className="box" style={{ marginBottom: '1.5rem', backgroundColor: '#444', borderColor: 'green', borderWidth: '1px', borderStyle: 'solid' }}>
                    <h2 className="subtitle has-text-white">{pregunta.pregunta}</h2>
                    {pregunta.opciones.map((opcion) => (
                      <div key={opcion} className="field">
                        <div className="control">
                          <label className={`radio ${obtenerColorRespuesta(index, opcion)}`}>
                            <input
                              type="radio"
                              name={`pregunta-${index}`}
                              value={opcion}
                              onChange={() => handleOptionChange(index, opcion)}
                              disabled={mostrarResultados || evaluacionRealizada}
                              checked={respuestas[index] === opcion}
                              style={{ marginRight: '0.5rem' }}
                            />
                            {opcion}
                          </label>
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
                {!mostrarResultados && !evaluacionRealizada && (
                  <div className="has-text-centered">
                    <button type="submit" className="button is-dark is-medium" style={{ backgroundColor: '#444', borderColor: 'green', borderWidth: '2px', borderStyle: 'solid' }}>
                      Enviar Respuestas
                    </button>
                  </div>
                )}
              </form>
              {mostrarResultados && (
                <div className="box" style={{ backgroundColor: '#444', borderColor: 'green', borderWidth: '1px', borderStyle: 'solid' }}>
                  <h2 className="subtitle has-text-white has-text-centered">Resultados</h2>
                  <p className="has-text-white has-text-centered">Has obtenido un {calificacion}%.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Evaluacion;
