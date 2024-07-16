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
  const [tiempoRestante, setTiempoRestante] = useState(7200); // Tiempo inicial de 2 horas (7200 segundos)

  const userId = localStorage.getItem('userId');

  useEffect(() => {
    const storedPreguntas = JSON.parse(localStorage.getItem(`preguntas-${temaId}`));
    const storedNumeroPregunta = parseInt(localStorage.getItem(`numeroPregunta-${temaId}`));
    const storedRespuestas = JSON.parse(localStorage.getItem(`respuestas-${temaId}`));
    const storedTiempoRestante = parseInt(localStorage.getItem(`tiempoRestante-${temaId}`));
    const startTime = localStorage.getItem(`startTime-${temaId}`);

    const fetchEvaluacion = async () => {
      try {
        const examenResponse = await fetch(`http://172.16.19.1:3001/api/examenes/${userId}/${temaId}`);
        if (examenResponse.status === 200) {
          const examenData = await examenResponse.json();
          

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
          if (storedPreguntas) {
            setPreguntas(storedPreguntas);
            setPreguntaActual(storedPreguntas[storedNumeroPregunta || 0]);
            if (storedNumeroPregunta) {
              setNumeroPregunta(storedNumeroPregunta);
            }
            if (storedRespuestas) {
              setRespuestas(storedRespuestas);
            }
            if (storedTiempoRestante && startTime) {
              const elapsedTime = Math.floor((Date.now() - new Date(startTime)) / 1000);
              const newTiempoRestante = storedTiempoRestante - elapsedTime;
              setTiempoRestante(newTiempoRestante > 0 ? newTiempoRestante : 0);
            }
          } else {
            const response = await fetch(`http://172.16.19.1:3001/api/evaluaciones/${temaId}?limit=10`);
            const data = await response.json();
            if (data.evaluacion) {
              const preguntasAleatorias = data.evaluacion.sort(() => 0.5 - Math.random()).slice(0, 10);
              setPreguntas(preguntasAleatorias);
              setPreguntaActual(preguntasAleatorias[0]);
              localStorage.setItem(`preguntas-${temaId}`, JSON.stringify(preguntasAleatorias));
            }
          }
        }
      } catch (error) {
        console.error('Error al cargar la evaluación:', error);
      }
    };
    fetchEvaluacion();
  }, [temaId, userId, examenPermitido]);

  useEffect(() => {
    if (tiempoRestante > 0) {
      const timer = setTimeout(() => {
        setTiempoRestante(tiempoRestante - 1);
        localStorage.setItem(`tiempoRestante-${temaId}`, tiempoRestante - 1);
        localStorage.setItem(`startTime-${temaId}`, new Date().toISOString());
      }, 1000);

      return () => clearTimeout(timer);
    } else if (!mostrarResultados) {
      finalizarExamen();
    }
  }, [tiempoRestante]);

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
      const nuevoNumeroPregunta = numeroPregunta + 1;
      setNumeroPregunta(nuevoNumeroPregunta);
      setPreguntaActual(preguntas[nuevoNumeroPregunta]);
      setRespuestaSeleccionada(null);
      resetZoomAndOffset(); // Restablecer el zoom y el desplazamiento al cambiar de pregunta
    } else {
      finalizarExamen(nuevasRespuestas);
    }

    localStorage.setItem(`respuestas-${temaId}`, JSON.stringify(nuevasRespuestas));
    localStorage.setItem(`numeroPregunta-${temaId}`, numeroPregunta + 1);
  };

  const resetZoomAndOffset = () => {
    setZoomFactor(1.0);
    setOffsetX(0);
    setOffsetY(0);
  };

  const finalizarExamen = (respuestasFinalizadas = respuestas) => {
    const respuestasCompletadas = respuestasFinalizadas.map((respuesta, index) => ({
      ...respuesta,
      correcta: respuesta.correcta !== undefined ? respuesta.correcta : false,
    }));

    const preguntasNoRespondidas = preguntas.slice(respuestasCompletadas.length).map(pregunta => ({
      pregunta: pregunta.pregunta,
      respuesta: null,
      correcta: false,
    }));

    const respuestasFinales = [...respuestasCompletadas, ...preguntasNoRespondidas];
    guardarResultados(respuestasFinales);
    setMostrarResultados(true);
  };

  const guardarResultados = async (respuestas) => {
    const porcentaje = (respuestas.filter(respuesta => respuesta.correcta).length / preguntas.length) * 100;
    

    try {
      const examenResponse = await fetch(`http://172.16.19.1:3001/api/examenes`, {
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

      await fetch(`http://172.16.19.1:3001/api/usuarios/${userId}/evaluaciones`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          examen_id: examenId, // Añadir el ID del examen
        }),
      });

      
      localStorage.removeItem(`preguntas-${temaId}`);
      localStorage.removeItem(`numeroPregunta-${temaId}`);
      localStorage.removeItem(`respuestas-${temaId}`);
      localStorage.removeItem(`tiempoRestante-${temaId}`);
      localStorage.removeItem(`startTime-${temaId}`);
    } catch (error) {
      console.error('Error al guardar los resultados:', error);
    }
  };

  const cargarUltimasRespuestas = async () => {
    try {
      const examenResponse = await fetch(`http://172.16.19.1:3001/api/examenes/${userId}/${temaId}/ultimo`);
      if (examenResponse.ok) {
        const examenData = await examenResponse.json();
        
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

  // Función para hacer zoom in en la imagen
  const zoomIn = () => {
    const maxZoom = 5; // Máximo factor de zoom permitido
    if (zoomFactor < maxZoom) {
      setZoomFactor(prevZoom => prevZoom * 1.2); // Aumenta el factor de zoom en un 20%
    }
  };

  // Función para hacer zoom out en la imagen
  const zoomOut = () => {
    const minZoom = 0.5; // Mínimo factor de zoom permitido
    if (zoomFactor > minZoom) {
      setZoomFactor(prevZoom => prevZoom / 1.2); // Reduce el factor de zoom en un 20%
    }
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

  // Función para formatear el tiempo en hh:mm:ss
  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
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
                    <div className="is-flex is-justify-content-space-between">
                      <h2 className="subtitle has-text-white">Pregunta {numeroPregunta + 1} de {preguntas.length}</h2>
                      <h2 className="subtitle has-text-white">Tiempo restante: {formatTime(tiempoRestante)}</h2>
                    </div>
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

      {/* Botones de zoom */}
      <div className="has-text-centered mt-3">
        <button className="button is-primary is-small mr-2" onClick={zoomIn}>
          <span className="icon">
            <i className="fas fa-search-plus"></i>
          </span>
          <span>Zoom In</span>
        </button>
        <button className="button is-primary is-small" onClick={zoomOut}>
          <span className="icon">
            <i className="fas fa-search-minus"></i>
          </span>
          <span>Zoom Out</span>
        </button>
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
