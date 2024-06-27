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
    tipo: 'docente',
    genero: '',
    telefono: '',
  });

  const [usuarios, setUsuarios] = useState([]);
  const [notification, setNotification] = useState({ message: '', type: '' });
  const [isModalActive, setIsModalActive] = useState(false); // Estado para el modal

  useEffect(() => {
    obtenerUsuarios();
    const interval = setInterval(() => {
      obtenerUsuarios(); // Consultar la base de datos cada 0.5 segundos
    }, 500);
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
      [name]: value,
    });
  };

  const validarFormulario = () => {
    const { nombre, apellidoPaterno, apellidoMaterno, nomusuario, correo, contrasena } = usuario;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!nombre || !apellidoPaterno || !apellidoMaterno || !nomusuario || !correo || !contrasena) {
      setNotification({ message: 'Todos los campos son obligatorios.', type: 'is-danger' });
      return false;
    }
    if (!emailRegex.test(correo)) {
      setNotification({ message: 'Correo electrónico no válido.', type: 'is-danger' });
      return false;
    }
    if (contrasena.length < 8) {
      setNotification({ message: 'La contraseña debe tener al menos 8 caracteres.', type: 'is-danger' });
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validarFormulario()) return;
    const endpoint = 'http://localhost:3001/api/usuarios/admin';

    // Convertir género a "M" o "F"
    const generoConvertido = usuario.genero === 'Masculino' ? 'M' : 'F';
    const usuarioConGeneroConvertido = { ...usuario, genero: generoConvertido };

    console.log('Datos del usuario antes de enviar:', usuarioConGeneroConvertido); // Línea de debug

    try {
      await axios.post(endpoint, { ...usuarioConGeneroConvertido });
      obtenerUsuarios();
      setUsuario({
        nombre: '',
        apellidoPaterno: '',
        apellidoMaterno: '',
        nomusuario: '',
        correo: '',
        contrasena: '',
        tipo: 'docente', // Restablecer el campo tipo a su valor por defecto
        genero: '',     // Restablecer el campo genero
        telefono: '',   // Restablecer el campo telefono
      });
      setNotification({ message: 'Usuario registrado con éxito.', type: 'is-success' });
      setIsModalActive(false); // Cerrar el modal
    } catch (error) {
      console.error('Error al guardar usuario:', error);
      setNotification({ message: 'Error al registrar usuario. Intente de nuevo.', type: 'is-danger' });
    }
  };

  const handleEliminarUsuario = async (index, id) => {
    try {
      await axios.delete(`http://localhost:3001/api/usuarios/${id}`);
      setUsuarios(usuarios.filter((_, i) => i !== index));
      setNotification({ message: 'Usuario eliminado con éxito.', type: 'is-success' });
    } catch (error) {
      console.error('Error al eliminar usuario:', error);
      setNotification({ message: 'Error al eliminar usuario. Intente de nuevo.', type: 'is-danger' });
    }
  };

  const handleAutorizarUsuario = async (index, id, autorizacion) => {
    try {
      await axios.put(`http://localhost:3001/api/usuarios/${id}/autorizar`, { autorizacion });
      const updatedUsuarios = [...usuarios];
      updatedUsuarios[index].autorizacion = autorizacion;
      setUsuarios(updatedUsuarios);
      setNotification({ message: `Usuario ${autorizacion ? 'autorizado' : 'desautorizado'} con éxito.`, type: 'is-success' });
    } catch (error) {
      console.error('Error al actualizar autorización:', error);
      setNotification({ message: 'Error al actualizar autorización. Intente de nuevo.', type: 'is-danger' });
    }
  };

  return (
    <div style={{ backgroundColor: '#14161A', minHeight: '100vh', padding: '20px' }}>
      <h1 className="title has-text-centered has-text-white">Gestión de Usuarios</h1>
      {notification.message && (
        <div className={`notification ${notification.type}`}>
          <button className="delete" onClick={() => setNotification({ message: '', type: '' })}></button>
          {notification.message}
        </div>
      )}

      <div className="box" style={{ backgroundColor: '#1F1F1F' }}>
        <div className="control is-pulled-right">
          <button className="button is-success" onClick={() => setIsModalActive(true)}>
            <span className="icon">
              <i className="fas fa-plus"></i>
            </span>
            <span>Agregar Usuario</span>
          </button>
        </div>
        <h2 className="title is-4 has-text-centered has-text-white">Lista de Usuarios</h2>

        <div className="table-container">
          <table className="table is-fullwidth is-striped is-hoverable" style={{ backgroundColor: '#090A0C' }}>
            <thead>
              <tr>
                <th className="has-text-white">Nombre</th>
                <th className="has-text-white">Apellido Paterno</th>
                <th className="has-text-white">Apellido Materno</th>
                <th className="has-text-white">Nombre de Usuario</th>
                <th className="has-text-white">Correo</th>
                <th className="has-text-white">Telefono</th>
                <th className="has-text-white">Rol</th>
                <th className="has-text-white">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map((u, index) => (
                <tr key={index} style={{ color: 'white' }}>
                  <td className="has-text-white">{u.datos_personales.nombre}</td>
                  <td className="has-text-white">{u.datos_personales.apellido_paterno}</td>
                  <td className="has-text-white">{u.datos_personales.apellido_materno}</td>
                  <td className="has-text-white">{u.username}</td>
                  <td className="has-text-white">{u.datos_personales.correo}</td>
                  <td className="has-text-white">{u.datos_personales.telefono}</td>
                  <td className="has-text-white">{u.tipo}</td>
                  <td>
                    <button
                      className={`button ${u.autorizacion ? 'is-success' : 'is-danger'} is-small`}
                      onClick={() => handleAutorizarUsuario(index, u._id, !u.autorizacion)}
                      data-tooltip={u.autorizacion ? 'Revocar Autorización' : 'Autorizar Usuario'}
                    >
                      <span className="icon">
                        <i className={`fas ${u.autorizacion ? 'fa-check' : 'fa-ban'}`}></i>
                      </span>
                    </button>
                    <button
                      className="button is-danger is-small"
                      onClick={() => handleEliminarUsuario(index, u._id)}
                      data-tooltip="Eliminar Usuario"
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
        </div>
      </div>

      {/* Modal para agregar usuario */}
      <div className={`modal ${isModalActive ? 'is-active' : ''}`}>
        <div className="modal-background" onClick={() => setIsModalActive(false)}></div>
        <div className="modal-content">
          <div className="box" style={{ backgroundColor: '#1F1F1F' }}>
            <h2 className="title has-text-centered has-text-white">Agregar Usuario</h2>
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
                  <div className="field">
                    <label className="label has-text-white">Nombre de Usuario</label>
                    <div className="control">
                      <input className="input" type="text" name="nomusuario" value={usuario.nomusuario} onChange={handleChange} placeholder="Nombre de Usuario" required />
                    </div>
                  </div>
                </div>
                <div className="column is-half">
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
                    <label className="label has-text-white">Género</label>
                    <div className="control">
                      <div className="select is-fullwidth">
                        <select name="genero" value={usuario.genero} onChange={handleChange} required>
                          <option value="">Seleccione</option>
                          <option value="Masculino">Masculino</option>
                          <option value="Femenino">Femenino</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  <div className="field">
                    <label className="label has-text-white">Teléfono</label>
                    <div className="control">
                      <input className="input" type="text" name="telefono" value={usuario.telefono} onChange={handleChange} placeholder="Teléfono" required />
                    </div>
                  </div>
                </div>
              </div>
              <div className="field is-grouped is-grouped-right">
                <div className="control">
                  <button type="submit" className="button is-success">
                    <span className="icon">
                      <i className="fas fa-save"></i>
                    </span>
                    <span>Guardar</span>
                  </button>
                </div>
                <div className="control">
                  <button type="button" className="button" onClick={() => setIsModalActive(false)}>
                    <span className="icon">
                      <i className="fas fa-times"></i>
                    </span>
                    <span>Cancelar</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
        <button className="modal-close is-large" aria-label="close" onClick={() => setIsModalActive(false)}></button>
      </div>
    </div>
  );
};

export default GestionUsuariosForm;
