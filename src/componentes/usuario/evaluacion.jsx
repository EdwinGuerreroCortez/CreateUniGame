import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import "bulma/css/bulma.min.css";
import '@fortawesome/fontawesome-free/css/all.min.css'; // Import Font Awesome

const Evaluacion = () => {
  const { temaId } = useParams();
  const navigate = useNavigate();
  const [preguntas, setPreguntas] = useState([]);
  const [preguntaActual, setPreguntaActual] = useState(null);
  const [respuestaSeleccionada, setRespuestaSeleccionada] = useState(null);
  const [mostrarResultados, setMostrarResultados] = useState(false);
  const [respuestas, setRespuestas] = useState([]);
  const [numeroPregunta, setNumeroPregunta] = useState(0);
  const [examenPermitido, setExamenPermitido] = useState(false);
  const [examenRealizado, setExamenRealizado] = useState(false);
  const [zoomFactor, setZoomFactor] = useState(1.0); // Estado para controlar el factor de zoom de la imagen
  const [offsetX, setOffsetX] = useState(0); // Estado para controlar el desplazamiento X de la imagen
  const [offsetY, setOffsetY] = useState(0); // Estado para controlar el desplazamiento Y de la imagen
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [startY, setStartY] = useState(0);
  const [modalActivo, setModalActivo] = useState(false);
  const [inspeccionando, setInspeccionando] = useState(false);
  const [respuestasAnteriores, setRespuestasAnteriores] = useState([]); // Estado para las respuestas anteriores

  const userId = localStorage.getItem('userId');

  useEffect(() => {
    const fetchEvaluacion = async () => {
      try {
        const examenResponse = await fetch(`http://localhost:3001/api/examenes/${userId}/${temaId}`);
        if (examenResponse.status === 200) {
          const examenData = await examenResponse.json();
          console.log('Examen encontrado:', examenData);

          if (examenData.examenPermitido) {
            setExamenPermitido(true);
          } else {
            setExamenPermitido(false);
            setExamenRealizado(true);
            setRespuestas(examenData.preguntasRespondidas[examenData.preguntasRespondidas.length - 1].respuestas); // Mostrar las respuestas del último intento
            setMostrarResultados(true);
          }
        } else if (examenResponse.status === 404) {
          setExamenPermitido(true);
        }

        if (examenPermitido) {
          const response = await fetch(`http://localhost:3001/api/evaluaciones/${temaId}?limit=10`);
          const data = await response.json();
          if (data.evaluacion) {
            setPreguntas(data.evaluacion);
            setPreguntaActual(data.evaluacion[0]);
          }
        }
      } catch (error) {
        console.error('Error al cargar la evaluación:', error);
      }
    };
    fetchEvaluacion();
  }, [temaId, userId, examenPermitido]);

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

    if (numeroPregunta < preguntas.length - 1) {
      setNumeroPregunta(numeroPregunta + 1);
      setPreguntaActual(preguntas[numeroPregunta + 1]);
      setRespuestaSeleccionada(null);
      resetZoomAndOffset(); // Restablecer el zoom y el desplazamiento al cambiar de pregunta
    } else {
      guardarResultados(nuevasRespuestas);
      setMostrarResultados(true);
    }
  };

  const resetZoomAndOffset = () => {
    setZoomFactor(1.0);
    setOffsetX(0);
    setOffsetY(0);
  };

  const guardarResultados = async (respuestas) => {
    const porcentaje = (respuestas.filter(respuesta => respuesta.correcta).length / preguntas.length) * 100;
    console.log("Guardando resultados...", { temaId, porcentaje, preguntasRespondidas: respuestas });

    try {
      const examenResponse = await fetch(`http://localhost:3001/api/examenes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          usuarioId: userId,
          temaId,
          porcentaje,
          preguntasRespondidas: respuestas,
          fecha: new Date() // Enviar la fecha actual
        }),
      });

      if (!examenResponse.ok) {
        throw new Error('Error al guardar el examen.');
      }

      const examenData = await examenResponse.json();
      const examenId = examenData.examen._id; // Obtener el ID del examen creado

      await fetch(`http://localhost:3001/api/usuarios/${userId}/evaluaciones`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          examen_id: examenId, // Añadir el ID del examen
        }),
      });

      console.log("Resultados guardados exitosamente.");
    } catch (error) {
      console.error('Error al guardar los resultados:', error);
    }
  };

  const cargarUltimasRespuestas = async () => {
    try {
      const examenResponse = await fetch(`http://localhost:3001/api/examenes/${userId}/${temaId}/ultimo`);
      if (examenResponse.ok) {
        const examenData = await examenResponse.json();
        console.log('Últimas respuestas encontradas:', examenData);
        const ultimaRespuesta = examenData.preguntasRespondidas[0]; // Obtener el primer elemento del arreglo ordenado
        setRespuestasAnteriores(ultimaRespuesta.respuestas); // Guardar las respuestas del último intento en el estado
        setModalActivo(true); // Mostrar el modal con las respuestas
      } else {
        console.error('Error al cargar las últimas respuestas.');
      }
    } catch (error) {
      console.error('Error al cargar las últimas respuestas:', error);
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

  const getImagenPath = (imagen) => {
    return `${process.env.PUBLIC_URL}/imagenes/${imagen}`;
  };

  const renderResultados = () => {
    return (
      <div className="box" style={{ backgroundColor: '#14161A', borderColor: 'green', borderWidth: '1px', borderStyle: 'solid' }}>
        <h2 className="subtitle has-text-white has-text-centered">Resultados</h2>
        <p className="has-text-white has-text-centered">Has acertado {calcularResultados()} de {preguntas.length} preguntas.</p>
        <p className="has-text-white has-text-centered">Porcentaje de aciertos: {(calcularResultados() / preguntas.length * 100).toFixed(2)}%</p>
        <div className="has-text-centered" style={{ marginTop: '1rem' }}>
          <button className="button is-dark is-medium" style={{ backgroundColor: '#224df7', borderColor: 'green', borderWidth: '2px', borderStyle: 'solid' }} onClick={cargarUltimasRespuestas}>
            Inspeccionar
          </button>
          <button className="button is-dark is-medium" style={{ marginLeft: '1rem', backgroundColor: '#224df7', borderColor: 'green', borderWidth: '2px', borderStyle: 'solid' }} onClick={() => navigate('/user/curso')}>
            Volver al curso
          </button>
        </div>
      </div>
    );
  };

  const renderInspeccion = () => {
    return (
      <div>
        <h2 className="subtitle has-text-white has-text-centered">Inspección del Examen</h2>
        <div>
          {respuestasAnteriores.map((respuesta, index) => (
            <div key={index} className="box" style={{
              backgroundColor: respuesta.correcta ? 'green' : 'red', 
              marginBottom: '10px'
            }}>
              <p className="has-text-white">
                <strong>Pregunta:</strong> {respuesta.pregunta}
              </p>
              <p className="has-text-white">
                <strong>Tu respuesta:</strong> {respuesta.respuesta}
              </p>
            </div>
          ))}
        </div>
        <div className="has-text-centered" style={{ marginTop: '1rem' }}>
          <button className="button is-dark is-medium" style={{ backgroundColor: '#224df7', borderColor: 'green', borderWidth: '2px', borderStyle: 'solid' }} onClick={() => setModalActivo(false)}>
            Cerrar
          </button>
        </div>
      </div>
    );
  };

  const startDragging = (e) => {
    setIsDragging(true);
    setStartX(e.clientX - offsetX);
    setStartY(e.clientY - offsetY);
  };

  const onDragging = (e) => {
    if (isDragging) {
      setOffsetX(e.clientX - startX);
      setOffsetY(e.clientY - startY);
    }
  };

  const stopDragging = () => {
    setIsDragging(false);
  };

  const toggleModal = () => {
    setModalActivo(!modalActivo);
  };

  return (
    <div className="section" style={{ minHeight: '100vh', backgroundColor: '#14161A' }}>
      <div className="container">
        <div className="columns is-centered">
          <div className="column">
            <div className="box is-fullwidth" style={{ boxShadow: '0px 0px 10px 0px rgba(0, 255, 0, 0.5)', borderColor: 'green', backgroundColor: '#021929' }}>
              <h1 className="title has-text-white has-text-centered">Evaluación</h1>
              {examenPermitido && !examenRealizado ? (
                <div className="columns">
                  <div className="column">
                    <h2 className="subtitle has-text-white has-text-centered">Pregunta {numeroPregunta + 1} de {preguntas.length}</h2>
                    {preguntaActual && !mostrarResultados && (
                      <form onSubmit={handleSubmit}>
                        <div className="box" style={{ marginBottom: '1.5rem', backgroundColor: '#14161A', borderColor: 'green', borderWidth: '1px', borderStyle: 'solid' }}>
                          <h2 className="subtitle has-text-white">{preguntaActual.pregunta}</h2>

                          <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                            <div style={{ flex: '1' }}>
                              <div style={{ marginTop: '1rem' }}>
                                <p className="title has-text-white is-size-5">Escoge tu respuesta:</p>
                                {preguntaActual.opciones && preguntaActual.opciones.map((opcion, index) => (
                                  <div key={index} className="field">
                                    <div className="control">
                                      <label className="radio has-text-white">
                                        <input
                                          type="radio"
                                          name={`pregunta`}
                                          value={opcion}
                                          onChange={() => handleOptionChange(opcion)}
                                          checked={respuestaSeleccionada === opcion}
                                          disabled={mostrarResultados}
                                          style={{ marginRight: '0.5rem' }}
                                        />
                                        {opcion}
                                      </label>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {preguntaActual.imagen && (
                              <div style={{ flex: '1', marginLeft: '2rem', position: 'relative' }}>
                                <div
                                  className=" is-flex is-justify-content-center is-align-items-center"
                                  style={{
                                    width: '100%',
                                    height: '300px',
                                    overflow: 'hidden',
                                    position: 'relative',
                                    border: '2px solid #333',  // Borde gris oscuro
                                  }}
                                >
                                  <img
                                    src={getImagenPath(preguntaActual.imagen)}
                                    alt="Imagen de la pregunta"
                                    style={{
                                      position: 'absolute',
                                      transform: `scale(${zoomFactor}) translate(${offsetX}px, ${offsetY}px)`,
                                      transformOrigin: 'center center',
                                      transition: 'transform 0.2s ease-in-out',
                                      cursor: isDragging ? 'grabbing' : 'grab',
                                      userSelect: 'none'
                                    }}
                                    onMouseDown={startDragging}
                                    onMouseMove={onDragging}
                                    onMouseUp={stopDragging}
                                    onMouseLeave={stopDragging}
                                    onDragStart={(e) => e.preventDefault()} // Evitar el arrastre de la imagen por defecto
                                    onClick={toggleModal} // Abrir modal al hacer clic en la imagen
                                  />
                                </div>
                                {modalActivo && (
                                  <div className="modal is-active">
                                    <div className="modal-background" onClick={toggleModal}></div>
                                    <div className="modal-content">
                                      <p className="image is-4by3">
                                        <img src={getImagenPath(preguntaActual.imagen)} alt="Imagen de la pregunta" />
                                      </p>
                                    </div>
                                    <button className="modal-close is-large" aria-label="close" onClick={toggleModal}></button>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>

                          <div className="has-text-centered" style={{ marginTop: '2rem' }}>
                            <button
                              type="submit"
                              className="button is-dark is-medium"
                              style={{ backgroundColor: '#224df7', borderColor: 'green', borderWidth: '2px', borderStyle: 'solid' }}
                              disabled={!respuestaSeleccionada}
                            >
                              {numeroPregunta < preguntas.length - 1 ? 'Siguiente Pregunta' : 'Ver Resultados'}
                            </button>
                          </div>
                        </div>
                      </form>
                    )}
                    {mostrarResultados && !inspeccionando && renderResultados()}
                  </div>
                </div>
              ) : (
                examenRealizado ? (
                  <div className="box" style={{ backgroundColor: '#14161A', borderColor: 'green', borderWidth: '1px', borderStyle: 'solid' }}>
                    <h2 className="subtitle has-text-white has-text-centered">Ya has respondido este examen</h2>
                    <div className="has-text-centered" style={{ marginTop: '1rem' }}>
                      <button className="button is-dark is-medium" style={{ backgroundColor: '#224df7', borderColor: 'green', borderWidth: '2px', borderStyle: 'solid' }} onClick={cargarUltimasRespuestas}>
                        Inspeccionar respuestas
                      </button>
                      <button className="button is-dark is-medium" style={{ marginLeft: '1rem', backgroundColor: '#224df7', borderColor: 'green', borderWidth: '2px', borderStyle: 'solid' }} onClick={() => navigate('/user/curso')}>
                        Volver al curso
                      </button>
                      <p className="has-text-white" style={{ marginTop: '1rem' }}>Si deseas volver a contestar el examen, comunícate con tu docente.</p>
                    </div>
                  </div>
                ) : (
                  <div className="box" style={{ backgroundColor: '#14161A', borderColor: 'green', borderWidth: '1px', borderStyle: 'solid' }}>
                    <h2 className="subtitle has-text-white has-text-centered">El examen no está activado</h2>
                    <div className="has-text-centered" style={{ marginTop: '1rem' }}>
                      <button className="button is-dark is-medium" style={{ backgroundColor: '#224df7', borderColor: 'green', borderWidth: '2px', borderStyle: 'solid' }} onClick={() => navigate('/user/curso')}>
                        Volver al curso
                      </button>
                      <p className="has-text-white" style={{ marginTop: '1rem' }}>Si tienes alguna duda, comunícate con tu docente.</p>
                    </div>
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      </div>
      {modalActivo && (
        <div className={`modal ${modalActivo ? 'is-active' : ''}`}>
          <div className="modal-background" onClick={toggleModal}></div>
          <div className="modal-content">
            {renderInspeccion()}
          </div>
          <button className="modal-close is-large" aria-label="close" onClick={toggleModal}></button>
        </div>
      )}
    </div>
  );
};

export default Evaluacion;
