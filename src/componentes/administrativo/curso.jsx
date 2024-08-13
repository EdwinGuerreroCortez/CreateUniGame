import React, { useState, useEffect } from "react";
import axios from "axios";
import "bulma/css/bulma.min.css";
import "../CSS/adminForms.css";

const CursosForm = () => {
  const [nombre, setNombre] = useState("");
  const [cursos, setCursos] = useState([]);
  const [alert, setAlert] = useState({ type: "", message: "" });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchCursos = async () => {
      try {
        const response = await axios.get("http://localhost:3001/api/cursos");
        const cursosConUsuarios = await Promise.all(response.data.map(async curso => {
          if (curso.usuario) {
            try {
              const usuarioResponse = await axios.get(`http://localhost:3001/api/usuarios/${curso.usuario}`);
              return { ...curso, usuarioNombre: usuarioResponse.data.datos_personales.nombre };
            } catch (error) {
              console.error(`Error al obtener el usuario para el curso ${curso.nombre}:`, error);
              return { ...curso, usuarioNombre: "Desconocido" };
            }
          } else {
            return { ...curso, usuarioNombre: "Admin" };
          }
        }));
        setCursos(cursosConUsuarios);
      } catch (error) {
        console.error("Error al cargar los cursos:", error);
      }
    };

    fetchCursos();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!nombre.trim()) {
      setAlert({ type: "error", message: "El nombre del curso no puede estar vacío." });
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.post("http://localhost:3001/api/curso", { nombre });

      if (response.status === 201) {
        const nuevoCurso = response.data;
        if (nuevoCurso.usuario) {
          try {
            const usuarioResponse = await axios.get(`http://localhost:3001/api/usuarios/${nuevoCurso.usuario}`);
            nuevoCurso.usuarioNombre = usuarioResponse.data.datos_personales.nombre;
          } catch (error) {
            nuevoCurso.usuarioNombre = "Desconocido";
          }
        } else {
          nuevoCurso.usuarioNombre = "Admin";
        }
        setCursos([...cursos, nuevoCurso]);
        setAlert({ type: "success", message: "Curso creado exitosamente." });
        setNombre("");
      }
    } catch (error) {
      console.error("Error al crear el curso:", error);
      if (error.response && error.response.status === 400) {
        setAlert({ type: "error", message: error.response.data.message });
      } else {
        setAlert({ type: "error", message: "Error al crear el curso. Inténtalo de nuevo." });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseAlert = () => {
    setAlert({ type: "", message: "" });
  };

  return (
    <div style={{ backgroundColor: "#14161A", minHeight: "100vh", padding: "20px" }}>
      <div className="container">
        <h1 className="title has-text-centered has-text-white">Administrar Cursos</h1>

        {alert.message && (
          <div className={`notification ${alert.type === "success" ? "is-success" : "is-danger"}`}>
            <button className="delete" onClick={handleCloseAlert}></button>
            {alert.message}
          </div>
        )}

        <div className="box" style={{ backgroundColor: "#1F1F1F", borderRadius: "10px", marginBottom: "20px" }}>
          <h2 className="subtitle has-text-centered has-text-white">Crear Nuevo Curso</h2>
          <form onSubmit={handleSubmit}>
            <div className="field">
              <label className="label has-text-white">Nombre del Curso</label>
              <div className="control">
                <input
                  className="input"
                  type="text"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  required
                  placeholder="Ingrese el nombre del curso"
                />
              </div>
            </div>
            <div className="field is-grouped is-grouped-right">
              <div className="control">
                <button type="submit" className={`button is-success ${isLoading ? "is-loading" : ""}`}>
                  Crear Curso
                </button>
              </div>
            </div>
          </form>
        </div>

        <div className="box" style={{ backgroundColor: "#1F1F1F", borderRadius: "10px" }}>
          <h2 className="subtitle has-text-centered has-text-white">Cursos Creados</h2>
          <table className="table is-fullwidth is-striped is-hoverable">
            <thead>
              <tr>
                <th className="has-text-white">Nombre del Curso</th>
                <th className="has-text-white">Creado por</th>
              </tr>
            </thead>
            <tbody>
              {cursos.length > 0 ? (
                cursos.map((curso) => (
                  <tr key={curso._id}>
                    <td className="has-text-white">{curso.nombre}</td>
                    <td className="has-text-white">{curso.usuarioNombre}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="has-text-white" colSpan="2">No hay cursos disponibles.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CursosForm;
