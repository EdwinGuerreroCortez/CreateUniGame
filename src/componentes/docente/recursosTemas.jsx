import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "bulma/css/bulma.min.css";
import "../CSS/adminForms2.css";
import "@fortawesome/fontawesome-free/css/all.min.css";

const Recursos = () => {
  const [selectedCurso, setSelectedCurso] = useState("");
  const [cursos, setCursos] = useState([]);
  const [temas, setTemas] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [recursos, setRecursos] = useState([{ titulo: "", enlace: "" }]);
  const [selectedTema, setSelectedTema] = useState(null);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertVisible, setAlertVisible] = useState(false);
  const [expandedTema, setExpandedTema] = useState(null);

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    // Obtener cursos del usuario
    axios.get(`http://localhost:3001/api/usuario/${userId}/cursos`)
      .then(response => {
        setCursos(response.data);
      })
      .catch(error => {
        console.error("Error al obtener cursos:", error);
      });

    // Obtener temas del usuario
    axios.get(`http://localhost:3001/api/usuario/${userId}/temas`)
      .then(response => {
        setTemas(response.data);
      })
      .catch(error => {
        console.error("Error al obtener temas:", error);
      });
  }, []);

  const filteredTemas = selectedCurso
    ? temas.filter((tema) => tema.curso === selectedCurso)
    : temas;

  const handleAddRecurso = (tema) => {
    setSelectedTema(tema);
    setShowModal(true);
  };

  const validateRecursos = () => {
    for (let recurso of recursos) {
      if (!recurso.titulo || !recurso.enlace) {
        setAlertMessage("Todos los campos de recursos son obligatorios.");
        setAlertVisible(true);
        setTimeout(() => setAlertVisible(false), 3000);
        return false;
      }
    }
    return true;
  };

  const handleSaveRecurso = () => {
    if (validateRecursos() && selectedTema) {
      const updatedTema = {
        ...selectedTema,
        recursos: [...selectedTema.recursos, ...recursos]
      };

      axios.put(`http://localhost:3001/api/temas/${selectedTema._id}/recursos`, { recursos })
        .then(response => {
          setTemas(temas.map(tema => tema._id === selectedTema._id ? response.data : tema));
          setShowModal(false);
          setRecursos([{ titulo: "", enlace: "" }]);
        })
        .catch(error => {
          console.error("Error al agregar recurso:", error);
        });
    }
  };

  const handleRecursoChange = (index, e) => {
    const { name, value } = e.target;
    const updatedRecursos = recursos.map((recurso, i) =>
      i === index ? { ...recurso, [name]: value } : recurso
    );
    setRecursos(updatedRecursos);
  };

  const handleAddRecursoField = () => {
    setRecursos([...recursos, { titulo: "", enlace: "" }]);
  };

  const handleRemoveRecursoField = (index) => {
    setRecursos(recursos.filter((_, i) => i !== index));
  };

  const handleToggleExpand = (temaId) => {
    if (expandedTema === temaId) {
      setExpandedTema(null);
    } else {
      setExpandedTema(temaId);
    }
  };

  return (
    <div
      style={{
        backgroundColor: "#14161A",
        minHeight: "100vh",
        padding: "20px",
      }}
    >
      <div className="container">
        <h1 className="title has-text-centered has-text-white">Lista de Recursos</h1>

        <div className="buttons is-right">
          <Link to="/admin/temas" className="button is-primary" data-tooltip="Agregar tema">
            <span className="icon">
              <i className="fas fa-plus"></i>
            </span>
          </Link>
        </div>

        <div className="select is-fullwidth" style={{ marginBottom: "20px" }}>
          <select
            value={selectedCurso}
            onChange={(e) => setSelectedCurso(e.target.value)}
          >
            <option value="">Todos los cursos</option>
            {cursos.map((curso) => (
              <option key={curso._id} value={curso._id}>
                {curso.nombre}
              </option>
            ))}
          </select>
        </div>

        <div className="box" style={{ backgroundColor: "#090A0C" }}>
          <div className="table-container">
            <table className="table is-fullwidth is-striped is-hoverable">
              <thead>
                <tr>
                  <th className="has-text-white">Título del Tema</th>
                  <th className="has-text-white">Recursos</th>
                  <th className="has-text-white">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredTemas.length > 0 ? (
                  filteredTemas.map((tema) => (
                    <tr key={tema._id}>
                      <td className="has-text-white">{tema.titulo}</td>
                      <td className="has-text-white">
                        {tema.recursos.length > 0 ? (
                          <>
                            {tema.recursos.slice(0, expandedTema === tema._id ? tema.recursos.length : 2).map((recurso, index) => (
                              <div key={index}>
                                <strong>{recurso.titulo}:</strong>{" "}
                                {recurso.enlace ? (
                                  <a href={recurso.enlace} target="_blank" rel="noopener noreferrer">Ver Recurso</a>
                                ) : (
                                  <span>No contiene</span>
                                )}
                              </div>
                            ))}
                            {tema.recursos.length > 2 && (
                              <button
                                className="button is-text is-small"
                                onClick={() => handleToggleExpand(tema._id)}
                              >
                                {expandedTema === tema._id ? "Ver menos" : "Ver más"}
                              </button>
                            )}
                          </>
                        ) : (
                          <span>No contiene</span>
                        )}
                      </td>
                      <td className="has-text-white">
                        <button
                          className="button is-link is-small"
                          data-tooltip="Agregar recurso"
                          onClick={() => handleAddRecurso(tema)}
                        >
                          <span className="icon">
                            <i className="fas fa-plus"></i>
                          </span>
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td className="has-text-white" colSpan="3">
                      No hay recursos disponibles.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {showModal && (
          <div className="modal is-active">
            <div className="modal-background" onClick={() => setShowModal(false)}></div>
            <div className="modal-card" style={{ color: "white" }}>
              <header className="modal-card-head" style={{ backgroundColor: "#14161A" }}>
                <p className="modal-card-title" style={{ color: "white" }}>Agregar Recursos</p>
                <button className="delete" aria-label="close" onClick={() => setShowModal(false)}></button>
              </header>
              <section className="modal-card-body" style={{ backgroundColor: "#14161A" }}>
                {alertVisible && (
                  <div className="notification is-danger">
                    <button className="delete" onClick={() => setAlertVisible(false)}></button>
                    {alertMessage}
                  </div>
                )}
                {recursos.map((recurso, index) => (
                  <div key={index}>
                    <div className="field">
                      <label className="label" style={{ color: "white" }}>Título del Recurso {index + 1}</label>
                      <div className="control">
                        <input
                          className="input"
                          type="text"
                          name="titulo"
                          value={recurso.titulo}
                          onChange={(e) => handleRecursoChange(index, e)}
                          style={{ color: "white", backgroundColor: "#090A0C", borderColor: "#363636" }}
                        />
                      </div>
                    </div>
                    <div className="field">
                      <label className="label" style={{ color: "white" }}>Enlace del Recurso {index + 1}</label>
                      <div className="control">
                        <input
                          className="input"
                          type="text"
                          name="enlace"
                          value={recurso.enlace}
                          onChange={(e) => handleRecursoChange(index, e)}
                          style={{ color: "white", backgroundColor: "#090A0C", borderColor: "#363636" }}
                        />
                      </div>
                    </div>
                    {index > 0 && (
                      <button
                        className="button is-danger is-small"
                        onClick={() => handleRemoveRecursoField(index)}
                      >
                        Eliminar Recurso
                      </button>
                    )}
                    <hr />
                  </div>
                ))}
                <button className="button is-link" onClick={handleAddRecursoField}>
                  Agregar Otro Recurso
                </button>
              </section>
              <footer className="modal-card-foot" style={{ backgroundColor: "#14161A" }}>
                <button className="button is-success" onClick={handleSaveRecurso}>Guardar</button>
                <button className="button" onClick={() => setShowModal(false)}>Cancelar</button>
              </footer>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Recursos;
