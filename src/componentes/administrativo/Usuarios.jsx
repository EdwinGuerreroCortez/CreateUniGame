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
  const [confirmDelete, setConfirmDelete] = useState({ active: false, index: null, id: null }); // Estado para confirmación de eliminación
  const [filter, setFilter] = useState('all'); // Estado para el filtro de usuarios
  const [filterTipo, setFilterTipo] = useState('all');
  const [showPassword, setShowPassword] = useState(false);
  const [passwordError, setPasswordError] = useState('');



  useEffect(() => {
    obtenerUsuarios();
    const interval = setInterval(() => {
      obtenerUsuarios(); // Consultar la base de datos cada 0.5 segundos
    }, 500);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (notification.message) {
      const timer = setTimeout(() => {
        setNotification({ message: '', type: '' });
      }, 2000); // 2000ms = 2 seconds
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const obtenerUsuarios = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/usuarios');
      const sortedUsuarios = response.data.sort((a, b) => new Date(b.fechaCreacion) - new Date(a.fechaCreacion)); // Ordenar por fecha de creación (último primero)
      setUsuarios(sortedUsuarios);
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
      const errorMessage = error.response && error.response.data && error.response.data.error
        ? error.response.data.error
        : 'Error al registrar usuario. Intente de nuevo.';
      setNotification({ message: errorMessage, type: 'is-danger' });
      setIsModalActive(false); // Cerrar el modal en caso de error también
    }
  };

  const handleEliminarUsuario = async (index, id) => {
    setConfirmDelete({ active: true, index, id });
  };

  const confirmarEliminarUsuario = async () => {
    const { index, id } = confirmDelete;
    try {
      await axios.delete(`http://localhost:3001/api/usuarios/${id}`);
      setUsuarios(usuarios.filter((_, i) => i !== index));
      setNotification({ message: 'Usuario eliminado con éxito.', type: 'is-success' });
    } catch (error) {
      console.error('Error al eliminar usuario:', error);
      setNotification({ message: 'Error al eliminar usuario. Intente de nuevo.', type: 'is-danger' });
    }
    setConfirmDelete({ active: false, index: null, id: null });
  };

  const handleCancelarEliminarUsuario = () => {
    setConfirmDelete({ active: false, index: null, id: null });
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

  const handleAutorizarTodos = async () => {
    try {
      await axios.put('http://localhost:3001/api/usuarios/autorizarTodos');
      const updatedUsuarios = usuarios.map(usuario => ({ ...usuario, autorizacion: true }));
      setUsuarios(updatedUsuarios);
      setNotification({ message: 'Todos los usuarios autorizados con éxito.', type: 'is-success' });
    } catch (error) {
      console.error('Error al autorizar todos los usuarios:', error);
      setNotification({ message: 'Error al autorizar todos los usuarios. Intente de nuevo.', type: 'is-danger' });
    }
  };

  // Función para alternar la visibilidad de la contraseña
  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const validatePassword = (password) => {
    const regex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!regex.test(password)) {
      setPasswordError('La contraseña debe tener al menos 8 caracteres, una mayúscula, un número, y un signo especial.');
    } else {
      setPasswordError('');
    }
    handleChange({ target: { name: 'contrasena', value: password } });
  };

  const filteredUsuarios = usuarios.filter((usuario) => {
    if (filter === 'autorizados') return usuario.autorizacion;
    if (filter === 'noAutorizados') return !usuario.autorizacion;
    return true;
  });
  const filteredUsuariosPorTipo = filteredUsuarios.filter((u) => {
    if (filterTipo === 'all') return true;
    if (filterTipo === 'cliente') return u.tipo === 'cliente' || u.tipo === 'alumno';
    return u.tipo === filterTipo;
  });


  return (
    <div style={{ backgroundColor: '#14161A', minHeight: '100vh', padding: '20px' }}>
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
          <button className="button is-info" onClick={handleAutorizarTodos} style={{ marginLeft: '10px' }}>
            <span className="icon">
              <i className="fas fa-check"></i>
            </span>
            <span>Permitir Todos</span>
          </button>
        </div>
        <div style={{ display: 'inline-flex', alignItems: 'center' }}>
          <div className="control" style={{ marginRight: '20px' }}>
            <p className="has-text-white" style={{ marginBottom: '5px' }}>Acceso:</p>
            <div className="select is-info">
              <select value={filter} onChange={(e) => setFilter(e.target.value)}>
                <option value="all">Todos</option>
                <option value="autorizados">Autorizados</option>
                <option value="noAutorizados">No Autorizados</option>
              </select>
            </div>
          </div>
          <div className="control">
            <p className="has-text-white" style={{ marginBottom: '5px' }}>Tipo:</p>
            <div className="select is-info">
              <select value={filterTipo} onChange={(e) => setFilterTipo(e.target.value)}>
                <option value="all">Todos</option>
                <option value="administrador">Administrador</option>
                <option value="cliente">Alumno</option>
                <option value="docente">Docente</option>
              </select>
            </div>
          </div>
        </div>

        <div className="control">

        </div>
        <h2 className="title is-4 has-text-centered has-text-white">Registro de Usuarios</h2>

        <div className="table-container">
          <table className="table is-fullwidth is-striped is-hoverable" style={{ backgroundColor: '#090A0C' }}>
            <thead>
              <tr>
                <th className="has-text-white">No.</th>
                <th className="has-text-white">Nombre</th>
                <th className="has-text-white">Apellido Paterno</th>
                <th className="has-text-white">Apellido Materno</th>
                <th className="has-text-white">Usuario</th>
                <th className="has-text-white">Correo</th>
                <th className="has-text-white">Telefono</th>
                <th className="has-text-white">Tipo</th>
                <th className="has-text-white">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsuariosPorTipo.map((u, index) => (
                <tr key={index} style={{ color: 'white' }}>
                  <td className="has-text-white">{index + 1}</td>
                  <td className="has-text-white">{u.datos_personales.nombre}</td>
                  <td className="has-text-white">{u.datos_personales.apellido_paterno}</td>
                  <td className="has-text-white">{u.datos_personales.apellido_materno}</td>
                  <td className="has-text-white">{u.username}</td>
                  <td className="has-text-white">{u.datos_personales.correo}</td>
                  <td className="has-text-white">{u.datos_personales.telefono}</td>
                  <td className="has-text-white">{u.tipo === 'cliente' ? 'alumno' : u.tipo}</td>
                  <td>
                    <div className="buttons is-centered is-grouped">
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
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>

          </table>
        </div>
      </div>

      { }
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
                  <div className="field">
                    <label className="label has-text-white">Tipo de Usuario</label>
                    <div className="control">
                      <div className="select is-fullwidth">
                        <select name="tipo" value={usuario.tipo} onChange={handleChange} required>
                          <option value="docente">Docente</option>
                          <option value="administrador">Administrador</option>
                        </select>
                      </div>
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
                    <div className="control has-icons-right">
                      <input
                        className="input"
                        type={showPassword ? 'text' : 'password'}
                        name="contrasena"
                        value={usuario.contrasena}
                        onChange={(e) => validatePassword(e.target.value)}
                        placeholder="Contraseña"
                        required
                      />
                      <button
                        type="button"
                        className="button is-small is-ghost is-right"
                        onClick={toggleShowPassword}
                        style={{ cursor: 'pointer', border: 'none', backgroundColor: 'transparent', position: 'absolute', right: '10px', top: '27%', transform: 'translateY(-50%)', height: '20px', width: '20px' }}
                      >
                        <span className="icon">
                          <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                        </span>
                      </button>
                    </div>
                    {passwordError && <p className="help is-danger">{passwordError}</p>}
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

      { }
      {confirmDelete.active && (
        <div className={`modal ${confirmDelete.active ? "is-active" : ""}`}>
          <div className="modal-background"></div>
          <div className="modal-content">
            <div className="modal-card has-background-black">
              <header className="modal-card-head has-background-black-bis" style={{ justifyContent: "center" }}>
                <p className="modal-card-title has-text-centered has-text-white">
                  Confirmar Eliminación
                </p>
                <button className="delete" aria-label="close" onClick={handleCancelarEliminarUsuario}></button>
              </header>
              <section className="modal-card-body has-background-black-bis">
                <p className="has-text-centered has-text-white">
                  ¿Estás seguro de que quieres eliminar este usuario?
                </p>
              </section>
              <footer className="modal-card-foot has-background-black-bis" style={{ justifyContent: "center" }}>
                <button className="button is-danger" style={{ marginRight: "20px" }} onClick={confirmarEliminarUsuario}>
                  Eliminar
                </button>
                <button className="button" onClick={handleCancelarEliminarUsuario}>
                  Cancelar
                </button>
              </footer>
            </div>
          </div>
          <button className="modal-close is-large" aria-label="close" onClick={handleCancelarEliminarUsuario}></button>
        </div>
      )}
    </div>
  );
};

export default GestionUsuariosForm;
