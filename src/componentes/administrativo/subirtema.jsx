import React, { useState, useEffect } from "react";
import "../CSS/subirtemaForm.css";
import "bulma/css/bulma.min.css";
import { FaTrash, FaPlus, FaArrowLeft, FaArrowRight } from "react-icons/fa"; // Importamos los iconos de react-icons

const SubirTema = () => {
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [responsable, setResponsable] = useState("");
  const [bibliografia, setBibliografia] = useState("");
  const [curso, setCurso] = useState(""); // Estado para el curso seleccionado
  const [cursos, setCursos] = useState([]); // Estado para la lista de cursos
  const [pasos, setPasos] = useState([{ Titulo: "", Descripcion: "" }]);
  const [videoFile, setVideoFile] = useState(null);
  const [alert, setAlert] = useState({ type: "", message: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [paginaActual, setPaginaActual] = useState(0);
  const pasosPorPagina = 1;

  const [subtemas, setSubtemas] = useState([]);

  useEffect(() => {
    if (alert.message) {
      const timer = setTimeout(() => {
        setAlert({ type: "", message: "" });
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [alert]);

  // Obtener la lista de cursos desde el backend
  useEffect(() => {
    const fetchCursos = async () => {
      try {
        const response = await fetch("http://localhost:3001/api/cursos");
        if (!response.ok) {
          throw new Error("Error al obtener los cursos.");
        }
        const data = await response.json();
        setCursos(data);
      } catch (error) {
        console.error("Error al obtener los cursos:", error);
        setAlert({ type: "error", message: "Error al obtener los cursos." });
      }
    };

    fetchCursos();
  }, []);

  const handleAgregarSubtema = () => {
    setSubtemas([...subtemas, { Titulo: "", Descripcion: "" }]);
  };

  const handleSubtemaChange = (index, field, value) => {
    const newSubtemas = [...subtemas];
    newSubtemas[index][field] = value;
    setSubtemas(newSubtemas);
  };

  const handleEliminarSubtema = (index) => {
    if (subtemas.length > 1) {
      if (window.confirm("¿Estás seguro de que quieres eliminar este subtema?")) {
        const nuevosSubtemas = [...subtemas];
        nuevosSubtemas.splice(index, 1);
        setSubtemas(nuevosSubtemas);
      }
    }
  };

  const handleInputChange = (index, field, value) => {
    const newPasos = [...pasos];
    newPasos[index][field] = value;
    setPasos(newPasos);
  };

  const handleAgregarPaso = () => {
    setPasos([...pasos, { Titulo: "", Descripcion: "" }]);
    setPaginaActual(paginaActual + 1); // Pasar automáticamente a la siguiente página
  };

  const handleEliminarPaso = (index) => {
    if (pasos.length > 1) {
      if (window.confirm("¿Estás seguro de que quieres eliminar este paso?")) {
        const newPasos = [...pasos];
        newPasos.splice(index, 1);
        setPasos(newPasos);
        if (paginaActual > 0 && index <= startIndex) {
          setPaginaActual(paginaActual - 1); // Retrocede una página si se elimina el único paso en la página actual
        }
      }
    }
  };

  const handleFileChange = (e) => {
    setVideoFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !titulo ||
      !descripcion ||
      !responsable ||
      !bibliografia ||
      !curso ||
      pasos.some((p) => !p.Titulo || !p.Descripcion) ||
      subtemas.some((s) => !s.Titulo || !s.Descripcion)
    ) {
      setAlert({
        type: "warning",
        message: "Por favor completa todos los campos",
      });
      return;
    }

    setIsLoading(true);
    const formData = new FormData();
    formData.append("titulo", titulo);
    formData.append("descripcion", descripcion);
    formData.append("responsable", responsable);
    formData.append("bibliografia", bibliografia);
    formData.append("curso", curso); // Include the course ID
    if (videoFile) {
      formData.append("video", videoFile);
    }
    formData.append("pasos", JSON.stringify(pasos));
    formData.append("subtemas", JSON.stringify(subtemas));

    try {
      const response = await fetch("http://localhost:3001/api/subirTema", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(
          "Error al crear el tema. Código de estado: " + response.status
        );
      }

      const data = await response.json();
      if (data.error) {
        setAlert({ type: "error", message: data.error });
      } else {
        setAlert({ type: "success", message: "Tema agregado con éxito." });
        setTitulo("");
        setDescripcion("");
        setResponsable("");
        setBibliografia("");
        setCurso("");
        setPasos([{ Titulo: "", Descripcion: "" }]);
        setSubtemas([]);
        setVideoFile(null);
        setPaginaActual(0); // Reiniciar paginación al enviar el formulario
      }
    } catch (error) {
      console.error("Error creando el tema:", error);
      setAlert({
        type: "error",
        message: "Error creando el tema. Inténtalo de nuevo.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const startIndex = paginaActual * pasosPorPagina;
  const endIndex = startIndex + pasosPorPagina;

  return (
    <div style={{ minHeight: "100vh", background: '#14161A', marginTop: '20px' }}>
      {isLoading && (
        <div className="loading-overlay">
          <div className="loading-circle"></div>
        </div>
      )}
      <div className="columns is-centered">
        <div className="column is-three-quarters">
          <div className="box">
            <h1 className="title has-text-centered has-text-white">Subir Tema</h1>

            {alert.message && (
              <div
                className={`notification ${alert.type === "success"
                  ? "is-success"
                  : alert.type === "warning"
                    ? "is-warning"
                    : "is-danger"
                  }`}
              >
                <button
                  className="delete"
                  onClick={() => setAlert({ type: "", message: "" })}
                ></button>
                {alert.message}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="field">
                <label className="label has-text-white">Título</label>
                <div className="control">
                  <input
                    className="input"
                    type="text"
                    value={titulo}
                    onChange={(e) => setTitulo(e.target.value)}
                  />
                </div>
              </div>

              <div className="field">
                <label className="label has-text-white">Descripción</label>
                <div className="control">
                  <textarea
                    className="textarea"
                    value={descripcion}
                    onChange={(e) => setDescripcion(e.target.value)}
                  />
                </div>
              </div>

              <div className="field">
                <label className="label has-text-white">Responsable</label>
                <div className="control">
                  <input
                    className="input"
                    type="text"
                    value={responsable}
                    onChange={(e) => setResponsable(e.target.value)}
                  />
                </div>
              </div>

              <div className="field">
                <label className="label has-text-white">Bibliografía</label>
                <div className="control">
                  <input
                    className="input"
                    type="text"
                    value={bibliografia}
                    onChange={(e) => setBibliografia(e.target.value)}
                  />
                </div>
              </div>

              <div className="field">
                <label className="label has-text-white">Curso</label>
                <div className="control">
                  <div className="select is-fullwidth">
                    <select
                      value={curso}
                      onChange={(e) => setCurso(e.target.value)}
                    >
                      <option value="">Selecciona un curso</option>
                      {cursos.map((curso) => (
                        <option key={curso._id} value={curso._id}>
                          {curso.nombre}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div className="field">
                <label className="label has-text-white">Cargar Video</label>
                <div className="file has-name is-fullwidth">
                  <label className="file-label">
                    <input
                      className="file-input"
                      type="file"
                      accept="video/*"
                      onChange={handleFileChange}
                    />
                    <span className="file-cta">
                      <span className="file-icon">
                        <i className="fas fa-upload"></i>
                      </span>
                      <span className="file-label">Escoge un archivo…</span>
                    </span>
                    {videoFile && (
                      <span className="file-name">{videoFile.name}</span>
                    )}
                  </label>
                </div>
              </div>

              <div className="field">
                <label className="label has-text-white">Pasos</label>
                {pasos.slice(startIndex, endIndex).map((paso, index) => (
                  <div
                    key={index}
                    className="box step-box"
                    style={{
                      backgroundColor: "#272727",
                      marginBottom: "10px",
                      padding: "10px",
                      position: "relative",
                    }}
                  >
                    {pasos.length > 1 && (
                      <div
                        className="delete-icon"
                        title="Eliminar"
                        onClick={() => handleEliminarPaso(startIndex + index)}
                      >
                        <FaTrash />
                      </div>
                    )}
                    <div className="field">
                      <label className="label has-text-white">
                        Título del Paso {startIndex + index + 1}
                      </label>
                      <div className="control">
                        <input
                          className="input"
                          type="text"
                          value={paso.Titulo}
                          onChange={(e) =>
                            handleInputChange(
                              startIndex + index,
                              "Titulo",
                              e.target.value
                            )
                          }
                        />
                      </div>
                    </div>

                    <div className="field">
                      <label className="label has-text-white">
                        Descripción del Paso {startIndex + index + 1}
                      </label>
                      <div className="control">
                        <textarea
                          className="textarea"
                          value={paso.Descripcion}
                          onChange={(e) =>
                            handleInputChange(
                              startIndex + index,
                              "Descripcion",
                              e.target.value
                            )
                          }
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="control is-flex is-justify-content-flex-end">
                <button
                  type="button"
                  className="button is-link add-button"
                  style={{ marginRight: "0.4cm" }}
                  onClick={handleAgregarPaso}
                >
                  <FaPlus />
                </button>
                <button
                  type="button"
                  className="button is-link tooltip"
                  data-tooltip="Anterior"
                  onClick={() => setPaginaActual(paginaActual - 1)}
                  disabled={paginaActual === 0}
                  style={{ marginRight: "0.4cm" }}
                >
                  <FaArrowLeft />
                </button>
                <button
                  type="button"
                  className="button is-link tooltip"
                  data-tooltip="Siguiente"
                  onClick={() => setPaginaActual(paginaActual + 1)}
                  disabled={endIndex >= pasos.length}
                >
                  <FaArrowRight />
                </button>
              </div>
              <br />
              <div className="field">
                <div className="control is-pulled-right">
                  <button
                    type="button"
                    className="button is-success is-small"
                    onClick={handleAgregarSubtema}
                    data-tooltip="Agregar Subtema"
                    style={{ marginBottom: '20px' }}
                  >
                    <span className="icon">
                      <FaPlus />
                    </span>
                    <span>Agregar Subtema</span>
                  </button>
                </div>
                <br />
                <br />
                {subtemas.length > 0 && subtemas.map((subtema, index) => (
                  <div
                    key={index}
                    className="box subtema-box"
                    style={{
                      backgroundColor: "#272727",
                      marginBottom: "10px",
                      padding: "10px",
                      position: "relative",
                    }}
                  >
                    {subtemas.length > 1 && (
                      <div
                        className="delete-icon"
                        title="Eliminar"
                        onClick={() => handleEliminarSubtema(index)}
                      >
                        <FaTrash />
                      </div>
                    )}
                    <div className="field">
                      <label className="label has-text-white">Título del Subtema</label>
                      <div className="control">
                        <input
                          className="input"
                          type="text"
                          value={subtema.Titulo}
                          onChange={(e) => handleSubtemaChange(index, "Titulo", e.target.value)}
                          placeholder="Título del Subtema"
                          required
                        />
                      </div>
                    </div>
                    <div className="field">
                      <label className="label has-text-white">Descripción del Subtema</label>
                      <div className="control">
                        <textarea
                          className="textarea"
                          value={subtema.Descripcion}
                          onChange={(e) => handleSubtemaChange(index, "Descripcion", e.target.value)}
                          placeholder="Descripción del Subtema"
                          required
                        ></textarea>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="control has-text-centered">
                <button type="submit" className="button is-primary">
                  Subir Tema
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubirTema;
