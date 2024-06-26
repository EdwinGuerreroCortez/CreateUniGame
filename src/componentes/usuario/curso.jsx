import React, { useState, useEffect } from "react";
import "bulma/css/bulma.min.css";
import '../CSS/carga.css';
import { useNavigate } from 'react-router-dom';

const courses = [
  { id: 1, name: 'Programación'},
  { id: 2, name: 'Matemáticas' },
  // Agrega más cursos si es necesario
];

const Curso = () => {
  const [paginaActualCursos, setPaginaActualCursos] = useState(1);
  const [paginaActualTemas, setPaginaActualTemas] = useState(1);
  const [temaSeleccionado, setTemaSeleccionado] = useState(null);
  const [mostrarTemas, setMostrarTemas] = useState(false);
  const [temas, setTemas] = useState([]);
  const [pasoActual, setPasoActual] = useState(-1); // -1 para la introducción
  const [cursoFinalizado, setCursoFinalizado] = useState(false);
  const [evaluacionHabilitada, setEvaluacionHabilitada] = useState(false); // Estado para la habilitación de la evaluación
  const temasPorPagina = 6;
  const cursosPorPagina = 2; // Ajusta este valor según la cantidad de cursos que quieras mostrar por página
  const [cursoActual, setCursoActual] = useState(null);
  const [cursoSeleccionado, setCursoSeleccionado] = useState(null);
  
  const navigate = useNavigate();

  const seleccionarCurso = (curso) => {
    setCursoSeleccionado(curso);
  };

  const regresarACursos = () => {
    setCursoSeleccionado(null);
    setTemaSeleccionado(null);
  };

  // Obtiene el userId desde localStorage
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    const fetchTemas = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/temas'); // Actualiza la URL según sea necesario
        const data = await response.json();
        const temasHabilitados = data.filter(tema => tema.habilitado);
        setTemas(temasHabilitados);
      } catch (error) {
        console.error('Error al cargar los temas:', error);
      }
    };

    fetchTemas();
  }, []);

  useEffect(() => {
    const verificarEvaluacion = async () => {
      if (temaSeleccionado && temaSeleccionado._id) {
        try {
          const evaluacionResponse = await fetch(`http://localhost:3001/api/tema-evaluacion/${temaSeleccionado._id}`);
          const evaluacionData = await evaluacionResponse.json();
          console.log('Evaluación habilitada:', evaluacionData.evaluacion_habilitada); // Log para verificar el estado de habilitación
          setEvaluacionHabilitada(evaluacionData.evaluacion_habilitada);
          setTemaSeleccionado(evaluacionData);
        } catch (error) {
          console.error('Error al verificar la evaluación:', error);
        }
      }
    };

    verificarEvaluacion();
  }, [temaSeleccionado]);

  const indiceUltimoTema = paginaActualTemas * temasPorPagina;
  const indicePrimerTema = indiceUltimoTema - temasPorPagina;
  const temasActuales = temas.slice(indicePrimerTema, indiceUltimoTema);
  const totalPaginasTemas = Math.ceil(temas.length / temasPorPagina);

  const seleccionarTema = (tema) => {
    setTemaSeleccionado(tema);
    setPasoActual(-1);
    setCursoFinalizado(false);
    setMostrarTemas(false); // Ocultar el panel de temas en móviles al seleccionar un tema
  };

  const cambiarPaginaTemas = (numeroPagina) => {
    setPaginaActualTemas(numeroPagina);
    setTemaSeleccionado(null); // Deseleccionar tema al cambiar de página
  };

  const cambiarPaginaCursos = (numeroPagina) => {
    setPaginaActualCursos(numeroPagina);
    setCursoSeleccionado(null); // Deseleccionar curso al cambiar de página
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
    try {
      const response = await fetch(`http://localhost:3001/api/usuarios/${userId}`);
      const userData = await response.json();
      const evaluacionRealizada = userData.evaluaciones_realizadas.find(evaluacion => evaluacion.tema_id === temaSeleccionado._id);

      if (evaluacionRealizada) {
        navigate(`/user/evaluacion/${temaSeleccionado._id}`, { state: { mostrarResultados: true } });
      } else {
        const userConfirmed = window.confirm("¿Desea responder la siguiente evaluación?");
        if (userConfirmed) {
          navigate(`/user/evaluacion/${temaSeleccionado._id}`);
        }
      }
    } catch (error) {
      console.error('Error al verificar la evaluación realizada:', error);
    }
  };

  const renderVideo = (videoUrl) => {
    const youtubeRegex = /(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
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
          style={{ marginBottom: '20px' }}
        ></iframe>
      );
    } else {
      return (
        <video key={videoUrl} width="100%" controls style={{ marginBottom: '20px' }}>
          <source src={videoUrl} type="video/mp4" />
          Tu navegador no soporta el video.
        </video>
      );
    }
  };

  const indiceUltimoCurso = paginaActualCursos * cursosPorPagina;
  const indicePrimerCurso = indiceUltimoCurso - cursosPorPagina;
  const cursosActuales = courses.slice(indicePrimerCurso, indiceUltimoCurso);
  const totalPaginasCursos = Math.ceil(courses.length / cursosPorPagina);

  return (
    <div className="section has-background-black-bis">
      <div className="container">
        <div className="columns">
          <div className="column is-one-quarter">
            {!cursoSeleccionado ? (
              <div className="box tema-panel" style={{ background: 'rgb(2, 25, 41)', boxShadow: '0px 0px 10px 0px rgba(255,255,255,0.5)', marginTop:'20px' }}>
                <h2 className="title is-4 has-text-white is-centered">Cursos</h2>
                <div>
                  {cursosActuales.map((curso) => (
                    <div
                      key={curso.id}
                      className="box"
                      style={{ cursor: "pointer", backgroundColor: "navy", marginTop: "20px" }}
                      onClick={() => seleccionarCurso(curso)}
                    >
                      <div
                        className="menu-label has-text-white"
                        style={{ cursor: "pointer" }}
                      >
                        <span className="title has-text-white is-size-6">{curso.name}</span>
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
                      <i className="fas fa-chevron-left" style={{ marginRight: '8px' }}></i>
                      Ocultar Temas
                    </span>
                  ) : (
                    <span>
                      <i className="fas fa-chevron-right" style={{ marginRight: '8px' }}></i>
                      Mostrar Temas
                    </span>
                  )}
                </button>
                <div className={`box tema-panel ${mostrarTemas ? 'is-active' : ''}`} style={{ background: 'rgb(2, 25, 41)', boxShadow: '0px 0px 10px 0px rgba(255,255,255,0.5)', marginTop:'20px', position: 'relative' }}>
                  <button
                    className="button is-link "
                    onClick={() => regresarACursos()}
                    style={{ position: 'absolute', top: '10px', left: '10px' }}
                    data-tooltip="Cursos"
                  >
                    <i className="fas fa-arrow-left"></i>
                  </button>
                  <h2 className="title is-4 has-text-white is-centered">Temas</h2>
                  {temas.slice((paginaActualTemas - 1) * temasPorPagina, paginaActualTemas * temasPorPagina).map((tema) => (
                    <div
                      key={tema._id}
                      className="card"
                      style={{ 
                        cursor: "pointer", 
                        marginBottom: "1rem", 
                        marginTop: '20px',
                        backgroundColor: temaSeleccionado && temaSeleccionado._id === tema._id ? 'navy' : 'navy',
                        opacity: temaSeleccionado && temaSeleccionado._id === tema._id ? 0.5 : 1,
                      }}
                      onClick={() => setTemaSeleccionado(tema)}
                    >
                      <div className="card-content">
                        <p className="title is-5 has-text-white">{tema.titulo}</p>
                      </div>
                    </div>
                  ))}
                  <nav
                    className="pagination is-centered"
                    role="navigation"
                    aria-label="pagination"
                  >
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
                </div>
              </div>
            )}
          </div>
 

          <div className="column is-three-quarters">
            {temaSeleccionado ? (
              <div className="box has-text-white" style={{ background: 'rgb(2, 25, 41)' , boxShadow: '0px 0px 10px 0px rgba(255,255,255,0.5)',  marginTop:'20px'}}>
                <h2 className="title is-4 has-text-white">{temaSeleccionado.titulo}</h2>
                <p className="is-size-6">Autor: {temaSeleccionado.responsable}</p>
                <p className="is-size-6">Fecha: {new Date(temaSeleccionado.fecha_creacion).toLocaleDateString()}</p>
                {renderVideo(temaSeleccionado.video)}
                <h2 className="title is-3 has-text-centered has-text-white">Descripción</h2>
                <p>{temaSeleccionado.descripcion}</p>
                {pasoActual === -1 ? (
                  <div className="has-text-centered" style={{ marginTop: '20px' }}>
                    <button className="button is-primary" onClick={siguientePaso}>
                      Empezar Curso
                    </button>
                  </div>
                ) : cursoFinalizado ? (
                  <div className="has-text-centered" style={{ marginTop: '20px' }}>
                    <button
                      className="button is-primary"
                      onClick={() => {
                        setCursoFinalizado(false);
                        setPasoActual(0);
                      }}
                    >
                      Finalizar Curso
                    </button>
                    <div className="notification is-link is-light" style={{ padding: '0.9rem 1rem', fontSize: '0.9rem', marginTop: '20px' }}>
                      <strong>Importante:</strong> Una vez terminado el curso, deberás contestar la siguiente evaluación para seguir con los demás temas.
                    </div>
                    <div className="control" style={{ marginTop: '10px' }}>
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
                    <h2 className="title is-4 has-text-centered has-text-white">Pasos</h2>
                    <div className="content">
                      <h3 className="subtitle is-5 has-text-white">Paso {pasoActual + 1}: {temaSeleccionado.pasos[pasoActual].Titulo}</h3>
                      <p>{temaSeleccionado.pasos[pasoActual].Descripcion}</p>
                    </div>
                    <div className="has-text-centered" style={{ marginTop: '20px', display: 'flex', justifyContent: 'space-between' }}>
                      {pasoActual > 0 && (
                        <button className="button is-light" onClick={pasoAnterior} style={{ marginRight: '10px' }}>
                          Paso Anterior
                        </button>
                      )}
                      <button className="button is-primary" onClick={siguientePaso}>
                        {pasoActual < temaSeleccionado.pasos.length - 1 ? "Siguiente Paso" : "Finalizar Curso"}
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="box has-text-white" style={{ background: 'rgb(2, 25, 41)', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100%',  boxShadow: '0px 0px 10px 0px rgba(255,255,255,0.5)',  marginTop:'20px' }}>
                <h2 className="title is-4 has-text-white" style={{ textAlign: 'center' }}>
                  Por favor, elige un curso y posteriormente el tema para ver más información
                </h2>
                <div aria-label="Orange and tan hamster running in a metal wheel" role="img" className="wheel-and-hamster" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default Curso;


