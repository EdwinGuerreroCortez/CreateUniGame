import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import "bulma/css/bulma.min.css";

const Evaluacion = () => {
  const { temaId } = useParams();
  const navigate = useNavigate();
  const [preguntas, setPreguntas] = useState([]);
  const [preguntaActual, setPreguntaActual] = useState(null);
  const [respuestaSeleccionada, setRespuestaSeleccionada] = useState(null);
  const [mostrarResultados, setMostrarResultados] = useState(false);
  const [respuestas, setRespuestas] = useState([]);
  const [numeroPregunta, setNumeroPregunta] = useState(0);

  const userId = localStorage.getItem('userId');

  useEffect(() => {
    const fetchEvaluacion = async () => {
      try {
        const response = await fetch(`http://localhost:3001/api/evaluaciones/${temaId}?limit=10`);
        const data = await response.json();
        if (data.evaluacion) {
          setPreguntas(data.evaluacion);
          setPreguntaActual(data.evaluacion[0]);
        }
      } catch (error) {
        console.error('Error al cargar la evaluación:', error);
      }
    };
    fetchEvaluacion();
  }, [temaId]);

  const handleOptionChange = (opcion) => {
    setRespuestaSeleccionada(opcion);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const nuevasRespuestas = [...respuestas, {
      pregunta: preguntaActual.pregunta,
      respuesta: respuestaSeleccionada,
      correcta: respuestaSeleccionada === preguntaActual.respuesta_correcta,
    }];
    setRespuestas(nuevasRespuestas);
    setRespuestaSeleccionada(null);

    if (numeroPregunta < preguntas.length - 1) {
      setNumeroPregunta(numeroPregunta + 1);
      setPreguntaActual(preguntas[numeroPregunta + 1]);
    } else {
      setMostrarResultados(true);
      guardarResultados(nuevasRespuestas);
    }
  };

  const guardarResultados = async (respuestas) => {
    const calificacion = respuestas.filter(respuesta => respuesta.correcta).length;
    try {
      await fetch(`http://localhost:3001/api/usuarios/${userId}/evaluaciones`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          temaId,
          calificacion,
          preguntasRespondidas: respuestas,
        }),
      });
    } catch (error) {
      console.error('Error al guardar los resultados:', error);
    }
  };

  const calcularResultados = () => {
    let correctas = 0;
    respuestas.forEach(respuesta => {
      if (respuesta.correcta) {
        correctas++;
      }
    });
    return correctas;
  };

  return (
    <div className="section" style={{ minHeight: '100vh', backgroundColor: '#14161A' }}>
      <div className="container">
        <div className="columns is-centered">
          <div className="column is-full-mobile is-half-tablet is-one-third-desktop">
            <div className="box" style={{ padding: '2rem', boxShadow: '0px 0px 10px 0px rgba(0, 255, 0, 0.5)', borderColor: 'green', borderWidth: '2px', borderStyle: 'solid', backgroundColor: '#021929' }}>
              <h1 className="title has-text-white has-text-centered">Evaluación</h1>
              <h2 className="subtitle has-text-white has-text-centered">Pregunta {numeroPregunta + 1} de {preguntas.length}</h2>
              {preguntaActual && !mostrarResultados && (
                <form onSubmit={handleSubmit}>
                  <div className="box" style={{ marginBottom: '1.5rem', backgroundColor: '#14161A', borderColor: 'green', borderWidth: '1px', borderStyle: 'solid' }}>
                    <h2 className="subtitle has-text-white">{preguntaActual.pregunta}</h2>
                    {preguntaActual.opciones.map((opcion, index) => (
                      <div key={index} className="field">
                        <div className="control">
                          <label className="radio has-text-white">
                            <input
                              type="radio"
                              name={`pregunta`}
                              value={opcion}
                              onChange={() => handleOptionChange(opcion)}
                              disabled={mostrarResultados}
                              style={{ marginRight: '0.5rem' }}
                            />
                            {opcion}
                          </label>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="has-text-centered">
                    <button
                      type="submit"
                      className="button is-dark is-medium"
                      style={{ backgroundColor: '#224df7', borderColor: 'green', borderWidth: '2px', borderStyle: 'solid' }}
                      disabled={!respuestaSeleccionada}
                    >
                      {numeroPregunta < preguntas.length - 1 ? 'Siguiente Pregunta' : 'Ver Resultados'}
                    </button>
                  </div>      
                </form>
              )}
              {mostrarResultados && (
                <div className="box" style={{ backgroundColor: '#14161A', borderColor: 'green', borderWidth: '1px', borderStyle: 'solid' }}>
                  <h2 className="subtitle has-text-white has-text-centered">Resultados</h2>
                  <p className="has-text-white has-text-centered">Has acertado {calcularResultados()} de {preguntas.length} preguntas.</p>
                  <p className="has-text-white has-text-centered">Porcentaje de aciertos: {(calcularResultados() / preguntas.length * 100).toFixed(2)}%</p>
                  <div className="has-text-centered" style={{ marginTop: '1rem' }}>
                    <button className="button is-dark is-medium" style={{ backgroundColor: '#224df7', borderColor: 'green', borderWidth: '2px', borderStyle: 'solid' }} onClick={() => navigate('/curso')}>
                      Volver al curso
                    </button>
                  </div>
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
