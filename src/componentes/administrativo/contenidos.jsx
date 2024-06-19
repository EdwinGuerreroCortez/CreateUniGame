import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "bulma/css/bulma.min.css";
import "../CSS/adminForms2.css";
import "@fortawesome/fontawesome-free/css/all.min.css";

const Contenidos = () => {
  const [temas, setTemas] = useState([]);
  const [alert, setAlert] = useState({ type: "", message: "" });
  const [editMode, setEditMode] = useState(false);
  const [editTema, setEditTema] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [validationErrors, setValidationErrors] = useState([]);
  const [temaToDelete, setTemaToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const [videoFile, setVideoFile] = useState(null);
  const [videoModalOpen, setVideoModalOpen] = useState(false);
  const [currentTemaId, setCurrentTemaId] = useState(null);

  useEffect(() => {
    fetch("http://localhost:3001/api/temas")
      .then((response) => response.json())
      .then((data) => setTemas(data))
      .catch((error) => console.error("Error fetching temas:", error));
  }, []);

  useEffect(() => {
    if (alert.message) {
      const timer = setTimeout(() => {
        setAlert({ type: "", message: "" });
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [alert]);

  const handleEliminarTema = (id) => {
    setIsDeleting(true);
    fetch(`http://localhost:3001/api/temas/${id}`, {
      method: "DELETE",
    })
      .then(() => {
        setTemas(temas.filter((tema) => tema._id !== id));
        setAlert({ type: "success", message: "Tema eliminado con éxito." });
      })
      .catch((error) => {
        console.error("Error eliminando el tema:", error);
        setAlert({
          type: "error",
          message: "Error eliminando el tema. Inténtalo de nuevo.",
        });
      })
      .finally(() => {
        setIsDeleting(false);
        setTemaToDelete(null);
      });
  };

  const handleCloseAlert = () => {
    setAlert({ type: "", message: "" });
  };

  const handleDownloadTema = (id) => {
    fetch(`http://localhost:3001/api/download-tema/${id}`)
      .then((response) => response.blob())
      .then((blob) => {
        const url = window.URL.createObjectURL(new Blob([blob]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `${id}.xlsx`);
        document.body.appendChild(link);
        link.click();
        link.parentNode.removeChild(link);
      })
      .catch((error) => {
        console.error("Error descargando el archivo Excel:", error);
        setAlert({
          type: "error",
          message: "Error descargando el archivo Excel. Inténtalo de nuevo.",
        });
      });
  };

  const handleEdit = (tema) => {
    setEditMode(true);
    setEditTema(tema);
    setCurrentPage(1); // Reset page to 1 when editing a new tema
  };

  const handleModalClose = () => {
    setEditMode(false);
    setEditTema(null);
    setValidationErrors([]);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const getCurrentPageItems = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return editTema.pasos.slice(startIndex, endIndex);
  };

  const totalPages = Math.ceil(
    editTema ? editTema.pasos.length / itemsPerPage : 1
  );

  const handleSaveEdit = () => {
    const { titulo, descripcion, responsable, bibliografia, pasos } = editTema;

    const errors = [];
    pasos.forEach((paso, index) => {
      if (!paso.Titulo.trim()) {
        errors.push(`El título del paso ${index + 1} está vacío.`);
      }
      if (!paso.Descripcion.trim()) {
        errors.push(`La descripción del paso ${index + 1} está vacía.`);
      }
    });

    if (errors.length > 0) {
      setValidationErrors(errors);
      return;
    }

    const updatedTema = {
      titulo: titulo.trim(),
      descripcion: descripcion.trim(),
      responsable: responsable.trim(),
      bibliografia: bibliografia.trim(),
      pasos: JSON.stringify(
        pasos.map((p) => ({
          Titulo: p.Titulo.trim(),
          Descripcion: p.Descripcion.trim(),
        }))
      ),
    };

    fetch(`http://localhost:3001/api/temas/${editTema._id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedTema),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          setAlert({ type: "error", message: data.details.join(", ") });
        } else {
          setTemas(temas.map((t) => (t._id === data._id ? data : t)));
          setAlert({ type: "success", message: "Tema actualizado con éxito." });
          setValidationErrors([]);
          // No cerrar el modal de edición
        }
      })
      .catch((error) => {
        console.error("Error actualizando el tema:", error);
        setAlert({
          type: "error",
          message: "Error actualizando el tema. Inténtalo de nuevo.",
        });
      });
  };

  const confirmDelete = (id) => {
    setTemaToDelete(id);
  };

  const cancelDelete = () => {
    setTemaToDelete(null);
  };

  const handleVideoChange = (e) => {
    setVideoFile(e.target.files[0]);
  };

  const handleUploadVideo = (id) => {
    setCurrentTemaId(id);
    setVideoModalOpen(true);
  };

  const handleConfirmUpload = () => {
    if (!videoFile) {
      setAlert({
        type: "error",
        message: "Por favor, selecciona un archivo de video.",
      });
      return;
    }

    setUploadingVideo(true);

    const formData = new FormData();
    formData.append("video", videoFile);

    fetch(`http://localhost:3001/api/upload-video/${currentTemaId}`, {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          setAlert({ type: "error", message: data.error });
        } else {
          setTemas(
            temas.map((t) =>
              t._id === currentTemaId ? { ...t, video: data.videoUrl } : t
            )
          );
          setAlert({ type: "success", message: "Video subido con éxito." });
        }
      })
      .catch((error) => {
        console.error("Error subiendo el video:", error);
        setAlert({
          type: "error",
          message: "Error subiendo el video. Inténtalo de nuevo.",
        });
      })
      .finally(() => {
        setUploadingVideo(false);
        setVideoFile(null);
        setVideoModalOpen(false);
      });
  };

  const handleCancelUpload = () => {
    setVideoFile(null);
    setVideoModalOpen(false);
  };

  const validateTemaFields = (tema) => {
    return (
      tema.titulo &&
      tema.responsable &&
      tema.fecha_creacion &&
      tema.descripcion &&
      tema.pasos &&
      tema.pasos.length > 0 &&
      tema.video
    );
  };

  const handleToggleHabilitar = (id) => {
    fetch(`http://localhost:3001/api/temas/${id}/habilitar`, {
      method: "PUT",
    })
      .then((response) => response.json())
      .then((data) => {
        setTemas(temas.map((t) => (t._id === data._id ? data : t)));
        setAlert({
          type: "success",
          message: data.habilitado ? "Tema habilitado." : "Tema deshabilitado.",
        });
      })
      .catch((error) => {
        console.error(
          "Error al cambiar el estado de habilitación del tema:",
          error
        );
        setAlert({
          type: "error",
          message:
            "Error cambiando el estado de habilitación del tema. Inténtalo de nuevo.",
        });
      });
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
        <h1 className="title has-text-centered has-text-white">
          Lista de Temas
        </h1>

        {alert.message && (
          <div
            className={`notification ${
              alert.type === "success" ? "is-success" : "is-danger"
            }`}
          >
            <button className="delete" onClick={handleCloseAlert}></button>
            {alert.message}
          </div>
        )}
        <div className="control is-pulled-right" style={{ margin: "10px" }}>
          <Link to="/admin/temas" className="button is-primary">
            <span className="icon " data-tooltip="Agregar tema">
              <i className="fas fa-plus"></i>
            </span>
          </Link>
        </div>

        <div className="box" style={{ backgroundColor: "#090A0C" }}>
          <table className="table is-fullwidth is-striped is-hoverable">
            <thead>
              <tr>
                <th className="has-text-white">Título</th>
                <th className="has-text-white">Responsable</th>
                <th className="has-text-white">Fecha</th>
                <th className="has-text-white">Descripción</th>
                <th className="has-text-white">Número de Pasos</th>
                <th className="has-text-white">Video</th>
                <th className="has-text-centered has-text-white">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {temas && temas.length > 0 ? (
                temas.map((tema) => {
                  const allFieldsFilled = validateTemaFields(tema);
                  return (
                    <tr key={tema._id}>
                      <td className="has-text-white">{tema.titulo}</td>
                      <td className="has-text-white">{tema.responsable}</td>
                      <td className="has-text-white">
                        {new Date(tema.fecha_creacion).toLocaleDateString()}
                      </td>
                      <td className="has-text-white">{tema.descripcion}</td>
                      <td className="has-text-white">
                        {tema.pasos ? tema.pasos.length : 0} pasos
                      </td>
                      <td className="has-text-white">
                        {tema.video ? (
                          <a
                            className="has-text-link"
                            href={tema.video}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            Ver Video
                          </a>
                        ) : (
                          <div>
                            <span
                              className="icon has-text-link is-large button-tooltip "
                              onClick={() => handleUploadVideo(tema._id)}
                              data-tooltip="Subir video"
                            >
                              <i className="fas fa-upload fa-lg"></i>
                            </span>
                          </div>
                        )}
                      </td>

                      <td className="has-text-centered has-text-white">
                        <div className="buttons is-centered is-grouped">
                          <button
                            className="button is-small is-info button-tooltip"
                            onClick={() => handleEdit(tema)}
                            data-tooltip="Editar"
                          >
                            <span className="icon">
                              <i className="fas fa-edit"></i>
                            </span>
                          </button>

                          <button
                            className="button is-small is-danger button-tooltip"
                            onClick={() => confirmDelete(tema._id)}
                            data-tooltip="Eliminar"
                          >
                            <span className="icon">
                              <i className="fas fa-trash"></i>
                            </span>
                          </button>

                          <button
                            className="button is-small is-warning button-tooltip"
                            onClick={() => handleDownloadTema(tema._id)}
                            data-tooltip="Descargar Excel"
                          >
                            <span className="icon">
                              <i className="fas fa-file-download"></i>
                            </span>
                          </button>
                          <button
                            className={`button is-small ${
                              tema.habilitado ? "is-success" : "is-light"
                            }`}
                            onClick={() => handleToggleHabilitar(tema._id)}
                            data-tooltip={
                              tema.habilitado
                                ? "Deshabilitar tema"
                                : "Habilitar tema"
                            }
                            disabled={!allFieldsFilled}
                          >
                            <span className="icon">
                              <i
                                className={`fas ${
                                  tema.habilitado ? "fa-eye-slash" : "fa-eye"
                                }`}
                              ></i>
                            </span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td className="has-text-white" colSpan="7">
                    No hay temas disponibles.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {temaToDelete && (
          <div className={`modal ${temaToDelete ? "is-active" : ""}`}>
            <div className="modal-background"></div>
            <div className="modal-card has-background-white">
              <header
                className="modal-card-head has-background-white"
                style={{ justifyContent: "center" }}
              >
                <p className="modal-card-title has-text-centered has-text-black ">
                  Confirmar Eliminación
                </p>
                <button
                  className="delete"
                  aria-label="close"
                  onClick={cancelDelete}
                ></button>
              </header>
              <section className="modal-card-body has-background-white">
                <p className="has-text-centered has-text-black">
                  ¿Estás seguro de que deseas eliminar este tema?
                </p>
              </section>
              <footer
                className="modal-card-foot has-background-white"
                style={{ justifyContent: "center" }}
              >
                <button
                  className="button is-danger"
                  style={{ marginRight: "10px" }}
                  onClick={() => handleEliminarTema(temaToDelete)}
                >
                  Eliminar
                </button>
                <button className="button is-info" onClick={cancelDelete}>
                  Cancelar
                </button>
              </footer>
            </div>
          </div>
        )}

        {editMode && editTema && (
          <div className={`modal ${editMode ? "is-active" : ""}`}>
            <div className="modal-background"></div>
            <div className="modal-card ">
              <header className="modal-card-head has-background-black-bis">
                <p className="modal-card-title has-text-white">Editar Tema</p>
                <button
                  className="delete"
                  aria-label="close"
                  onClick={handleModalClose}
                ></button>
              </header>
              <section className="modal-card-body has-background-black-bis">
                {alert.message && (
                  <div
                    className={`notification ${
                      alert.type === "success" ? "is-success" : "is-danger"
                    }`}
                  >
                    <button
                      className="delete"
                      onClick={() => setAlert({ type: "", message: "" })}
                    ></button>
                    {alert.message}
                  </div>
                )}
                {validationErrors.length > 0 && (
                  <div className="notification is-danger">
                    <button
                      className="delete"
                      onClick={() => setValidationErrors([])}
                    ></button>
                    {validationErrors.map((error, index) => (
                      <p key={index}>{error}</p>
                    ))}
                  </div>
                )}
                <div className="field">
                  <label className="label">Título</label>
                  <div className="control">
                    <input
                      className="input"
                      type="text"
                      value={editTema.titulo}
                      onChange={(e) =>
                        setEditTema({ ...editTema, titulo: e.target.value })
                      }
                    />
                  </div>
                </div>
                <div className="field">
                  <label className="label">Descripción</label>
                  <div className="control">
                    <input
                      className="input"
                      type="text"
                      value={editTema.descripcion}
                      onChange={(e) =>
                        setEditTema({
                          ...editTema,
                          descripcion: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
                <div className="field">
                  <label className="label">Responsable</label>
                  <div className="control">
                    <input
                      className="input"
                      type="text"
                      value={editTema.responsable}
                      onChange={(e) =>
                        setEditTema({
                          ...editTema,
                          responsable: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
                <div className="field">
                  <label className="label">Bibliografía</label>
                  <div className="control">
                    <input
                      className="input"
                      type="text"
                      value={editTema.bibliografia}
                      onChange={(e) =>
                        setEditTema({
                          ...editTema,
                          bibliografia: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
                {getCurrentPageItems().map((paso, index) => (
                  <div
                    key={index}
                    className="box"
                    style={{ marginBottom: "1rem" }}
                  >
                    <div className="field">
                      <label className="label">
                        Paso {index + 1 + (currentPage - 1) * itemsPerPage}
                      </label>
                      <div className="control">
                        <input
                          className="input"
                          type="text"
                          value={paso.Titulo}
                          onChange={(e) => {
                            const newPasos = [...editTema.pasos];
                            newPasos[
                              index + (currentPage - 1) * itemsPerPage
                            ].Titulo = e.target.value;
                            setEditTema({ ...editTema, pasos: newPasos });
                          }}
                        />
                      </div>
                    </div>
                    <div className="field">
                      <label className="label">Descripción</label>
                      <div className="control">
                        <input
                          className="input"
                          type="text"
                          value={paso.Descripcion}
                          onChange={(e) => {
                            const newPasos = [...editTema.pasos];
                            newPasos[
                              index + (currentPage - 1) * itemsPerPage
                            ].Descripcion = e.target.value;
                            setEditTema({ ...editTema, pasos: newPasos });
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
                <nav
                  className="pagination is-centered "
                  role="navigation"
                  aria-label="pagination"
                >
                  <button
                    className="pagination-previous"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    Anterior
                  </button>
                  <button
                    className="pagination-next"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    Siguiente
                  </button>
                  <ul className="pagination-list">
                    {Array.from({ length: totalPages }, (_, i) => (
                      <li key={i}>
                        <button
                          className={`pagination-link ${
                            currentPage === i + 1 ? "is-current" : ""
                          }`}
                          onClick={() => handlePageChange(i + 1)}
                        >
                          {i + 1}
                        </button>
                      </li>
                    ))}
                  </ul>
                </nav>
              </section>
              <footer className="modal-card-foot has-background-black-bis ">
                <button className="button is-success" onClick={handleSaveEdit}>
                  Guardar
                </button>
                <button className="button" onClick={handleModalClose}>
                  Cancelar
                </button>
              </footer>
            </div>
          </div>
        )}
        {videoModalOpen && (
          <div className={`modal ${videoModalOpen ? "is-active" : ""}`}>
            <div className="modal-background"></div>
            <div className="modal-content">
              <div className="modal-card">
                <header className="modal-card-head">
                  <p className="modal-card-title has-text-centered">
                    Subir Video
                  </p>
                  <button
                    className="delete"
                    aria-label="close"
                    onClick={handleCancelUpload}
                  ></button>
                </header>
                <section className="modal-card-body has-text-centered">
                  <div className="file has-name is-boxed is-centered">
                    <label className="file-label">
                      <input
                        className="file-input"
                        type="file"
                        accept="video/*"
                        onChange={handleVideoChange}
                      />
                      <span className="file-cta">
                        <span className="file-icon">
                          <i className="fas fa-upload"></i>
                        </span>
                        <span className="file-label">Subir video</span>
                      </span>
                      <span className="file-name">
                        {videoFile
                          ? videoFile.name
                          : "Ningún archivo seleccionado"}
                      </span>
                    </label>
                  </div>
                </section>
                <footer className="modal-card-foot is-centered">
                  <div className="buttons">
                    <button
                      className={`button is-success mr-4 ${
                        uploadingVideo ? "is-loading" : ""
                      }`}
                      onClick={handleConfirmUpload}
                      disabled={!videoFile || uploadingVideo}
                    >
                      {uploadingVideo ? "Subiendo..." : "Subir Video"}
                    </button>
                    <button className="button" onClick={handleCancelUpload}>
                      Cancelar
                    </button>
                  </div>
                </footer>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Contenidos;
