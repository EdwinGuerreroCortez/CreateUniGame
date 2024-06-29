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
  const [zoomFactor, setZoomFactor] = useState(1.0); // Estado para controlar el factor de zoom de la imagen
  const [offsetX, setOffsetX] = useState(0); // Estado para controlar el desplazamiento X de la imagen
  const [offsetY, setOffsetY] = useState(0); // Estado para controlar el desplazamiento Y de la imagen
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [startY, setStartY] = useState(0);

  const userId = localStorage.getItem('userId');

  useEffect(() => {
    const fetchEvaluacion = async () => {
      try {
        // Verificar si el usuario ya ha realizado el examen
        const examenResponse = await fetch(`http://localhost:3001/api/examenes/${userId}/${temaId}`);
        if (examenResponse.status === 200) {
          const examenData = await examenResponse.json();

          if (examenData.examenPermitido) {
            setExamenPermitido(true);
          } else {
            setExamenPermitido(false);
          }
        } else if (examenResponse.status === 404) {
          // Si no hay examen previo, permitir realizar el examen
          setExamenPermitido(true);
        }

        if (examenPermitido) {
          // Cargar las preguntas del examen
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
      setMostrarResultados(true);
      guardarResultados(nuevasRespuestas);
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
      // Guardar en la colección de usuarios
      await fetch(`http://localhost:3001/api/usuarios/${userId}/evaluaciones`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          temaId,
          porcentaje,
          preguntasRespondidas: respuestas,
        }),
      });

      // Guardar en la colección de exámenes
      await fetch(`http://localhost:3001/api/examenes`, {
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

      console.log("Resultados guardados exitosamente.");
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

  // Funciones para arrastrar la imagen
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

  // Modal para mostrar imagen en tamaño completo
  const [modalActivo, setModalActivo] = useState(false);

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
              {examenPermitido ? (
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
                    {mostrarResultados && (
                      <div className="box" style={{ backgroundColor: '#14161A', borderColor: 'green', borderWidth: '1px', borderStyle: 'solid' }}>
                        <h2 className="subtitle has-text-white has-text-centered">Resultados</h2>
                        <p className="has-text-white has-text-centered">Has acertado {calcularResultados()} de {preguntas.length} preguntas.</p>
                        <p className="has-text-white has-text-centered">Porcentaje de aciertos: {(calcularResultados() / preguntas.length * 100).toFixed(2)}%</p>
                        <div className="has-text-centered" style={{ marginTop: '1rem' }}>
                          <button className="button is-dark is-medium" style={{ backgroundColor: '#224df7', borderColor: 'green', borderWidth: '2px', borderStyle: 'solid' }} onClick={() => navigate('/user/curso')}>
                            Volver al curso
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="box" style={{ backgroundColor: '#14161A', borderColor: 'green', borderWidth: '1px', borderStyle: 'solid' }}>
                  <h2 className="subtitle has-text-white has-text-centered">No puedes realizar esta evaluación</h2>
                  <div className="has-text-centered" style={{ marginTop: '1rem' }}>
                    <button className="button is-dark is-medium" style={{ backgroundColor: '#224df7', borderColor: 'green', borderWidth: '2px', borderStyle: 'solid' }} onClick={() => navigate('/user/curso')}>
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
