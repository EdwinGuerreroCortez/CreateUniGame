import React, { useState } from "react";
import "bulma/css/bulma.min.css";
import '../CSS/carga.css';

const temas = [
  {
    id: 1,
    titulo: "Introducción",
    descripcion: `
      En este tema, aprenderás sobre los conceptos básicos y la importancia de Unity y C# en el desarrollo de videojuegos. Además, te guiaremos a través del proceso de instalación de Unity y configuración de tu entorno de desarrollo para empezar a programar en C#.
    `,
    pasos: `
      \n1. Visita el sitio web oficial de Unity: [Unity Download](https://unity.com/).
      \n2. Descarga el Unity Hub, que es una herramienta que te permite instalar y gestionar diferentes versiones de Unity.
      \n3. Una vez instalado el Unity Hub, abre la aplicación y haz clic en 'Instalar Unity Editor'.
      \n4. Selecciona la versión de Unity que deseas instalar y sigue las instrucciones para completar la instalación.
      \n5. Después de instalar Unity, abre el Unity Hub y crea un nuevo proyecto.
      \n6. Unity incluye Visual Studio, un IDE que soporta C#. Si no está instalado, visita [Visual Studio](https://visualstudio.microsoft.com/) para descargar e instalar la versión gratuita.
      \n7. Abre tu nuevo proyecto de Unity, y Visual Studio se abrirá automáticamente cuando edites scripts en C#.
    `,
    video: "video1.mp4",
    autor: "Juan Pérez",
    fecha: "2024-05-17",
  },
  {
    id: 2,
    titulo: "Tema 2",
    descripcion: "Descripción del tema 2",
    pasos: "",
    video: "video2.mp4",
    autor: "Ana Gómez",
    fecha: "2024-05-18",
  },
  {
    id: 3,
    titulo: "Tema 3",
    descripcion: "Descripción del tema 3",
    pasos: "",
    video: "video3.mp4",
    autor: "Carlos Ruiz",
    fecha: "2024-05-19",
  },
  {
    id: 4,
    titulo: "Tema 4",
    descripcion: "Descripción del tema 4",
    pasos: "",
    video: "video4.mp4",
    autor: "Laura Martínez",
    fecha: "2024-05-20",
  },
  {
    id: 5,
    titulo: "Tema 5",
    descripcion: "Descripción del tema 5",
    pasos: "",
    video: "video5.mp4",
    autor: "Marta Sánchez",
    fecha: "2024-05-21",
  },
  {
    id: 6,
    titulo: "Tema 6",
    descripcion: "Descripción del tema 6",
    pasos: "",
    video: "video6.mp4",
    autor: "Luis Torres",
    fecha: "2024-05-22",
  },
  {
    id: 7,
    titulo: "Tema 7",
    descripcion: "Descripción del tema 7",
    pasos: "",
    video: "video7.mp4",
    autor: "Elena Díaz",
    fecha: "2024-05-23",
  },
];

const Curso = () => {
  const [paginaActual, setPaginaActual] = useState(1);
  const [temaSeleccionado, setTemaSeleccionado] = useState(null);
  const [evidencia, setEvidencia] = useState({ tipo: "", archivo: null });
  const [mostrarTemas, setMostrarTemas] = useState(false);
  const temasPorPagina = 6;

  const indiceUltimoTema = paginaActual * temasPorPagina;
  const indicePrimerTema = indiceUltimoTema - temasPorPagina;
  const temasActuales = temas.slice(indicePrimerTema, indiceUltimoTema);
  const totalPaginas = Math.ceil(temas.length / temasPorPagina);

  const seleccionarTema = (tema) => {
    setTemaSeleccionado(tema);
    setMostrarTemas(false); // Ocultar el panel de temas en móviles al seleccionar un tema
  };

  const cambiarPagina = (numeroPagina) => {
    setPaginaActual(numeroPagina);
    setTemaSeleccionado(null); // Deseleccionar tema al cambiar de página
  };

  const handleTypeChange = (e) => {
    const { value } = e.target;
    setEvidencia({ tipo: value, archivo: null });
  };

  const handleFileChange = (e) => {
    const { files } = e.target;
    setEvidencia((prev) => ({ ...prev, archivo: files[0] }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Evidencia enviada:", evidencia);
  };

  return (
    <div className="section has-background-black-bis">
      <div className="container">
        <div className="columns">
          <div className="column is-one-quarter">
            <button
              className="button is-primary tema-panel-button"
              onClick={() => setMostrarTemas(!mostrarTemas)}
            >
              {mostrarTemas ? "Ocultar Temas" : "Mostrar Temas"}
            </button>
            <div className={`box tema-panel ${mostrarTemas ? 'is-active' : ''}`} style={{ background: 'rgb(2, 25, 41)', boxShadow: '0px 0px 10px 0px rgba(255,255,255,0.5)', marginTop:'20px' }}>
              <h2 className="title is-4 has-text-white">Temas</h2>
              {temasActuales.map((tema) => (
                <div
                  key={tema.id}
                  className="card has-background-primary"
                  style={{ cursor: "pointer", marginBottom: "1rem", marginTop:'20px'}}
                  onClick={() => seleccionarTema(tema)}
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
                  {[...Array(totalPaginas)].map((_, i) => (
                    <li key={i}>
                      <a
                        className={`pagination-link ${
                          paginaActual === i + 1 ? "is-current" : ""
                        }`}
                        onClick={() => cambiarPagina(i + 1)}
                      >
                        {i + 1}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>
          </div>
          <div className="column is-three-quarters">
            {temaSeleccionado ? (
              <div className="box has-text-white" style={{ background: 'rgb(2, 25, 41)' , marginTop:'20px'}}>
                <h2 className="title is-4 has-text-white">{temaSeleccionado.titulo}</h2>
                <p className="is-size-6">Autor: {temaSeleccionado.autor}</p>
                <p className="is-size-6">Fecha: {temaSeleccionado.fecha}</p>
                <h2 className="title is-3 has-text-centered has-text-white">Descripción</h2>
                <p>{temaSeleccionado.descripcion}</p>
                {temaSeleccionado.pasos && (
                  <>
                    <h2 className="title is-4 has-text-centered has-text-white">Pasos</h2>
                    <p>{temaSeleccionado.pasos}</p>
                  </>
                )}
                <video width="100%" controls>
                  <source src={temaSeleccionado.video} type="video/mp4" />
                  Tu navegador no soporta el video.
                </video>
                {temaSeleccionado.id === 1 && (
                  <div className="has-text-centered">
                    <button
                      className="button is-link"
                      onClick={() => window.open('https://docs.google.com/forms/d/e/1FAIpQLSeBvjz7Gij4gL7_VCPZcAd_9MBjyNkwub9HBGdMVBvuWRteBg/viewform?usp=sf_link', '_blank')}
                      style={{ marginTop: '20px' }}
                    >
                      Responder Evaluación
                    </button>
                  </div>
                )}
                <form onSubmit={handleSubmit}>
                  <div className="field">
                    <label className="label has-text-white">Tipo de evidencia</label>
                    <div className="control">
                      <div className="select">
                        <select
                          onChange={handleTypeChange}
                          value={evidencia.tipo}>
                          <option value="" disabled>
                            Selecciona tipo de evidencia
                          </option>
                          <option value="imagen">Imagen</option>
                          <option value="video">Video</option>
                          <option value="documento">Documento</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  {evidencia.tipo && (
                    <div className="field">
                      <label className="label has-text-white">Subir {evidencia.tipo}</label>
                      <div className="control">
                        <input
                          className="input"
                          type="file"
                          name={evidencia.tipo}
                          accept={
                            evidencia.tipo === "imagen" ? "image/*" :
                            evidencia.tipo === "video" ? "video/*" : "application/pdf"
                          }
                          onChange={handleFileChange}/>
                      </div>
                    </div>
                  )}
                  <div className="control">
                    <button className="button is-primary" type="submit">
                      Enviar evidencia
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              <div className="box has-text-white" style={{ background: 'rgb(2, 25, 41)', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                <h2 className="title is-4 has-text-white" style={{ textAlign: 'center' }}>
                  Por favor, elige un tema para ver más información
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
