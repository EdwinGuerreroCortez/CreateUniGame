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
  const [modalActivo, setModalActivo] = useState(false); // Estado para controlar el modal
  const [imagenModal, setImagenModal] = useState(''); // Estado para la URL de la imagen en el modal

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
    } else {
      setMostrarResultados(true);
      guardarResultados(nuevasRespuestas);
    }
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

  // Función para abrir el modal y mostrar la imagen
  const abrirModal = (imagen) => {
    setImagenModal(imagen);
    setModalActivo(true);
  };

  // Función para cerrar el modal
  const cerrarModal = () => {
    setModalActivo(false);
    setImagenModal('');
  };

  return (
    <div className="section" style={{ minHeight: '100vh', backgroundColor: '#14161A' }}>
      <div className="container">
        <div className="columns is-centered">
          <div className="column">
            <div className="box is-fullwidth" style={{ boxShadow: '0px 0px 10px 0px rgba(0, 255, 0, 0.5)', borderColor: 'green', backgroundColor: '#021929' }}>
              <h1 className="title has-text-white has-text-centered">Evaluación</h1>
              {examenPermitido ? (
                <>
                  <h2 className="subtitle has-text-white has-text-centered">Pregunta {numeroPregunta + 1} de {preguntas.length}</h2>
                  {preguntaActual && !mostrarResultados && (
                    <form onSubmit={handleSubmit}>
                      <div className="box" style={{ marginBottom: '1.5rem', backgroundColor: '#14161A', borderColor: 'green', borderWidth: '1px', borderStyle: 'solid' }}>
                        <h2 className="subtitle has-text-white">{preguntaActual.pregunta}</h2>
                        {preguntaActual.imagen && (
                          <>
                            <figure
                              className={`image is-centered`}
                              style={{ maxWidth: '500px', margin: '0 auto', cursor: 'pointer' }}
                              onClick={() => abrirModal(getImagenPath(preguntaActual.imagen))}
                              data-tooltip="Dar clic"
                            >
                              <img
                                src={getImagenPath(preguntaActual.imagen)}
                                alt="Imagen de la pregunta"
                                style={{ maxWidth: '100%', height: 'auto', objectFit: 'contain' }}
                                 
                              />
                            </figure>
                            <div  style={{ marginTop: '1rem' }}>
                              <a  data-tooltip="Descargar imagen" href={getImagenPath(preguntaActual.imagen)} download className="button is-primary">
                                <span className="icon" >
                                  <i className="fas fa-download"></i>
                                </span>
                              </a>
                            </div>
                          </>
                        )}

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
                        <button className="button is-dark is-medium" style={{ backgroundColor: '#224df7', borderColor: 'green', borderWidth: '2px', borderStyle: 'solid' }} onClick={() => navigate('/user/curso')}>
                          Volver al curso
                        </button>
                      </div>
                    </div>
                  )}
                </>
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

     {/* Modal para mostrar la imagen */}
{modalActivo && (
  <div className={`modal ${modalActivo ? 'is-active' : ''}`}>
    <div className="modal-background" onClick={cerrarModal}></div>
    <div className="modal-content" style={{ height: '500px', width: '900px' }}>
      <p className="image">
        <img src={imagenModal} style={{ height: '500px',  width: '900px' }} alt="Imagen ampliada" />
      </p>
    </div>
    <button className="modal-close is-large" aria-label="close" onClick={cerrarModal}></button>
  </div>
)}

    </div>
  );
};

export default Evaluacion;