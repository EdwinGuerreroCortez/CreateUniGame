// src/componentes/administrativo/GestionUsuariosForm.js

import React, { useState } from 'react';
import 'bulma/css/bulma.min.css';
import '../CSS/adminForms.css'; // Archivo CSS adicional para estilos específicos

const GestionUsuariosForm = () => {
  const [usuario, setUsuario] = useState({
    nombre: '',
    apellidoPaterno: '',
    apellidoMaterno: '',
    nomusuario: '',
    correo: '',
    contrasena: '',
    rol: 'cliente' // Valor predeterminado
  });

  const [usuarios, setUsuarios] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUsuario({
      ...usuario,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setUsuarios([...usuarios, usuario]);
    setUsuario({
      nombre: '',
      apellidoPaterno: '',
      apellidoMaterno: '',
      nomusuario: '',
      correo: '',
      contrasena: '',
      rol: 'cliente'
    });
  };

  const handleEliminarUsuario = (index) => {
    setUsuarios(usuarios.filter((_, i) => i !== index));
  };

  return (
    <div className="container">
      <h1 className="title has-text-centered">Gestión de Usuarios</h1>
      <div className="box">
        <form onSubmit={handleSubmit}>
          <div className="columns is-multiline">
            <div className="column is-half">
              <div className="field">
                <label className="label">Nombre</label>
                <div className="control">
                  <input className="input" type="text" name="nombre" value={usuario.nombre} onChange={handleChange} placeholder="Nombre" required />
                </div>
              </div>
              <div className="field">
                <label className="label">Apellido Paterno</label>
                <div className="control">
                  <input className="input" type="text" name="apellidoPaterno" value={usuario.apellidoPaterno} onChange={handleChange} placeholder="Apellido Paterno" required />
                </div>
              </div>
              <div className="field">
                <label className="label">Apellido Materno</label>
                <div className="control">
                  <input className="input" type="text" name="apellidoMaterno" value={usuario.apellidoMaterno} onChange={handleChange} placeholder="Apellido Materno" required />
                </div>
              </div>
            </div>
            <div className="column is-half">
              <div className="field">
                <label className="label">Nombre de Usuario</label>
                <div className="control">
                  <input className="input" type="text" name="nomusuario" value={usuario.nomusuario} onChange={handleChange} placeholder="Nombre de Usuario" required />
                </div>
              </div>
              <div className="field">
                <label className="label">Correo Electrónico</label>
                <div className="control">
                  <input className="input" type="email" name="correo" value={usuario.correo} onChange={handleChange} placeholder="Correo Electrónico" required />
                </div>
              </div>
              <div className="field">
                <label className="label">Contraseña</label>
                <div className="control">
                  <input className="input" type="password" name="contrasena" value={usuario.contrasena} onChange={handleChange} placeholder="Contraseña" required />
                </div>
              </div>
              <div className="field">
                <label className="label">Rol</label>
                <div className="control">
                  <div className="select is-fullwidth">
                    <select name="rol" value={usuario.rol} onChange={handleChange}>
                      <option value="cliente">Cliente</option>
                      <option value="administrador">Administrador</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="field is-grouped is-grouped-centered">
            <div className="control">
              <button className="button is-success" type="submit">Guardar Usuario</button>
            </div>
          </div>
        </form>
      </div>
      <div className="box">
        <h2 className="title is-4 has-text-centered">Lista de Usuarios</h2>
        <table className="table is-fullwidth is-striped is-hoverable">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Apellido Paterno</th>
              <th>Apellido Materno</th>
              <th>Nombre de Usuario</th>
              <th>Correo</th>
              <th>Rol</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map((u, index) => (
              <tr key={index}>
                <td>{u.nombre}</td>
                <td>{u.apellidoPaterno}</td>
                <td>{u.apellidoMaterno}</td>
                <td>{u.nomusuario}</td>
                <td>{u.correo}</td>
                <td>{u.rol}</td>
                <td>
                  <button className="button is-danger is-small" onClick={() => handleEliminarUsuario(index)}>Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default GestionUsuariosForm;
