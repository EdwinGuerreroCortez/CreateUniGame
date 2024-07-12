import React, { useState, useEffect, useRef } from "react";
import "bulma/css/bulma.min.css";
import { useNavigate } from "react-router-dom";
import "../CSS/custom.css"; // Asegúrate de crear y usar este archivo para animaciones personalizadas

const CursosDisponibles = () => {
  const [cursoSeleccionado, setCursoSeleccionado] = useState(null);
  const [temas, setTemas] = useState([]);
  const [cursos, setCursos] = useState([]);
  const [showSubscriptionPrompt, setShowSubscriptionPrompt] = useState(false);
  const [subscriptionMessage, setSubscriptionMessage] = useState("");
  const [cursosSuscritos, setCursosSuscritos] = useState([]);
  const carruselRef = useRef(null);
  const navigate = useNavigate();

  const fetchCursos = async () => {
    try {
      const response = await fetch("http://localhost:3001/api/cursos");
      const data = await response.json();
      setCursos(data);
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

  useEffect(() => {
    fetchCursos();
    fetchCursosSuscritos();
  }, []);

  const fetchTemasDelCurso = async (cursoId) => {
    try {
      const response = await fetch(`http://localhost:3001/api/cursos/${cursoId}/temas`);
      const data = await response.json();
      setTemas(data.slice(0, 6)); // Limitar a 6 temas
    } catch (error) {
      console.error("Error al cargar los temas del curso:", error);
    }
  };

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
        setCursoSeleccionado(data.curso);
        fetchCursosSuscritos(); // Actualizar lista de cursos suscritos
      } else {
        setSubscriptionMessage(data.message);
        setShowSubscriptionPrompt(true);
      }
    } catch (error) {
      console.error("Error al suscribirse al curso:", error);
    }
  };

  const seleccionarCurso = (curso) => {
    if (curso) {
      setCursoSeleccionado(curso);
      fetchTemasDelCurso(curso._id);
    }
  };

  const estaSuscrito = (cursoId) => {
    return cursosSuscritos.some(curso => curso._id === cursoId);
  };

  const avanzarCarrusel = (direccion) => {
    const totalCursos = cursos.length;
    const indiceActual = cursos.findIndex(curso => curso._id === cursoSeleccionado?._id);
    const siguienteIndice = (indiceActual + direccion + totalCursos) % totalCursos;
    seleccionarCurso(cursos[siguienteIndice]);
  };

  useEffect(() => {
    if (cursos.length > 0 && !cursoSeleccionado) {
      seleccionarCurso(cursos[0]);
    }
  }, [cursos]);

  useEffect(() => {
    const interval = setInterval(() => avanzarCarrusel(1), 6000); // Cambiar cada 6 segundos
    return () => clearInterval(interval);
  }, [cursoSeleccionado, cursos]);

  return (
    <div className="section has-background-black-bis" style={{ minHeight: '600px' }}>
      <div className="container">
        <h2 className="title is-3 has-text-white has-text-centered">Cursos Disponibles</h2>
        <div className="columns is-centered">
          <div className="column is-1" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <button className="button is-link arrow-button" onClick={() => avanzarCarrusel(-1)}>
              ⇐
            </button>
          </div>
          <div className="column is-10">
            <div className="carrusel" ref={carruselRef}>
              <div className="carrusel-inner" style={{ display: 'flex', justifyContent: 'center' }}>
                {cursos.map((curso, index) => (
                  <div
                    key={curso._id}
                    className={`curso-card box ${cursoSeleccionado && cursoSeleccionado._id === curso._id ? "expanded" : ""}`}
                    style={{
                      backgroundColor: "navy",
                      margin: "10px",
                      position: "relative",
                      overflow: "hidden",
                      flex: '0 0 auto',
                      width: cursoSeleccionado && cursoSeleccionado._id === curso._id ? '500px' : '200px',
                      height: cursoSeleccionado && cursoSeleccionado._id === curso._id ? 'auto' : '300px',
                      transition: 'all 0.5s ease',
                      border: cursoSeleccionado && cursoSeleccionado._id === curso._id ? '3px solid white' : 'none',
                      boxShadow: cursoSeleccionado && cursoSeleccionado._id === curso._id ? '0 0 15px rgba(255, 255, 255, 0.7)' : 'none'
                    }}
                    onClick={() => seleccionarCurso(curso)}
                  >
                    <div className="has-text-white" style={{ cursor: "pointer", padding: "20px" }}>
                      <span className="title is-5 has-text-white" style={{ fontSize: curso.nombre.length > 10 ? '1rem' : '1.5rem' }}>
                        {curso.nombre}
                      </span>
                      {cursoSeleccionado && cursoSeleccionado._id === curso._id && (
                        <div style={{ marginTop: "10px" }}>
                          <h3 className="title is-6 has-text-white">Temas a aprender:</h3>
                          <ul>
                            {temas.map((tema) => (
                              <li key={tema._id} className="has-text-white">
                                ⊳ {tema.titulo}
                              </li>
                            ))}
                          </ul>
                          <button
                            className="button is-link is-size-8 is-fullwidth"
                            onClick={() => suscribirseACurso(cursoSeleccionado._id)}
                            disabled={estaSuscrito(cursoSeleccionado._id)}
                          >
                            {estaSuscrito(cursoSeleccionado._id) ? "Suscrito" : "Suscribirse"}
                          </button>
                          {showSubscriptionPrompt && (
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
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="column is-1" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <button className="button is-link arrow-button" onClick={() => avanzarCarrusel(1)}>
              ⇒
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CursosDisponibles;
