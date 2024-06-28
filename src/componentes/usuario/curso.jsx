import React, { useState, useEffect } from "react";
import "bulma/css/bulma.min.css";
import "../CSS/carga.css";
import { useNavigate } from "react-router-dom";

const Curso = () => {
  const [paginaActualCursos, setPaginaActualCursos] = useState(1);
  const [paginaActualTemas, setPaginaActualTemas] = useState(1);
  const [temaSeleccionado, setTemaSeleccionado] = useState(null);
  const [mostrarTemas, setMostrarTemas] = useState(false);
  const [temas, setTemas] = useState([]);
  const [pasoActual, setPasoActual] = useState(-1); // -1 para la introducción
  const [cursoFinalizado, setCursoFinalizado] = useState(false);
  const [evaluacionHabilitada, setEvaluacionHabilitada] = useState(false); // Estado para la habilitación de la evaluación
  const [cursos, setCursos] = useState([]); // Estado para almacenar los cursos desde el backend
  const temasPorPagina = 6;
  const cursosPorPagina = 2; // Ajusta este valor según la cantidad de cursos que quieras mostrar por página
  const [cursoSeleccionado, setCursoSeleccionado] = useState(null);
  const [subtemaSeleccionado, setSubtemaSeleccionado] = useState(null); // Estado para el subtema seleccionado

  const navigate = useNavigate();

  // Función para obtener los cursos desde el backend
  const fetchCursos = async () => {
    try {
      const response = await fetch("http://localhost:3001/api/cursos");
      const data = await response.json();
      setCursos(data);
    } catch (error) {
      console.error("Error al cargar los cursos:", error);
    }
  };

  useEffect(() => {
    fetchCursos();
  }, []);

  // Función para obtener los temas del curso seleccionado
  const fetchTemasDelCurso = async (cursoId) => {
    try {
      const response = await fetch(
        `http://localhost:3001/api/cursos/${cursoId}/temas`
      );
      const data = await response.json();
      setTemas(data);
    } catch (error) {
      console.error("Error al cargar los temas del curso:", error);
    }
  };

  const seleccionarCurso = (curso) => {
    setCursoSeleccionado(curso);
    fetchTemasDelCurso(curso._id);
    setTemas([]);
  };

  const regresarACursos = () => {
    setCursoSeleccionado(null);
    setTemaSeleccionado(null);
    setSubtemaSeleccionado(null); // Limpiar el subtema seleccionado al regresar
  };

  const regresarATemas = () => {
    setSubtemaSeleccionado(null); // Limpiar solo el subtema seleccionado al regresar
  };

  // Obtiene el userId desde localStorage
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const verificarEvaluacion = async () => {
      if (temaSeleccionado && temaSeleccionado._id) {
        try {
          const evaluacionResponse = await fetch(
            `http://localhost:3001/api/tema-evaluacion/${temaSeleccionado._id}`
          );
          const evaluacionData = await evaluacionResponse.json();

          if (
            evaluacionData &&
            evaluacionData.evaluacion_habilitada !== undefined
          ) {
            console.log("Evaluación habilitada:", evaluacionData.evaluacion_habilitada);

            if (temaSeleccionado._id === evaluacionData._id) {
              setEvaluacionHabilitada(evaluacionData.evaluacion_habilitada);
            }
          } else {
            console.error(
              "La evaluación recibida no tiene la estructura esperada:",
              evaluacionData
            );
          }
        } catch (error) {
          console.error("Error al verificar la evaluación:", error);
        }
      } else {
        setEvaluacionHabilitada(false);
      }
    };

    verificarEvaluacion();
  }, [temaSeleccionado]);

  const cambiarPaginaTemas = (numeroPagina) => {
    setPaginaActualTemas(numeroPagina);
    setTemaSeleccionado(null);
    setSubtemaSeleccionado(null); // Limpiar el subtema seleccionado al cambiar de página
  };

  const cambiarPaginaCursos = (numeroPagina) => {
    setPaginaActualCursos(numeroPagina);
    setCursoSeleccionado(null);
    setTemaSeleccionado(null);
    setSubtemaSeleccionado(null); // Limpiar el subtema seleccionado al cambiar de página
  };

  const seleccionarTema = (tema) => {
    setTemaSeleccionado(tema);
    setPasoActual(-1);
    setCursoFinalizado(false);
    setMostrarTemas(false); // Ocultar el panel de temas en móviles al seleccionar un tema
    setSubtemaSeleccionado(null); // Limpiar el subtema seleccionado al seleccionar un tema
  };

  const seleccionarSubtema = (subtema) => {
    setSubtemaSeleccionado(subtema);
  };

  const siguientePaso = () => {
    if (pasoActual < temaSeleccionado.pasos.length - 1) {
      setPasoActual(pasoActual + 1);
    } else {
      setCursoFinalizado(true);
    }
  };

  const pasoAnterior = () => {
    if (pasoActual > -1) {
      setPasoActual(pasoAnterior - 1);
    }
  };

  const handleEvaluationClick = async () => {
    try {
      const response = await fetch(`http://localhost:3001/api/usuarios/${userId}`);
      const userData = await response.json();
      const evaluacionRealizada = userData.evaluaciones_realizadas.find(
        (evaluacion) => evaluacion.tema_id === temaSeleccionado._id
      );

      if (evaluacionRealizada) {
        navigate(`/user/evaluacion/${temaSeleccionado._id}`, {
          state: { mostrarResultados: true },
        });
      } else {
        const userConfirmed = window.confirm(
          "¿Desea responder la siguiente evaluación?"
        );
        if (userConfirmed) {
          navigate(`/user/evaluacion/${temaSeleccionado._id}`);
        }
      }
    } catch (error) {
      console.error("Error al verificar la evaluación realizada:", error);
    }
  };

  const renderVideo = (videoUrl) => {
    if (!videoUrl) {
      return <p>No hay video disponible.</p>; // Mensaje opcional si no hay video disponible
    }

    const youtubeRegex =
      /(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const match = videoUrl.match(youtubeRegex);

    if (match && match[1]) {
      const videoId = match[1];
      return (
        <iframe
          key={videoId} // Añade una clave única basada en el ID del video
          width="100%"
          height="400"
          src={`https://www.youtube.com/embed/${videoId}`}
          frameBorder="0"
          allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          title="Video"
          style={{ marginBottom: "20px" }}
        ></iframe>
      );
    } else {
      return (
        <video
          key={videoUrl}
          width="100%"
          controls
          style={{ marginBottom: "20px" }}
        >
          <source src={videoUrl} type="video/mp4" />
          Tu navegador no soporta el video.
        </video>
      );
    }
  };

  const indiceUltimoTema = paginaActualTemas * temasPorPagina;
  const indicePrimerTema = indiceUltimoTema - temasPorPagina;
  const temasActuales = temas.slice(indicePrimerTema, indiceUltimoTema);
  const totalPaginasTemas = Math.ceil(temas.length / temasPorPagina);

  const indiceUltimoCurso = paginaActualCursos * cursosPorPagina;
  const indicePrimerCurso = indiceUltimoCurso - cursosPorPagina;
  const cursosActuales = cursos.slice(indicePrimerCurso, indiceUltimoCurso); // Utiliza cursos obtenidos del backend
  const totalPaginasCursos = Math.ceil(cursos.length / cursosPorPagina);

  return (
    <div className="section has-background-black-bis">
      <div className="container">
        <div className="columns">
          <div className="column is-one-quarter">
            {!cursoSeleccionado ? (
              <div
                className="box tema-panel"
                style={{
                  background: "rgb(2, 25, 41)",
                  boxShadow: "0px 0px 10px 0px rgba(255,255,255,0.5)",
                  marginTop: "20px",
                }}
              >
                <h2 className="title is-4 has-text-white is-centered">Cursos</h2>
                <div>
                  {cursosActuales.map((curso) => (
                    <div
                      key={curso._id}
                      className="box"
                      style={{
                        cursor: "pointer",
                        backgroundColor: "navy",
                        marginTop: "20px",
                      }}
                      onClick={() => seleccionarCurso(curso)}
                    >
                      <div
                        className="menu-label has-text-white"
                        style={{ cursor: "pointer" }}
                      >
                        <span className="title has-text-white is-size-6">
                          {curso.nombre}
                        </span>
                      </div>
                    </div>
                  ))}
                  <nav
                    className="pagination is-centered"
                    role="navigation"
                    aria-label="pagination"
                  >
                    <ul className="pagination-list">
                      {[...Array(totalPaginasCursos)].map((_, i) => (
                        <li key={i}>
                          <a
                            className={`pagination-link ${
                              paginaActualCursos === i + 1 ? "is-current" : ""
                            }`}
                            onClick={() => cambiarPaginaCursos(i + 1)}
                          >
                            {i + 1}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </nav>
                </div>
              </div>
            ) : (
              <div>
                <button
                  className="button is-primary tema-panel-button"
                  onClick={() => setMostrarTemas(!mostrarTemas)}
                >
                  {mostrarTemas ? (
                    <span>
                      <i
                        className="fas fa-chevron-left"
                        style={{ marginRight: "8px" }}
                      ></i>
                      Ocultar Temas
                    </span>
                  ) : (
                    <span>
                      <i
                        className="fas fa-chevron-right"
                        style={{ marginRight: "8px" }}
                      ></i>
                      Mostrar Temas
                    </span>
                  )}
                </button>
                <div
                  className={`box tema-panel ${mostrarTemas ? "is-active" : ""}`}
                  style={{
                    background: "rgb(2, 25, 41)",
                    boxShadow: "0px 0px 10px 0px rgba(255,255,255,0.5)",
                    marginTop: "20px",
                    position: "relative",
                  }}
                >
                  <button
                    className="button is-link"
                    onClick={subtemaSeleccionado ? regresarATemas : regresarACursos}
                    style={{ position: "absolute", top: "10px", left: "10px" }}
                    data-tooltip="Regresar"
                  >
                    <i className="fas fa-arrow-left"></i>
                  </button>
                  <h2 className="title is-4 has-text-white is-centered">Temas</h2>
                  {!temaSeleccionado ? (
                    temasActuales.map((tema) => (
                      <div
                        key={tema._id}
                        className="card"
                        style={{
                          cursor: "pointer",
                          marginBottom: "1rem",
                          marginTop: "20px",
                          backgroundColor: "navy",
                          opacity: 1,
                        }}
                        onClick={() => seleccionarTema(tema)}
                      >
                        <div className="card-content">
                          <p className="title is-5 has-text-white">{tema.titulo}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div>
                      <div
                        className="card"
                        style={{
                          cursor: "pointer",
                          marginBottom: "1rem",
                          marginTop: "20px",
                          backgroundColor: "navy",
                          opacity: 1,
                          padding: "5px", // Hacer la tarjeta de tema más pequeña
                        }}
                        onClick={() => seleccionarTema(temaSeleccionado)} // Permitir volver a seleccionar el tema
                      >
                        <div className="card-content" style={{ padding: "0.5rem" }}>
                          <p className="title is-5 has-text-white">
                            {temaSeleccionado.titulo}
                          </p>
                        </div>
                      </div>
                      {temaSeleccionado.subtemas.length > 0 && (
                        <div>
                          <h3 className="title is-6 has-text-white">Subtemas</h3>
                          {temaSeleccionado.subtemas.map((subtema) => (
                            <div
                              key={subtema._id}
                              className="card"
                              style={{
                                cursor: "pointer",
                                marginBottom: "0.5rem",
                                backgroundColor:
                                  subtemaSeleccionado &&
                                  subtemaSeleccionado._id === subtema._id
                                    ? "blue"
                                    : "navy",
                                opacity:
                                  subtemaSeleccionado &&
                                  subtemaSeleccionado._id === subtema._id
                                    ? 0.5
                                    : 1,
                                padding: "5px", // Hacer las tarjetas de subtemas más pequeñas
                              }}
                              onClick={() => seleccionarSubtema(subtema)}
                            >
                              <div
                                className="card-content"
                                style={{ padding: "0.5rem" }}
                              >
                                <p className="title is-6 has-text-white">
                                  {subtema.titulo}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                  {!temaSeleccionado && (
                    <nav
                      className="pagination is-centered"
                      role="navigation"
                      aria-label="pagination"
                    >
                      <ul className="pagination-list">
                        {[...Array(totalPaginasTemas)].map((_, i) => (
                          <li key={i}>
                            <a
                              className={`pagination-link ${
                                paginaActualTemas === i + 1 ? "is-current" : ""
                              }`}
                              onClick={() => cambiarPaginaTemas(i + 1)}
                            >
                              {i + 1}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </nav>
                  )}
                </div>
              </div>
            )}
          </div>
          {!cursoSeleccionado && (
            <div
              className="box has-text-white"
              style={{
                background: "rgb(2, 25, 41)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                height: "400px",
                boxShadow: "0px 0px 10px 0px rgba(255,255,255,0.5)",
                marginTop: "30px",
              }}
            >
              <h2
                className="title is-4 has-text-white"
                style={{ textAlign: "center" }}
              >
                Por favor, elige un curso y posteriormente el tema para ver más
                información
              </h2>
              <div
                aria-label="Orange and tan hamster running in a metal wheel"
                role="img"
                className="wheel-and-hamster"
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <div className="wheel"></div>
                <div className="hamster">
                  <div className="hamster__body">
                    <div className="hamster__head">
                      <div className="hamster__ear"></div>
                      <div className="hamster__eye"></div>
                      <div className="hamster__nose"></div>
                    </div>
                    <div className="hamster__limb hamster__limb--fr"></div>
                    <div className="hamster__limb hamster__limb--fl"></div>
                    <div className="hamster__limb hamster__limb--br"></div>
                    <div className="hamster__limb hamster__limb--bl"></div>
                    <div className="hamster__tail"></div>
                  </div>
                </div>
                <div className="spoke"></div>
              </div>
            </div>
          )}
          {cursoSeleccionado && temaSeleccionado && (
            <div className="column is-three-quarters">
              <div
                className="box has-text-white"
                style={{
                  background: "rgb(2, 25, 41)",
                  boxShadow: "0px 0px 10px 0px rgba(255,255,255,0.5)",
                  marginTop: "20px",
                }}
              >
                {!subtemaSeleccionado ? (
                  <>
                    <h2 className="title is-4 has-text-white">
                      {temaSeleccionado.titulo}
                    </h2>
                    <p className="is-size-6">Autor: {temaSeleccionado.responsable}</p>
                    <p className="is-size-6">
                      Fecha:{" "}
                      {new Date(temaSeleccionado.fecha_creacion).toLocaleDateString()}
                    </p>
                    {renderVideo(temaSeleccionado.video)}
                    <h2 className="title is-3 has-text-centered has-text-white">
                      Descripción
                    </h2>
                    <p>{temaSeleccionado.descripcion}</p>
                  </>
                ) : (
                  <>
                    <h2 className="title is-4 has-text-centered has-text-white">
                      {subtemaSeleccionado.titulo}
                    </h2>
                    <p>{subtemaSeleccionado.descripcion}</p>
                    {renderVideo(subtemaSeleccionado.video)}
                  </>
                )}
                {!subtemaSeleccionado && (
                  <>
                    {pasoActual === -1 ? (
                      <div className="has-text-centered" style={{ marginTop: "20px" }}>
                        <button className="button is-primary" onClick={siguientePaso}>
                          Empezar Curso
                        </button>
                      </div>
                    ) : cursoFinalizado ? (
                      <div className="has-text-centered" style={{ marginTop: "20px" }}>
                        <button
                          className="button is-primary"
                          onClick={() => {
                            setCursoFinalizado(false);
                            setPasoActual(0);
                          }}
                        >
                          Finalizar Curso
                        </button>
                        <div
                          className="notification is-link is-light"
                          style={{
                            padding: "0.9rem 1rem",
                            fontSize: "0.9rem",
                            marginTop: "20px",
                          }}
                        >
                          <strong>Importante:</strong> Una vez terminado el curso,
                          deberás contestar la siguiente evaluación para seguir con los
                          demás temas.
                        </div>
                        <div className="control" style={{ marginTop: "10px" }}>
                          <button
                            className="button is-link is-size-8 is-fullwidth"
                            type="button"
                            onClick={handleEvaluationClick}
                            disabled={!evaluacionHabilitada} // Deshabilita el botón si la evaluación no está habilitada
                          >
                            Responder Evaluación
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <h2 className="title is-4 has-text-centered has-text-white">
                          Pasos
                        </h2>
                        <div className="content">
                          <h3 className="subtitle is-5 has-text-white">
                            Paso {pasoActual + 1}:{" "}
                            {temaSeleccionado.pasos[pasoActual].Titulo}
                          </h3>
                          <p>{temaSeleccionado.pasos[pasoActual].Descripcion}</p>
                        </div>
                        <div
                          className="has-text-centered"
                          style={{
                            marginTop: "20px",
                            display: "flex",
                            justifyContent: "space-between",
                          }}
                        >
                          {pasoActual > 0 && (
                            <button
                              className="button is-light"
                              onClick={pasoAnterior}
                              style={{ marginRight: "10px" }}
                            >
                              Paso Anterior
                            </button>
                          )}
                          <button
                            className="button is-primary"
                            onClick={siguientePaso}
                          >
                            {pasoActual < temaSeleccionado.pasos.length - 1
                              ? "Siguiente Paso"
                              : "Finalizar Curso"}
                          </button>
                        </div>
                      </>
                    )}
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Curso;
