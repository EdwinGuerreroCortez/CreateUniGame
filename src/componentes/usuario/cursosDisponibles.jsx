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
  const navigate = useNavigate();

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
    setCursoSeleccionado(curso);
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
  };

  const closeModal = () => {
    setShowModal(false);
    setCursoParaSuscribir(null);
  };

  const handleSuscribirse = () => {
    suscribirseACurso(cursoParaSuscribir._id);
    closeModal();
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
        <div className="columns is-multiline is-centered">
          {cursosMostrados.map((curso) => (
            <div key={curso._id} className="column is-3">
              <div className={`box curso-card ${cursoSeleccionado && cursoSeleccionado._id === curso._id ? "selected" : ""}`} onClick={() => seleccionarCurso(curso)}>
                <div className="has-text-white" style={{ cursor: "pointer", padding: "20px" }}>
                  <span className="title is-4 has-text-white" style={{ fontSize: curso.nombre.length > 10 ? '1rem' : '1.5rem' }}>
                    {curso.nombre}
                  </span>
                  <div className="temas-container" style={{ marginTop: "10px", height: cursoSeleccionado && cursoSeleccionado._id === curso._id ? 'auto' : '60px', overflow: cursoSeleccionado && cursoSeleccionado._id === curso._id ? 'visible' : 'hidden' }}>
                    <p>Temas a aprender:</p>
                    {cursoSeleccionado && cursoSeleccionado._id === curso._id && (
                      <ul>
                        {temas[curso._id] && temas[curso._id].map((tema) => (
                          <li key={tema._id} className="has-text-white">
                            ⊳ {tema.titulo}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                  <button
                    className="button is-link is-size-8 is-fullwidth"
                    onClick={(e) => {
                      e.stopPropagation();
                      openModal(curso);
                    }}
                    disabled={estaSuscrito(curso._id)}
                  >
                    {estaSuscrito(curso._id) ? "Suscrito" : "Suscribirse"}
                  </button>
                  {showSubscriptionPrompt && cursoSeleccionado && cursoSeleccionado._id === curso._id && (
                    <div
                      className="notification is-link is-light"
                      style={{
                        padding: "0.9rem 1rem",
                        fontSize: "0.9rem",
                        marginTop: "20px",
                      }}
                    >
                      {subscriptionMessage}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
          {!mostrarTodos ? (
            <div className="column is-12 has-text-centered">
              <button className="button is-link" onClick={handleMostrarTodos}>Ver más</button>
            </div>
          ) : (
            <div className="column is-12 has-text-centered">
              <button className="button is-link" onClick={handleOcultar}>Ocultar</button>
            </div>
          )}
        </div>
      </div>

      {showModal && (
        <div className={`modal ${showModal ? "is-active" : ""}`}>
          <div className="modal-background"></div>
          <div className="modal-card">
            <header className="modal-card-head">
              <p className="modal-card-title">Confirmar Suscripción</p>
              <button className="delete" aria-label="close" onClick={closeModal}></button>
            </header>
            <section className="modal-card-body">
              <h2 className="title is-4">{cursoParaSuscribir.nombre}</h2>
              <p>Temas a aprender:</p>
              <ul>
                {temas[cursoParaSuscribir._id] && temas[cursoParaSuscribir._id].map((tema) => (
                  <li key={tema._id} className="has-text-black">
                    ⊳ {tema.titulo}
                  </li>
                ))}
              </ul>
              <p>¿Desea suscribirse a este curso?</p>
            </section>
            <footer className="modal-card-foot">
              <button className="button is-success" onClick={handleSuscribirse} style={{marginRight:'10px'}}>Sí</button>
              <button className="button" onClick={closeModal}style={{backgroundColor:'red'}}>No</button>
            </footer>
          </div>
        </div>
      )}
    </div>
  );
};

export default CursosDisponibles;
