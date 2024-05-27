import React, { useState } from 'react';
import 'bulma/css/bulma.min.css';
import '../CSS/forms.css'; // para estilos personalizados

function Formularios() {
  const [formularios, setFormularios] = useState([]);
  const [titulo, setTitulo] = useState('');
  const [url, setUrl] = useState('');
  const [comentario, setComentario] = useState('');
  const [autor, setAutor] = useState('');
  const [editIndex, setEditIndex] = useState(null); // Para rastrear el índice del formulario en edición

  // Maneja el envío del formulario
  const manejarSubmit = (e) => {
    e.preventDefault();
    const fecha = new Date().toLocaleString();
    if (editIndex !== null) {
      // Si hay un índice de edición, actualiza el formulario existente
      const nuevosFormularios = [...formularios];
      nuevosFormularios[editIndex] = { titulo, url, comentario, autor, fecha };
      setFormularios(nuevosFormularios);
      setEditIndex(null);
    } else {
      // Si no hay índice de edición, agrega un nuevo formulario
      const nuevoFormulario = { titulo, url, comentario, autor, fecha };
      setFormularios([...formularios, nuevoFormulario]);
    }
    // Restablecer los campos del formulario
    setTitulo('');
    setUrl('');
    setComentario('');
    setAutor('');
  };

  // Maneja la edición de un formulario
  const manejarEditar = (index) => {
    const formularioAEditar = formularios[index];
    setTitulo(formularioAEditar.titulo);
    setUrl(formularioAEditar.url);
    setComentario(formularioAEditar.comentario);
    setAutor(formularioAEditar.autor);
    setEditIndex(index);
  };

  // Maneja la eliminación de un formulario
  const manejarEliminar = (index) => {
    const nuevosFormularios = [...formularios];
    nuevosFormularios.splice(index, 1);
    setFormularios(nuevosFormularios);
  };

  return (
    <div className="container">
      <div className="columns is-multiline">
        {/* Tarjeta para agregar formulario */}
        <div className="column is-full">
          <div className="box">
            <div className="card-content">
              <h1 className="title has-text-centered has-text-white">{editIndex !== null ? 'Editar Formulario' : 'Agregar Enlace de Formulario'}</h1>
              <form onSubmit={manejarSubmit}>
                <div className="field">
                  <label className="label has-text-white">Autor:</label>
                  <div className="control">
                    <input
                      className="input"
                      type="text"
                      value={autor}
                      onChange={(e) => setAutor(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="field">
                  <label className="label has-text-white">Título del Formulario:</label>
                  <div className="control">
                    <input
                      className="input"
                      type="text"
                      value={titulo}
                      onChange={(e) => setTitulo(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="field">
                  <label className="label has-text-white">URL del Formulario:</label>
                  <div className="control">
                    <input
                      className="input"
                      type="url"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="field">
                  <label className="label has-text-white">Comentario:</label>
                  <div className="control">
                    <textarea
                      className="textarea"
                      value={comentario}
                      onChange={(e) => setComentario(e.target.value)}
                    />
                  </div>
                </div>
                <div className="control">
                  <button className="button is-link">{editIndex !== null ? 'Guardar Cambios' : 'Agregar Formulario'}</button>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Tarjeta para mostrar formularios guardados */}
        <div className="column is-full">
          <div className="box">
            <div className="card-content">
              <h2 className="title is-4 has-text-centered has-text-white">Formularios Guardados</h2>
              <ul>
                {formularios.map((formulario, index) => (
                  <li key={index} className="box">
                    <h3 className="subtitle has-text-white">{formulario.titulo}</h3>
                    <p className="has-text-white">Autor: {formulario.autor}</p>
                    <p className="has-text-white">Fecha: {formulario.fecha}</p>
                    <p className="has-text-white">Comentario: {formulario.comentario}</p>
                    <div className="buttons">
                      <button className="button is-primary" onClick={() => manejarEditar(index)}>{editIndex === index ? 'Cancelar Edición' : 'Editar'}</button>
                      <button className="button is-danger" onClick={() => manejarEliminar(index)}>Eliminar</button>
                      <a className="button is-link" href={formulario.url} target="_blank" rel="noopener noreferrer">Ir al formulario</a>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Formularios;
