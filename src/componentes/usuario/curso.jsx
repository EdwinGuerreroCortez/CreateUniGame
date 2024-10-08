import React, { useState, useEffect } from "react";
import "bulma/css/bulma.min.css";
import "../CSS/carga.css";
import base64 from 'base-64';
import { useNavigate } from "react-router-dom";

const Curso = () => {
  const [paginaActualCursos, setPaginaActualCursos] = useState(1);
  const [paginaActualTemas, setPaginaActualTemas] = useState(1);
  const [temaSeleccionado, setTemaSeleccionado] = useState(null);
  const [mostrarTemas, setMostrarTemas] = useState(false);
  const [temas, setTemas] = useState([]);
  const [pasoActual, setPasoActual] = useState(-1);
  const [cursoFinalizado, setCursoFinalizado] = useState(false);
  const [evaluacionHabilitada, setEvaluacionHabilitada] = useState(false);
  const [cursos, setCursos] = useState([]); // Cursos obtenidos del backend
  const temasPorPagina = 6;
  const cursosPorPagina = 2;
  const [cursoSeleccionado, setCursoSeleccionado] = useState(null);
  const [subtemaSeleccionado, setSubtemaSeleccionado] = useState(null);
  const [mostrarRecursos, setMostrarRecursos] = useState(false);
  const [showSubscriptionPrompt, setShowSubscriptionPrompt] = useState(false);
  const [subscriptionMessage, setSubscriptionMessage] = useState("");
  const [isBanned, setIsBanned] = useState(false);
  const [isLoadingTemas, setIsLoadingTemas] = useState(false);
  const [cargandoTemas, setCargandoTemas] = useState(false);
  const [busqueda, setBusqueda] = useState("");

  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");

  const fetchCursosSuscritos = async () => {
    try {
      const response = await fetch(`http://localhost:3001/api/usuarios/${userId}/cursos-suscritos`);
      const data = await response.json();
      setCursos(data.cursos);
    } catch (error) {
      console.error("Error al cargar los cursos suscritos:", error);
    }
  };

  useEffect(() => {
    fetchCursosSuscritos();
  }, []);


  const handleBusqueda = (e) => {
    setBusqueda(e.target.value);
  };

  const cursosFiltrados = cursos.filter(curso =>
    curso.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  const verificarSiBaneado = async (cursoId) => {
    try {
      const response = await fetch(`http://localhost:3001/api/usuarios/${userId}/verificar-suscripcion/${cursoId}`, {
        method: 'POST'
      });
      const data = await response.json();
      if (response.status === 403) {
        setIsBanned(true);
        setSubscriptionMessage(data.message);
        return true; // Usuario baneado
      } else {
        setIsBanned(false);
        setSubscriptionMessage(data.message);
        return false; // Usuario no baneado
      }
    } catch (error) {
      console.error("Error al verificar suscripción y baneo:", error);
      return true; // En caso de error, asumimos que el usuario no puede acceder
    }
  };

  const fetchTemasDelCurso = async (cursoId) => {
    const isUserBanned = await verificarSiBaneado(cursoId);
    if (isUserBanned) return; // No continuar si el usuario está baneado

    setCargandoTemas(true); // Activar estado de carga
    const delay = new Promise(resolve => setTimeout(resolve, 2000));
    try {
      const response = await fetch(`http://localhost:3001/api/cursos/${cursoId}/temas`);
      const data = await response.json();
      setTemas(data); // Actualiza el estado con los temas obtenidos
      setCursoSeleccionado(cursos.find(curso => curso._id === cursoId)); // Selecciona el curso
    } catch (error) {
      console.error("Error al cargar los temas del curso:", error);
    } finally {
      // Esperar a que pasen 2 segundos antes de desactivar el estado de carga
      await delay;
      setCargandoTemas(false); // Desactivar estado de carga
    }
  };


  const regresarACursos = () => {
    setCursoSeleccionado(null);
    setTemaSeleccionado(null);
    setSubtemaSeleccionado(null);
    setMostrarRecursos(false);
    setSubscriptionMessage(""); // Clear the subscription message when returning to the courses
  };

  const regresarATemas = () => {
    setSubtemaSeleccionado(null);
    setMostrarRecursos(false);
  };

  const verificarEvaluacion = async (temaId) => {
    try {
      const evaluacionResponse = await fetch(`http://localhost:3001/api/tema-evaluacion/${temaId}`);
      if (!evaluacionResponse.ok) {
        throw new Error(`HTTP error! status: ${evaluacionResponse.status}`);
      }
      const evaluacionData = await evaluacionResponse.json();


      if (evaluacionData && evaluacionData.evaluacion_habilitada !== undefined) {
        if (temaId === evaluacionData._id) {
          setEvaluacionHabilitada(evaluacionData.evaluacion_habilitada);
        }
      } else {
        console.error("La evaluación recibida no tiene la estructura esperada:", evaluacionData);
      }
    } catch (error) {
      console.error("Error al verificar la evaluación:", error);
    }
  };

  useEffect(() => {
    let intervalId;
    if (temaSeleccionado) {
      verificarEvaluacion(temaSeleccionado._id);
      intervalId = setInterval(() => {
        verificarEvaluacion(temaSeleccionado._id);
      }, 1000); // Actualiza cada segundo
    } else {
      setEvaluacionHabilitada(false);
    }
    return () => clearInterval(intervalId); // Limpiar el intervalo cuando el componente se desmonte o temaSeleccionado cambie
  }, [temaSeleccionado]);

  const cambiarPaginaTemas = (numeroPagina) => {
    setPaginaActualTemas(numeroPagina);
    setTemaSeleccionado(null);
    setSubtemaSeleccionado(null);
    setMostrarRecursos(false);
  };

  const cambiarPaginaCursos = (numeroPagina) => {
    setPaginaActualCursos(numeroPagina);
    setCursoSeleccionado(null);
    setTemaSeleccionado(null);
    setSubtemaSeleccionado(null);
    setMostrarRecursos(false);
  };

  const seleccionarTema = (tema) => {
    setTemaSeleccionado(tema);
    setPasoActual(-1);
    setCursoFinalizado(false);
    setMostrarTemas(false);
    setSubtemaSeleccionado(null);
    setMostrarRecursos(false);
  };

  const seleccionarSubtema = (subtema) => {
    setSubtemaSeleccionado(subtema);
    setMostrarRecursos(false);
  };

  const mostrarRecursosDelTema = () => {
    setMostrarRecursos(true);
    setSubtemaSeleccionado(null);
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
      setPasoActual(pasoActual - 1);
    }
  };

  const handleEvaluationClick = async () => {
    const userId = localStorage.getItem("userId");
    try {
      const response = await fetch(`http://localhost:3001/api/usuarios/${userId}`);
      const userData = await response.json();
      const evaluacionRealizada = userData.evaluaciones_realizadas.find(
        (evaluacion) => evaluacion.tema_id === temaSeleccionado._id
      );

      const encodedTemaId = base64.encode(temaSeleccionado._id);

      if (evaluacionRealizada) {
        navigate(`/user/evaluacion/${encodedTemaId}`, {
          state: { mostrarResultados: true },
        });
      } else {
        const userConfirmed = window.confirm("¿Desea responder la siguiente evaluación?");
        if (userConfirmed) {
          navigate(`/user/evaluacion/${encodedTemaId}`);
        }
      }
    } catch (error) {
      console.error("Error al verificar la evaluación realizada:", error);
    }
  };

  const renderVideo = (videoUrl) => {
    if (!videoUrl) {
      return <p>No hay video disponible.</p>;
    }

    const youtubeRegex =
      /(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const match = videoUrl.match(youtubeRegex);

    if (match && match[1]) {
      const videoId = match[1];
      return (
        <iframe
          key={videoId}
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
  const cursosActuales = cursosFiltrados.slice(indicePrimerCurso, indiceUltimoCurso);
  const totalPaginasCursos = Math.ceil(cursosFiltrados.length / cursosPorPagina);


  return (
    <div className="section has-background-black-bis">
      <div className="container">
        <div className="columns">
          <div className="column is-one-quarter">
            {!cursoSeleccionado ? (
              <div
                className="box tema-panel"
                style={{
                  background: "rgb(4 18 28)",
                  boxShadow: "0px 0px 10px 0px rgba(255,255,255,0.5)",
                  marginTop: "20px",
                }}
              >
                <h2 className="title is-4 has-text-white is-centered">Cursos Suscritos</h2>

                {/* Campo de búsqueda */}
                <div className="field">
                  <div className="control has-icons-left">
                    <input
                      className="input is-small is-primary"
                      type="text"
                      value={busqueda}
                      onChange={handleBusqueda}
                      placeholder="Buscar curso..."
                      style={{
                        background: "#FFFFFF",
                        color: "#333333",
                        borderColor: "#004080", // Color del borde mejorado
                        borderWidth: "2px", // Bordes más gruesos
                        borderRadius: "8px", // Bordes redondeados
                      }}
                    />
                    <span className="icon is-small is-left" style={{ color: "#004080" }}> {/* Color del icono mejorado */}
                      <i className="fas fa-search"></i>
                    </span>
                  </div>
                </div>

                <div>
                  {cursosActuales.map((curso) => (
                    <div
                      key={curso._id}
                      className="box"
                      style={{
                        cursor: "pointer",
                        backgroundColor: "#00274d", // Fondo oscuro navy
                        color: "#ffffff", // Texto blanco
                        borderRadius: "8px", // Bordes redondeados
                        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)", // Sombra de la tarjeta
                        transition: "transform 0.2s ease, box-shadow 0.2s ease", // Transiciones suaves
                        marginTop: "20px",
                        padding: "20px",
                        textAlign: "left",
                      }}
                      onClick={() => fetchTemasDelCurso(curso._id)}
                      onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                      onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                    >
                      <div className="menu-label has-text-white" style={{ cursor: "pointer" }}>
                        <span className="title has-text-white is-size-6">{curso.nombre}</span>
                      </div>
                    </div>

                  ))}
                  <nav className="pagination is-centered" role="navigation" aria-label="pagination">
                    <ul className="pagination-list">
                      {[...Array(totalPaginasCursos)].map((_, i) => (
                        <li key={i}>
                          <a
                            className={`pagination-link ${paginaActualCursos === i + 1 ? "is-current" : ""}`}
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
                      <i className="fas fa-chevron-left" style={{ marginRight: "8px" }}></i>
                      Ocultar Temas
                    </span>
                  ) : (
                    <span>
                      <i className="fas fa-chevron-right" style={{ marginRight: "8px" }}></i>
                      Mostrar Temas
                    </span>
                  )}
                </button>
                <div
                  className={`box tema-panel ${mostrarTemas ? "is-active" : ""}`}
                  style={{
                    background: "rgb(4 18 28)",
                    boxShadow: "0px 0px 10px 0px rgba(255,255,255,0.5)",
                    marginTop: "20px",
                    position: "relative",
                    minHeight: "200px",
                  }}
                >
                  <button
                    className="button is-link"
                    onClick={subtemaSeleccionado || mostrarRecursos ? regresarATemas : regresarACursos}
                    style={{ position: "absolute", top: "10px", left: "10px" }}
                    data-tooltip="Regresar"
                  >
                    <i className="fas fa-arrow-left"></i>
                  </button>
                  <h2 className="title is-4 has-text-white is-centered">Temas</h2>
                  {cargandoTemas ? (
                    <div className="has-text-centered" style={{ paddingTop: "20px" }}>
                      <p className="title is-5 has-text-white">Cargando temas...</p>
                    </div>
                  ) : temas.length === 0 ? (
                    <div className="has-text-centered" style={{ paddingTop: "20px" }}>
                      <p className="title is-5 has-text-white">Temas no disponibles, comuníquese con su docente.</p>
                    </div>
                  ) : !temaSeleccionado ? (
                    temasActuales.map((tema) => (
                      <div
                        key={tema._id}
                        className="card"
                        style={{
                          cursor: "pointer",
                          marginBottom: "1rem",
                          marginTop: "20px",
                          backgroundColor: "#00274d", // Fondo oscuro navy
                          color: "#ffffff", // Texto blanco
                          borderRadius: "8px", // Bordes redondeados
                          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)", // Sombra de la tarjeta
                          transition: "transform 0.2s ease, box-shadow 0.2s ease", // Transiciones suaves
                        }}
                        onClick={() => seleccionarTema(tema)}
                        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                      >
                        <div className="card-content" style={{ padding: "20px" }} id="card_cc">
                          <p className="title is-4 has-text-white" style={{ fontSize: '1.2rem' }}>
                            <span style={{ fontSize: '1.5rem', marginRight: '10px' }}></span>
                            {tema.titulo}
                          </p>
                        </div>
                      </div>

                    ))
                  ) : (
                    <div>
                      <h3 className="title is-6 has-text-white">Tema principal:</h3>
                      <div
                        className="card"
                        style={{
                          cursor: "pointer",
                          marginBottom: "1rem",
                          marginTop: "20px",
                          backgroundColor: "#00274d", // Fondo navy oscuro
                          color: "#ffffff", // Texto blanco
                          borderRadius: "8px", // Bordes redondeados
                          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)", // Sombra de la tarjeta
                          padding: "15px", // Espaciado interior
                          transition: "background-color 0.3s ease, transform 0.3s ease", // Transiciones suaves
                          transform: "scale(1)", // Escala inicial
                        }}
                        onClick={() => seleccionarTema(temaSeleccionado)}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = "#004080"; // Color al pasar el ratón
                          e.currentTarget.style.transform = "scale(1.05)"; // Aumentar tamaño al pasar el ratón
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = "#00274d"; // Restaurar color
                          e.currentTarget.style.transform = "scale(1)"; // Restaurar tamaño
                        }}
                      >
                        <div className="card-content" id="card_cc">
                          <p className="title is-5 has-text-white" style={{ fontSize: '1.25rem', fontWeight: 'bold', padding:'2px' }}>
                            {temaSeleccionado.titulo}
                          </p>
                        </div>
                      </div>

                      {temaSeleccionado.subtemas.length > 0 && (
                        <div>
                          <h3 className="title is-6 has-text-white">Subtemas:</h3>
                          {temaSeleccionado.subtemas.map((subtema) => (
                            <div
                              key={subtema._id}
                              className="card"
                              style={{
                                cursor: "pointer",
                                marginBottom: "0.5rem",
                                marginTop: "10px", // Añadir margen superior para separación
                                backgroundColor: subtemaSeleccionado && subtemaSeleccionado._id === subtema._id ? "#007bff" : "#00274d", // Color azul o navy
                                color: "#ffffff", // Texto blanco
                                borderRadius: "8px", // Bordes redondeados
                                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)", // Sombra de la tarjeta
                                opacity: subtemaSeleccionado && subtemaSeleccionado._id === subtema._id ? 0.8 : 1, // Opacidad ajustada
                                transition: "background-color 0.3s ease, transform 0.3s ease", // Transiciones suaves
                                padding: '15px',
                              }}
                              onClick={() => seleccionarSubtema(subtema)}
                              onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'} // Efecto de escala al pasar el ratón
                              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'} // Restaurar escala
                            >
                              <div className="card-content" id="card_cc">
                                <p className="title is-6 has-text-white" style={{ fontSize: "1rem", fontWeight: "bold", padding: '2px' }}>
                                  {subtema.titulo}
                                </p>
                              </div>
                            </div>

                          ))}
                        </div>
                      )}
                      {temaSeleccionado.recursos.length > 0 && (
                        <div>
                          <br />
                          <h3 className="title is-6 has-text-white">Enlaces de Recursos:</h3>
                          <div
                            className="card"
                            style={{
                              cursor: "pointer",
                              marginBottom: "0.5rem",
                              backgroundColor: mostrarRecursos ? "#0056b3" : "#003366", 
                              borderRadius: "8px", // Bordes redondeados
                              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)", // Sombra de la tarjeta
                              opacity: mostrarRecursos ? 0.8 : 1, // Opacidad ajustada
                              transition: "background-color 0.3s ease, transform 0.3s ease", // Transiciones suaves
                            }}
                            onClick={mostrarRecursosDelTema}
                            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'} // Efecto de escala al pasar el ratón
                            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'} // Restaurar escala
                          >
                            <div className="card-content" style={{ padding: "1rem" }} id="card_cc">
                              <p className="title is-6 has-text-white" style={{ fontSize: "1rem", fontWeight: "bold",  padding:'2px' }}>
                                Recursos
                              </p>
                            </div>
                          </div>
                        </div>

                      )}
                    </div>
                  )}
                  {!temaSeleccionado && (
                    <nav className="pagination is-centered" role="navigation" aria-label="pagination">
                      <ul className="pagination-list">
                        {[...Array(totalPaginasTemas)].map((_, i) => (
                          <li key={i}>
                            <a
                              className={`pagination-link ${paginaActualTemas === i + 1 ? "is-current" : ""}`}
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
                background: "rgb(4 18 28)",
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
                className="title is-5 has-text-white"
                style={{ textAlign: "center" }}
              >
                Por favor, elige un curso y posteriormente el tema para ver más información
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
              <h3
                className="title is-6 has-text-white"
                style={{ textAlign: "center", marginTop: "10px" }}
              >
                Si no encuentra ningún curso, inscribase a nuestros diversos cursos
              </h3>
              {isBanned && (
                <div className="notification is-danger" style={{ marginTop: "20px" }}>
                  <button className="delete" onClick={() => setIsBanned(false)}></button>
                  {subscriptionMessage}
                </div>
              )}
            </div>
          )}
          {cursoSeleccionado && isBanned && (
            <div className="column is-three-quarters">
              <div
                className="notification is-danger"
                style={{
                  marginTop: "20px",
                }}
              >
                <button className="delete" onClick={() => setIsBanned(false)}></button>
                {subscriptionMessage}
              </div>
            </div>
          )}
          {cursoSeleccionado && !isBanned && temaSeleccionado && (
            <div className="column is-three-quarters">
              <div
                className="box has-text-white"
                style={{
                  background: "rgb(4 18 28)",
                  boxShadow: "0px 0px 10px 0px rgba(255,255,255,0.5)",
                  marginTop: "20px",
                }}
              >
                {!subtemaSeleccionado && !mostrarRecursos ? (
                  <>
                    <h2 className="title is-4 has-text-white">{temaSeleccionado.titulo}</h2>
                    <p className="is-size-6 has-text-grey-light">Autor: {temaSeleccionado.responsable}</p>
                    <p className="is-size-6 has-text-grey-light">
                      Fecha: {new Date(temaSeleccionado.fecha_creacion).toLocaleDateString()}
                    </p>

                    <br />
                    {renderVideo(temaSeleccionado.video)}
                    <h2 className="title is-3 has-text-centered has-text-grey-light">Descripción</h2>
                    <p>{temaSeleccionado.descripcion}</p>
                  </>
                ) : subtemaSeleccionado ? (
                  <>
                    <h2 className="title is-4 has-text-centered has-text-white">{subtemaSeleccionado.titulo}</h2>
                    <p>{subtemaSeleccionado.descripcion}</p>
                    {renderVideo(subtemaSeleccionado.video)}
                  </>
                ) : mostrarRecursos && (
                  <>
                    <h2 className="title is-4 has-text-centered has-text-white">Enlaces de Recursos:</h2>
                    <ul>
                      {temaSeleccionado.recursos.map((recurso) => (
                        <li key={recurso._id} style={{ marginBottom: "0.5rem" }}>
                          <p className="title is-6 has-text-white">· {recurso.titulo}</p>
                          <a
                            href={recurso.enlace}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="has-text-link"
                          >
                            {recurso.enlace}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </>

                )}
                {!subtemaSeleccionado && !mostrarRecursos && (
                  <>
                    {pasoActual === -1 ? (
                      <div className="has-text-centered" style={{ marginTop: "20px" }}>
                        <button className="button is-primary" onClick={siguientePaso}>
                          <span className="icon">
                            <i className="fas fa-play"></i>
                          </span>
                          <span>Comenzar Curso</span>
                        </button>
                      </div>
                    ) : cursoFinalizado ? (
                      <div className="has-text-centered" style={{ marginTop: "20px" }}>
                        <button
                          className="button is-primary"
                          onClick={async () => {
                            setCursoFinalizado(false);
                            setPasoActual(0);
                            setTemaSeleccionado(null); // Asegúrate de que no haya un tema seleccionado
                            setMostrarTemas(true); // Mostrar la sección de temas
                            if (cursoSeleccionado) {
                              await fetchTemasDelCurso(cursoSeleccionado._id); // Carga los temas del curso
                            }
                          }}
                        >
                          Finalizar Tema
                        </button>

                        {evaluacionHabilitada ? (
                          <>
                            <div
                              className="notification is-link is-light"
                              style={{
                                padding: "0.9rem 1rem",
                                fontSize: "0.9rem",
                                marginTop: "20px",
                              }}
                            >
                              <strong>Importante:</strong> Una vez terminado el curso, deberás contestar la siguiente evaluación para seguir con los demás temas.
                            </div>
                            <div className="control" style={{ marginTop: "10px" }}>
                              <button className="button is-link is-size-8 is-fullwidth" type="button" onClick={handleEvaluationClick}>
                                Responder Evaluación
                              </button>
                            </div>
                          </>
                        ) : (
                          <div
                            className="notification is-link is-light"
                            style={{
                              padding: "0.9rem 1rem",
                              fontSize: "0.9rem",
                              marginTop: "20px",
                            }}
                          >
                            <strong>Importante:</strong> El tema ha concluido o el examen no está disponible. Por favor, comuníquese con el docente si tiene alguna duda.
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="box has-background-dark p-5">
                        <div className="content">
                          <h3 className="subtitle is-5 has-text-white">
                            <strong style={{ color: 'white' }}>{pasoActual + 1}.- </strong> {temaSeleccionado.pasos[pasoActual].Titulo}
                          </h3>
                          <div className="ml-3">
                            <p>{temaSeleccionado.pasos[pasoActual].Descripcion}</p>
                          </div>
                        </div>
                        <div
                          className="buttons is-centered mt-5"
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                          }}
                        >
                          {pasoActual > 0 ? (
                            <>
                              <button className="button is-light" onClick={pasoAnterior}>
                                <span className="icon">
                                  <i className="fas fa-arrow-left"></i>
                                </span>
                                <span>Paso Anterior</span>
                              </button>
                              <button className="button is-primary" onClick={siguientePaso} style={{ marginLeft: "auto" }}>
                                <span>{pasoActual < temaSeleccionado.pasos.length - 1 ? "Siguiente Paso" : "Finalizar Curso"}</span>
                                <span className="icon">
                                  <i className="fas fa-arrow-right"></i>
                                </span>
                              </button>
                            </>
                          ) : (
                            <button className="button is-primary" onClick={siguientePaso} style={{ marginLeft: "auto" }}>
                              <span>{pasoActual < temaSeleccionado.pasos.length - 1 ? "Siguiente Paso" : "Finalizar Curso"}</span>
                              <span className="icon">
                                <i className="fas fa-arrow-right"></i>
                              </span>
                            </button>
                          )}
                        </div>
                      </div>
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
