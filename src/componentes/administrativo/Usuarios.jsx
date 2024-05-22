import React, { useState, useEffect } from 'react';
import axios from 'axios';
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

  useEffect(() => {
    obtenerUsuarios();
    const interval = setInterval(() => {
      obtenerUsuarios(); // Consultar la base de datos cada 5 segundos
    }, 500); // 500 milisegundos = 0.5 segundos
    return () => clearInterval(interval);
  }, []);

  const obtenerUsuarios = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/usuarios');
      setUsuarios(response.data);
    } catch (error) {
      console.error('Error al obtener usuarios:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUsuario({
      ...usuario,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:3001/api/usuarios', usuario);
      obtenerUsuarios();
      setUsuario({
        nombre: '',
        apellidoPaterno: '',
        apellidoMaterno: '',
        nomusuario: '',
        correo: '',
        contrasena: '',
        rol: 'cliente'
      });
    } catch (error) {
      console.error('Error al guardar usuario:', error);
    }
  };
  
  const handleEliminarUsuario = async (index, id) => {
    try {
      await axios.delete(`http://localhost:3001/api/usuarios/${id}`);
      setUsuarios(usuarios.filter((_, i) => i !== index));
    } catch (error) {
      console.error('Error al eliminar usuario:', error);
    }
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
      <div className="box" style={{ backgroundColor: '#1F1F1F' }}>
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
                <td className="has-text-white">{u.datos_personales.nombre}</td>
                <td className="has-text-white">{u.datos_personales.apellido_paterno}</td>
                <td className="has-text-white">{u.datos_personales.apellido_materno}</td>
                <td className="has-text-white">{u.username}</td>
                <td className="has-text-white">{u.datos_personales.correo}</td>
                <td className="has-text-white">{u.tipo}</td>
                <td>
                  <button className="button is-danger is-small" onClick={() => handleEliminarUsuario(index, u._id)}>Eliminar</button>
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