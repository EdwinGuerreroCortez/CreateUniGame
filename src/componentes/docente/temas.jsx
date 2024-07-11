import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import "bulma/css/bulma.min.css";
import * as XLSX from "xlsx";
import "../CSS/adminForms2.css"; // Archivo CSS adicional para estilos específicos
import { FaDownload } from "react-icons/fa";

const TemaFormDocente = () => {
  const [file, setFile] = useState(null);
  const [videoFile, setVideoFile] = useState(null);
  const [temas, setTemas] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [alert, setAlert] = useState({ type: "", message: "" });
  const [editMode, setEditMode] = useState(false);
  const [editTema, setEditTema] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [validationErrors, setValidationErrors] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [nuevoPaso, setNuevoPaso] = useState({ Titulo: "", Descripcion: "" });
  const [descripcionTema, setDescripcionTema] = useState("");
  const [pasosTema, setPasosTema] = useState([]);
  const [tituloTema, setTituloTema] = useState("");
  const [responsableTema, setResponsableTema] = useState("");
  const [bibliografiaTema, setBibliografiaTema] = useState("");
  const fileInputRef = useRef(null);

  const [subtemas, setSubtemas] = useState([]);
  const [userCourses, setUserCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    if (userId) {
      fetch(`http://172.16.19.1:3001/api/usuario/${userId}/cursos`)
        .then(response => response.json())
        .then(data => setUserCourses(data))
        .catch(error => console.error('Error fetching user courses:', error));
    }
  }, [userId]);

  useEffect(() => {
    if (alert.message) {
      const timer = setTimeout(() => {
        setAlert({ type: "", message: "" });
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [alert]);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (
      selectedFile &&
      (selectedFile.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
        selectedFile.type === "application/vnd.ms-excel")
    ) {
      setFile(selectedFile);
      processExcelFile(selectedFile);
    } else {
      setAlert({
        type: "error",
        message: "Solo se permiten archivos Excel (.xlsx, .xls).",
      });
    }
  };

  const processExcelFile = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];
      const json = XLSX.utils.sheet_to_json(worksheet, { defval: "" });
  
      let temas = [];
      let currentTema = null;
      let errors = [];
  
      json.forEach((row, index) => {
        const rowIndex = index + 2; // Índice de fila Excel (1-based)
        if (row["titulo"]) {
          if (currentTema) {
            temas.push(currentTema);
          }
          currentTema = {
            titulo: row["titulo"],
            descripcion: row["descripcion"],
            responsable: row["responsable"],
            bibliografia: row["bibliografia"],
            pasos: [],
            subtemas: [],
          };
  
          // Validaciones del tema
          if (!currentTema.descripcion.trim()) {
            errors.push(`La descripción del tema en la fila ${rowIndex} está vacía.`);
          }
          if (!currentTema.responsable.trim()) {
            errors.push(`El responsable del tema en la fila ${rowIndex} está vacío.`);
          }
          if (!currentTema.bibliografia.trim()) {
            errors.push(`La bibliografía del tema en la fila ${rowIndex} está vacía.`);
          }
        }
  
        if (currentTema) {
          if (row["pasos"] || row["Descripcion"]) {
            if (!row["pasos"].trim()) {
              errors.push(`El título del paso en la fila ${rowIndex} está vacío.`);
            }
            if (!row["Descripcion"].trim()) {
              errors.push(`La descripción del paso en la fila ${rowIndex} está vacía.`);
            }
            currentTema.pasos.push({
              Titulo: row["pasos"],
              Descripcion: row["Descripcion"],
            });
          }
  
          if (row["subtema"] || row["descripcionSubtema"]) {
            if (!row["subtema"].trim()) {
              errors.push(`El título del subtema en la fila ${rowIndex} está vacío.`);
            }
            if (!row["descripcionSubtema"].trim()) {
              errors.push(`La descripción del subtema en la fila ${rowIndex} está vacía.`);
            }
            if (row["subtema"] && row["descripcionSubtema"]) {
              currentTema.subtemas.push({
                titulo: row["subtema"],
                descripcion: row["descripcionSubtema"],
                video: row["Link"] || null,
              });
            }
          }
        }
      });
  
      if (currentTema) {
        temas.push(currentTema);
      }
  
      if (errors.length > 0) {
        setAlert({ type: "error", message: errors.join(", ") });
      } else {
        setTemas(temas);
      }
    };
    reader.readAsArrayBuffer(file);
  };
  

  const handleVideoFileChange = (e) => {
    setVideoFile(e.target.files[0]);
  };

  const handleAgregarPaso = () => {
    setPasosTema([...pasosTema, { Titulo: "", Descripcion: "" }]);
  };

  const handlePasoChange = (e, index, field) => {
    const newPasos = [...pasosTema];
    newPasos[index][field] = e.target.value;
    setPasosTema(newPasos);
  };

  const handleEliminarPaso = (index) => {
    const nuevosPasos = [...pasosTema];
    nuevosPasos.splice(index, 1);
    setPasosTema(nuevosPasos);
  };

  const handleModalClose = () => {
    if (
      tituloTema.trim() ||
      descripcionTema.trim() ||
      pasosTema.some((paso) => paso.Titulo.trim() || paso.Descripcion.trim())
    ) {
      if (
        window.confirm(
          "¿Estás seguro de que quieres salir? Los cambios no se guardarán."
        )
      ) {
        setModalOpen(false);
        setValidationErrors([]);
      }
    } else {
      setModalOpen(false);
      setValidationErrors([]);
    }
  };

  const handleEliminarTema = (index) => {
    const newTemas = [...temas];
    newTemas.splice(index, 1);
    setTemas(newTemas);
  };

  const handleCloseAlert = () => {
    setAlert({ type: "", message: "" });
  };

  const handleDownloadTema = (id) => {
    fetch(`http://172.16.19.1:3001/api/download-tema/${id}`)
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

  const handleDownloadPlantilla = () => {
    fetch(`http://172.16.19.1:3001/api/download-plantilla`)
      .then((response) => response.blob())
      .then((blob) => {
        const url = window.URL.createObjectURL(new Blob([blob]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "Plantilla_tema.xlsx");
        document.body.appendChild(link);
        link.click();
        link.parentNode.removeChild(link);
      })
      .catch((error) => {
        console.error("Error descargando la plantilla:", error);
        setAlert({
          type: "error",
          message: "Error descargando la plantilla. Inténtalo de nuevo.",
        });
      });
  };

  const handleSubirTemas = () => {
    if (!selectedCourse) {
      setAlert({
        type: "error",
        message: "Selecciona un curso antes de subir los temas.",
      });
      return;
    }

    setIsLoading(true);
    fetch("http://172.16.19.1:3001/api/subir-temas", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ temas, cursoId: selectedCourse }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          setAlert({ type: "error", message: data.details ? data.details.join(", ") : data.error });
        } else {
          setAlert({ type: "success", message: "Temas subidos con éxito." });
          setTemas([]); // Limpia la lista de temas después de subirlos
        }
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error subiendo los temas:", error);
        setIsLoading(false);
        setAlert({
          type: "error",
          message: "Error subiendo los temas. Inténtalo de nuevo.",
        });
      });
  };

  const handleEdit = (tema) => {
    setEditMode(true);
    setEditTema(tema);
    setCurrentPage(1); // Reset page to 1 when editing a new tema
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

    fetch(`http://172.16.19.1:3001/api/temas/${editTema._id}`, {
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
          Administrar Temas
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

        <div
          className="box"
          style={{
            backgroundColor: "#1F1F1F",
            borderRadius: "10px",
            marginBottom: "20px",
            maxWidth: "800px",
            margin: "0 auto",
          }}
        >
          <div className="field is-grouped is-grouped-centered">
            <div className="field">
              <label className="label has-text-white">
                Subir Temas en Formato Excel:
              </label>
              <div className="control">
                <div className="file has-name is-fullwidth is-boxed">
                  <label className="file-label">
                    <input
                      className="file-input"
                      type="file"
                      onChange={handleFileChange}
                      accept=".xlsx,.xls"
                    />
                    <span className="file-cta">
                      <span className="file-icon">
                        <i className="fas fa-upload"></i>
                      </span>
                      <span className="file-label">Selecciona un archivo…</span>
                    </span>
                    {file && <span className="file-name">{file.name}</span>}
                  </label>
                </div>
              </div>
            </div>
          </div>
          <div className="field is-grouped is-grouped-right">
            <div className="control">
              <Link to="/docente/temas/contenidos" className="button is-primary">
                Ver Temas
              </Link>
            </div>
            <div className="control">
              <button
                className="button is-info"
                data-tooltip="Descargar plantilla"
                onClick={handleDownloadPlantilla}
              >
                <span className="icon">
                  <FaDownload />
                </span>
              </button>
            </div>
          </div>
        </div>

        <div className="field">
          <label className="label has-text-white">Seleccionar Curso:</label>
          <div className="control">
            <div className="select is-fullwidth">
              <select
                value={selectedCourse}
                onChange={(e) => setSelectedCourse(e.target.value)}
              >
                <option value="">Selecciona un curso</option>
                {userCourses.map((curso) => (
                  <option key={curso._id} value={curso._id}>
                    {curso.nombre}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {temas.length > 0 && (
          <div
            className="box"
            style={{
              backgroundColor: "#1F1F1F",
              borderRadius: "10px",
              maxWidth: "800px",
              margin: "0 auto",
            }}
          >
            <h2 className="title has-text-centered has-text-white">
              Temas a Subir
            </h2>
            <table className="table is-fullwidth is-bordered">
              <thead>
                <tr>
                  <th className="has-text-white">Título del Tema</th>
                  <th className="has-text-white">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {temas.map((tema, index) => (
                  <tr key={index}>
                    <td className="has-text-white">{tema.titulo}</td>
                    <td>
                      <button
                        className="button is-danger is-small"
                        onClick={() => handleEliminarTema(index)}
                        data-tooltip="Eliminar Tema"
                      >
                        <span className="icon">
                          <i className="fas fa-trash-alt"></i>
                        </span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div
              className="field is-grouped is-grouped-centered"
              style={{ marginTop: "20px" }}
            >
              <div className="control">
                <button
                  className={`button is-primary ${
                    isLoading ? "is-loading" : ""
                  }`}
                  onClick={handleSubirTemas}
                >
                  Subir Todos los Temas
                </button>
              </div>
            </div>
          </div>
        )}

        <hr className="hr" style={{ backgroundColor: "#fff" }} />
      </div>
    </div>
  );
};

export default TemaFormDocente;
