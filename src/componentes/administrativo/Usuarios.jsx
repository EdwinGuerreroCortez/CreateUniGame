import React, { useState } from 'react';
import 'bulma/css/bulma.min.css';
import '../CSS/adminForms2.css'; // Archivo CSS adicional para estilos específicos

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
    <div style={{ backgroundColor: '#14161A', minHeight: '100vh', padding: '20px' }}>
      <h1 className="title has-text-centered has-text-white">Gestión de Usuarios</h1>
      <div className="box" style={{ backgroundColor: '#1F1F1F' }}>
        <form onSubmit={handleSubmit}>
          <div className="columns is-multiline">
            <div className="column is-half">
              <div className="field">
                <label className="label has-text-white">Nombre</label>
                <div className="control">
                  <input className="input" type="text" name="nombre" value={usuario.nombre} onChange={handleChange} placeholder="Nombre" required />
                </div>
              </div>
              <div className="field">
                <label className="label has-text-white">Apellido Paterno</label>
                <div className="control">
                  <input className="input" type="text" name="apellidoPaterno" value={usuario.apellidoPaterno} onChange={handleChange} placeholder="Apellido Paterno" required />
                </div>
              </div>
              <div className="field">
                <label className="label has-text-white">Apellido Materno</label>
                <div className="control">
                  <input className="input" type="text" name="apellidoMaterno" value={usuario.apellidoMaterno} onChange={handleChange} placeholder="Apellido Materno" required />
                </div>
              </div>
            </div>
            <div className="column is-half">
              <div className="field">
                <label className="label has-text-white">Nombre de Usuario</label>
                <div className="control">
                  <input className="input" type="text" name="nomusuario" value={usuario.nomusuario} onChange={handleChange} placeholder="Nombre de Usuario" required />
                </div>
              </div>
              <div className="field">
                <label className="label has-text-white">Correo Electrónico</label>
                <div className="control">
                  <input className="input" type="email" name="correo" value={usuario.correo} onChange={handleChange} placeholder="Correo Electrónico" required />
                </div>
              </div>
              <div className="field">
                <label className="label has-text-white">Contraseña</label>
                <div className="control">
                  <input className="input" type="password" name="contrasena" value={usuario.contrasena} onChange={handleChange} placeholder="Contraseña" required />
                </div>
              </div>
              <div className="field">
                <label className="label has-text-white">Rol</label>
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
      <div className="box" style={{ backgroundColor: '#090A0C' }}>
        <h2 className="title is-4 has-text-centered has-text-white">Lista de Usuarios</h2>
        <table className="table is-fullwidth is-striped is-hoverable">
          <thead>
            <tr>
              <th className="has-text-white">Nombre</th>
              <th className="has-text-white">Apellido Paterno</th>
              <th className="has-text-white">Apellido Materno</th>
              <th className="has-text-white">Nombre de Usuario</th>
              <th className="has-text-white">Correo</th>
              <th className="has-text-white">Rol</th>
              <th className="has-text-white">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map((u, index) => (
              <tr key={index}>
                <td className="has-text-white">{u.nombre}</td>
                <td className="has-text-white">{u.apellidoPaterno}</td>
                <td className="has-text-white">{u.apellidoMaterno}</td>
                <td className="has-text-white">{u.nomusuario}</td>
                <td className="has-text-white">{u.correo}</td>
                <td className="has-text-white">{u.rol}</td>
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
