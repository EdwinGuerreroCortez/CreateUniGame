import React, { useState, useEffect } from "react";
import "bulma/css/bulma.min.css";
import { useNavigate } from "react-router-dom";
import "../CSS/custom.css"; // Asegúrate de crear y usar este archivo para animaciones personalizadas

const CursosDisponibles = () => {
  const [cursoSeleccionado, setCursoSeleccionado] = useState(null);
  const [temas, setTemas] = useState({});
  const [cursos, setCursos] = useState([]);
  const [cursosMostrados, setCursosMostrados] = useState([]);
  const [showSubscriptionPrompt, setShowSubscriptionPrompt] = useState(false);
  const [subscriptionMessage, setSubscriptionMessage] = useState("");
  const [cursosSuscritos, setCursosSuscritos] = useState([]);
  const [mostrarTodos, setMostrarTodos] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [cursoParaSuscribir, setCursoParaSuscribir] = useState(null);
  const [busqueda, setBusqueda] = useState("");
  const [filtro, setFiltro] = useState("todos"); // Filtro para cursos
  const navigate = useNavigate();
  const [mensajeInscrito, setMensajeInscrito] = useState(false);

  const fetchCursos = async () => {
    try {
      const response = await fetch("http://localhost:3001/api/cursos");
      const data = await response.json();
      const cursosRevueltos = revolverCursos(data);
      setCursos(cursosRevueltos);
      setCursosMostrados(cursosRevueltos.slice(0, 4));
      fetchTemasDeTodosLosCursos(cursosRevueltos);
    } catch (error) {
      console.error("Error al cargar los cursos:", error);
    }
  };

  const fetchCursosSuscritos = async () => {
    const userId = localStorage.getItem("userId");
    try {
      const response = await fetch(`http://localhost:3001/api/usuarios/${userId}/cursos-suscritos`);
      const data = await response.json();
      setCursosSuscritos(data.cursos);
    } catch (error) {
      console.error("Error al cargar los cursos suscritos:", error);
    }
  };

  const fetchTemasDeTodosLosCursos = async (cursos) => {
    try {
      const temasCargados = {};
      for (const curso of cursos) {
        const response = await fetch(`http://localhost:3001/api/cursos/${curso._id}/temas`);
        const data = await response.json();
        console.log(`Temas para el curso ${curso.nombre}:`, data); // Verifica aquí
        temasCargados[curso._id] = data.slice(0, 6); // Limitar a 6 temas
      }
      setTemas(temasCargados);
    } catch (error) {
      console.error("Error al cargar los temas de los cursos:", error);
    }
  };

  useEffect(() => {
    fetchCursos();
    fetchCursosSuscritos();
  }, []);

  const suscribirseACurso = async (cursoId) => {
    const userId = localStorage.getItem("userId");
    try {
      const response = await fetch(
        `http://localhost:3001/api/usuarios/${userId}/suscribirse/${cursoId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();
      if (response.status === 200) {
        setSubscriptionMessage("¡Excelente! Te has inscrito a un nuevo curso.");
        setShowSubscriptionPrompt(true);
        fetchCursosSuscritos();
      } else {
        setSubscriptionMessage(data.message);
        setShowSubscriptionPrompt(true);
      }
    } catch (error) {
      console.error("Error al suscribirse al curso:", error);
    }
  };

  const seleccionarCurso = (curso) => {
    setCursoSeleccionado(cursoSeleccionado === curso ? null : curso);
  };

  const estaSuscrito = (cursoId) => {
    return cursosSuscritos.some(curso => curso._id === cursoId);
  };

  const revolverCursos = (cursos) => {
    for (let i = cursos.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [cursos[i], cursos[j]] = [cursos[j], cursos[i]];
    }
    return cursos;
  };

  const handleMostrarTodos = () => {
    setMostrarTodos(true);
    setCursosMostrados(cursos);
  };

  const handleOcultar = () => {
    setMostrarTodos(false);
    setCursosMostrados(cursos.slice(0, 4));
  };

  const openModal = (curso) => {
    setCursoParaSuscribir(curso);
    setShowModal(true);
    if (estaSuscrito(curso._id)) {
      setMensajeInscrito(true);
    } else {
      setMensajeInscrito(false);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setCursoParaSuscribir(null);
  };

  const handleSuscribirse = () => {
    suscribirseACurso(cursoParaSuscribir._id);
    closeModal();
  };

  const handleBusqueda = (e) => {
    setBusqueda(e.target.value);
    const cursosFiltrados = cursos.filter(curso => {
      return curso.nombre.toLowerCase().includes(e.target.value.toLowerCase());
    });

    // Aplicar el filtro seleccionado
    const cursosFiltradosConFiltro = cursosFiltrados.filter(curso => {
      if (filtro === "suscritos") return estaSuscrito(curso._id);
      if (filtro === "no_suscritos") return !estaSuscrito(curso._id);
      return true;
    });

    setCursosMostrados(cursosFiltradosConFiltro.slice(0, mostrarTodos ? cursosFiltradosConFiltro.length : 4));
  };

  const handleFiltroChange = (e) => {
    setFiltro(e.target.value);

    // Filtrar cursos según el nuevo filtro y la búsqueda actual
    const cursosFiltrados = cursos.filter(curso => {
      return curso.nombre.toLowerCase().includes(busqueda.toLowerCase());
    });

    const cursosFiltradosConFiltro = cursosFiltrados.filter(curso => {
      if (e.target.value === "suscritos") return estaSuscrito(curso._id);
      if (e.target.value === "no_suscritos") return !estaSuscrito(curso._id);
      return true;
    });

    setCursosMostrados(cursosFiltradosConFiltro.slice(0, mostrarTodos ? cursosFiltradosConFiltro.length : 4));
  };

  useEffect(() => {
    const interval = setInterval(() => {
      const cursosElementos = document.querySelectorAll('.curso-card');
      cursosElementos.forEach((element, index) => {
        setTimeout(() => {
          element.classList.add('animate');
          setTimeout(() => {
            element.classList.remove('animate');
          }, 1000);
        }, index * 100);
      });
    }, 5000);

    return () => clearInterval(interval);
  }, [cursosMostrados]);

  return (
    <div className="section has-background-black-bis" style={{ minHeight: '600px' }}>
      <div className="container">
        <h2 className="title is-3 has-text-white has-text-centered">Cursos Disponibles</h2>
        <p className="has-text-centered has-text-grey-light">Pulse para más información</p>
        <br />
        <div className="field is-grouped">
          <div className="control is-expanded">
            <input
              className="input"
              type="text"
              value={busqueda}
              onChange={handleBusqueda}
              placeholder="Buscar curso..."
            />
          </div>
          <div className="control">
            <div className="select">
              <select value={filtro} onChange={handleFiltroChange}>
                <option value="todos">Todos</option>
                <option value="suscritos">Suscritos</option>
                <option value="no_suscritos">No suscritos</option>
              </select>
            </div>
          </div>
        </div>
        <div className="columns is-multiline is-centered">
          {cursosMostrados.map((curso) => (
            <div key={curso._id} className="column is-3">
              <div
                className={`box curso-card ${cursoSeleccionado && cursoSeleccionado._id === curso._id ? "selected" : ""}`}
                onClick={() => seleccionarCurso(curso)}
                style={{
                  transition: "transform 0.3s, box-shadow 0.3s",
                  border: "1px solid #ffffff",
                  borderRadius: "8px",
                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.4)",
                  overflow: "hidden",
                  backgroundColor: "#1c1c1c", // Fondo oscuro
                  color: "#ffffff", // Texto blanco para contraste
                  padding: '15px'
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.05)"}
                onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
              >
                <div style={{ cursor: "pointer", padding: "15px" }}>
                  <span
                    className="title is-4 has-text-white"
                    style={{
                      fontSize: curso.nombre.length > 10 ? '1rem' : '1.5rem',
                      textAlign: "center",
                      display: "block",
                      marginBottom: "1px",
                      textShadow: "0 2px 4px rgba(0, 0, 0, 0.5)",
                    }}>
                    {curso.nombre}
                  </span>
                  {cursoSeleccionado && cursoSeleccionado._id === curso._id && (
                    <div className="temas-container" style={{ marginTop: "10px" }}>
                      {temas[curso._id] && temas[curso._id].length > 0 ? (
                        <>
                          <p>Aquí aprenderás:</p>
                          <br />
                          <ul>
                            {temas[curso._id].map((tema) => (
                              <li key={tema._id} className="has-text-white">
                                ⊳ {tema.titulo}
                              </li>
                            ))}
                          </ul>
                        </>
                      ) : (
                        <p>Temas no disponibles. Comuníquese con su docente.</p>
                      )}
                    </div>
                  )}

                </div>

                <br />
                {estaSuscrito(curso._id) ? (
                  <button
                    className="button is-static is-outlined"
                    style={{
                      backgroundColor: "#004085", // Azul fuerte para "Inscrito"
                      color: "#ffffff",
                      width: "100%",
                      fontWeight: "bold",
                      border: "none",
                      marginTop: '2px',
                      cursor: 'not-allowed', // Cambia el cursor para mostrar que está bloqueado
                    }}
                    disabled // Desactiva el botón para que no se pueda hacer clic
                  >
                    Inscrito
                  </button>
                ) : (
                  <button
                    className="button is-outlined"
                    style={{
                      width: "100%",
                      backgroundColor: "#0056b3", // Azul más claro para "Inscribirse"
                      color: "#ffffff",
                      fontWeight: "bold",
                      border: "none",
                      marginTop: '2px',
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (!mensajeInscrito) { // Solo abre el modal si el mensajeInscrito es falso
                        openModal(curso);
                      } else {
                        // Muestra una notificación si ya está inscrito
                        setSubscriptionMessage("¡Ya estás inscrito en este curso!");
                        setShowSubscriptionPrompt(true);
                      }
                    }}
                  >
                    Inscribirse
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>


        <div className="buttons is-centered">
          {!mostrarTodos ? (
            <button className="button is-dark is-small" onClick={handleMostrarTodos}>Mostrar todos</button>
          ) : (
            <button className="button is-dark is-small" onClick={handleOcultar}>Ocultar</button>
          )}
        </div>
        {showModal && (
          <div className="modal is-active">
            <div className="modal-background" onClick={closeModal}></div>
            <div className="modal-card">
              <header className="modal-card-head">
                <p className="modal-card-title">Confirmar Suscripción</p>
                <button className="delete" aria-label="close" onClick={closeModal}></button>
              </header>
              <section className="modal-card-body">
                <p>¿Deseas suscribirte al curso "{cursoParaSuscribir.nombre}"?</p>
                {mensajeInscrito && (
                  <p className="has-text-danger">¡Ya estás inscrito, verifica los temas en el apartado de cursos!</p>
                )}
              </section>
              <footer className="modal-card-foot">
                <button className="button is-success" onClick={handleSuscribirse}>Suscribirse</button>
                <button className="button" onClick={closeModal}>Cancelar</button>
              </footer>
            </div>
          </div>
        )}
        {showSubscriptionPrompt && (
          <div className="notification is-primary">
            <button className="delete" onClick={() => setShowSubscriptionPrompt(false)}></button>
            {subscriptionMessage}
          </div>
        )}
      </div>
    </div>
  );
};

export default CursosDisponibles;
