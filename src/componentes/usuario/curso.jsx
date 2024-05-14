import React, { useState } from 'react';
import 'bulma/css/bulma.min.css';

const temas = [
  { id: 1, titulo: 'Tema 1', descripcion: 'Descripción del tema 1', video: 'video1.mp4' },
  { id: 2, titulo: 'Tema 2', descripcion: 'Descripción del tema 2', video: 'video2.mp4' },
  { id: 3, titulo: 'Tema 3', descripcion: 'Descripción del tema 3', video: 'video3.mp4' },
  { id: 4, titulo: 'Tema 4', descripcion: 'Descripción del tema 4', video: 'video4.mp4' },
  { id: 5, titulo: 'Tema 5', descripcion: 'Descripción del tema 5', video: 'video5.mp4' },
  { id: 6, titulo: 'Tema 6', descripcion: 'Descripción del tema 6', video: 'video6.mp4' },
  { id: 7, titulo: 'Tema 7', descripcion: 'Descripción del tema 7', video: 'video7.mp4' },
  { id: 8, titulo: 'Tema 8', descripcion: 'Descripción del tema 8', video: 'video8.mp4' },
  { id: 9, titulo: 'Tema 9', descripcion: 'Descripción del tema 9', video: 'video9.mp4' },
  { id: 10, titulo: 'Tema 10', descripcion: 'Descripción del tema 10', video: 'video10.mp4' },
  { id: 11, titulo: 'Tema 11', descripcion: 'Descripción del tema 11', video: 'video11.mp4' },
  { id: 12, titulo: 'Tema 12', descripcion: 'Descripción del tema 12', video: 'video12.mp4' },
  { id: 13, titulo: 'Tema 13', descripcion: 'Descripción del tema 13', video: 'video13.mp4' },
  { id: 14, titulo: 'Tema 14', descripcion: 'Descripción del tema 14', video: 'video14.mp4' },
  { id: 15, titulo: 'Tema 15', descripcion: 'Descripción del tema 15', video: 'video15.mp4' },
  { id: 16, titulo: 'Tema 16', descripcion: 'Descripción del tema 16', video: 'video16.mp4' },
  { id: 17, titulo: 'Tema 17', descripcion: 'Descripción del tema 17', video: 'video17.mp4' },
  { id: 18, titulo: 'Tema 18', descripcion: 'Descripción del tema 18', video: 'video18.mp4' },
];

const Curso = () => {
  const [paginaActual, setPaginaActual] = useState(1);
  const [temaSeleccionado, setTemaSeleccionado] = useState(null);
  const temasPorPagina = 6;

  const indiceUltimoTema = paginaActual * temasPorPagina;
  const indicePrimerTema = indiceUltimoTema - temasPorPagina;
  const temasActuales = temas.slice(indicePrimerTema, indiceUltimoTema);
  const totalPaginas = Math.ceil(temas.length / temasPorPagina);

  const seleccionarTema = (tema) => {
    setTemaSeleccionado(tema);
  };

  const cambiarPagina = (numeroPagina) => {
    setPaginaActual(numeroPagina);
    setTemaSeleccionado(null); // Deseleccionar tema al cambiar de página
  };

  return (
    <div className="section has-background-light">
      <div className="container">
        <div className="columns">
          <div className="column is-one-quarter">
            <div className="box">
              <h2 className="title is-4">Temas</h2>
              {temasActuales.map((tema) => (
                <div
                  key={tema.id}
                  className="box"
                  style={{ cursor: 'pointer' }}
                  onClick={() => seleccionarTema(tema)}
                >
                  {tema.titulo}
                </div>
              ))}
              <nav className="pagination is-centered" role="navigation" aria-label="pagination">
                <ul className="pagination-list">
                  {[...Array(totalPaginas)].map((_, i) => (
                    <li key={i}>
                      <a
                        className={`pagination-link ${paginaActual === i + 1 ? 'is-current' : ''}`}
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
              <div className="box">
                <h2 className="title is-4">{temaSeleccionado.titulo}</h2>
                <p>{temaSeleccionado.descripcion}</p>
                <video width="100%" controls>
                  <source src={temaSeleccionado.video} type="video/mp4" />
                  Tu navegador no soporta el video.
                </video>
              </div>
            ) : (
              <div className="box">
                <h2 className="title is-4">Seleccione un tema para ver los detalles</h2>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Curso;
