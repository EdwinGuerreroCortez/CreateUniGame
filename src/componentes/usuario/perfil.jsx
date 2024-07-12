import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bulma/css/bulma.min.css'; // Importa Bulma CSS
import '../CSS/perfil.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faUserTie, faUserGraduate, faBirthdayCake, faPhone, faEnvelope, faKey, faSave, faEdit, faTimes } from '@fortawesome/free-solid-svg-icons';

const Perfil = ({ estaAbierto, alCerrar }) => {
  const [usuario, setUsuario] = useState({
    nombreUsuario: '',
    nombre: '',
    apellidoPaterno: '',
    apellidoMaterno: '',
    edad: '',
    telefono: '',
    correo: '',
    matricula: '',
    contrasena: '',
    imagen: ''
  });

  const [editando, setEditando] = useState(false);
  const [cargando, setCargando] = useState(false);
  const [imagenTemporal, setImagenTemporal] = useState('');
  const [imagenFile, setImagenFile] = useState(null);
  const [mensajeExito, setMensajeExito] = useState('');
  const [mensajeError, setMensajeError] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      const userId = localStorage.getItem('userId');
      if (userId) {
        try {
          const response = await axios.get(`http://172.16.19.1:3001/api/usuarios/${userId}`);
          const data = response.data;
          setUsuario({
            nombreUsuario: data.username,
            nombre: data.datos_personales.nombre,
            apellidoPaterno: data.datos_personales.apellido_paterno,
            apellidoMaterno: data.datos_personales.apellido_materno,
            edad: data.datos_personales.edad,
            telefono: data.datos_personales.telefono,
            correo: data.datos_personales.correo,
            matricula: data.datos_personales.matricula,
            contrasena: '',
            imagen: data.imagenPerfil
          });
        } catch (error) {
          console.error('Error al obtener los datos del usuario', error);
          setMensajeError('Error al obtener los datos del usuario.');
        }
      }
    };

    fetchUserData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUsuario({
      ...usuario,
      [name]: value
    });
  };

  const handleImagenChange = (e) => {
    const file = e.target.files[0];
    setImagenTemporal(URL.createObjectURL(file));
    setImagenFile(file);
  };

  const handleGuardarImagen = async () => {
    if (!imagenFile) return;

    const formData = new FormData();
    formData.append('imagen', imagenFile);

    try {
      const response = await axios.post('https://gamebackend-1.onrender.com/api/imagenes/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      const imageUrl = response.data.url;
      const userId = localStorage.getItem('userId');

      await axios.put(`https://gamebackend-1.onrender.com/api/usuarios/${userId}/imagen`, {
        imagenPerfil: imageUrl
      });

      setUsuario({
        ...usuario,
        imagen: imageUrl
      });
      setImagenTemporal('');
      setImagenFile(null);
      setMensajeExito('¡Imagen actualizada correctamente!');
      setTimeout(() => setMensajeExito(''), 3000);
    } catch (error) {
      console.error('Error al subir la imagen a Cloudinary', error);
      setMensajeError('Error al subir la imagen a Cloudinary.');
      setTimeout(() => setMensajeError(''), 3000);
    }
  };

  const validateForm = () => {
    if (
      !usuario.nombreUsuario ||
      !usuario.nombre ||
      !usuario.apellidoPaterno ||
      !usuario.apellidoMaterno ||
      !usuario.edad ||
      !usuario.telefono ||
      !usuario.correo ||
      (editando && usuario.contrasena && usuario.contrasena.length < 8) ||
      usuario.telefono.length !== 10 ||
      usuario.edad < 0 ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(usuario.correo)
    ) {
      setMensajeError('Por favor, completa todos los campos correctamente.');
      setTimeout(() => setMensajeError(''), 3000);
      return false;
    }
    return true;
  };

  const handleGuardar = async () => {
    if (!validateForm()) return;

    setCargando(true);
    try {
      const userId = localStorage.getItem('userId');
      await axios.put(`https://gamebackend-1.onrender.com/api/usuarios/${userId}`, {
        username: usuario.nombreUsuario,
        datos_personales: {
          nombre: usuario.nombre,
          apellido_paterno: usuario.apellidoPaterno,
          apellido_materno: usuario.apellidoMaterno,
          edad: usuario.edad,
          telefono: usuario.telefono,
          correo: usuario.correo
        },
        imagenPerfil: usuario.imagen,
        ...(usuario.contrasena && { password: usuario.contrasena })
      });
      setCargando(false);
      setEditando(false);
      setMensajeExito('¡Datos actualizados correctamente!');
      setTimeout(() => setMensajeExito(''), 3000);
    } catch (error) {
      console.error('Error al guardar los datos del usuario', error);
      setMensajeError('Error al guardar los datos del usuario.');
      setCargando(false);
      setTimeout(() => setMensajeError(''), 3000);
    }
  };

  return (
    <div className={`modal ${estaAbierto ? 'is-active' : ''}`}>
      <div className="modal-background" onClick={alCerrar}></div>
      <div className="modal-content">
        <div className="box perfil-box">
          {mensajeExito && (
            <div className="notification is-success">
              <button className="delete" onClick={() => setMensajeExito('')}></button>
              {mensajeExito}
            </div>
          )}
          {mensajeError && (
            <div className="notification is-danger">
              <button className="delete" onClick={() => setMensajeError('')}></button>
              {mensajeError}
            </div>
          )}
          <h2 className="title has-text-centered usuario-titulo">
            {usuario.nombreUsuario}
          </h2>
          <div className="columns is-vcentered">
            <div className="column is-one-quarter has-text-centered">
              <h3 className="title is-5">Foto de Perfil</h3>
              <figure className="image is-128x128 perfil-imagen">
                <img className="is-rounded" src={imagenTemporal || usuario.imagen || 'https://via.placeholder.com/128'} alt="Perfil" />
              </figure>
              <div className="file is-primary is-centered mt-4" style={{ display: 'flex', justifyContent: 'center' }}>
                <label className="file-label">
                  <input className="file-input" type="file" name="imagen" onChange={handleImagenChange} />
                  <span className="file-cta">
                    <span className="file-label">Cambiar</span>
                  </span>
                </label>
              </div>
              {imagenTemporal && (
                <div className="control mt-4" style={{ display: 'flex', justifyContent: 'center' }}>
                  <button className="button is-info" onClick={handleGuardarImagen}>
                    Actualizar imagen
                  </button>
                </div>
              )}
            </div>
            <div className="column is-three-quarters">
              <h3 className="title is-5 datos-titulo">Datos Personales</h3>
              <div className="columns">
                <div className="column">
                  <div className="field">
                    <label className="label"><FontAwesomeIcon icon={faUser} style={{ marginRight: '5px' }} /> Nombre de Usuario</label>
                    <div className="control has-icons-left">
                      <input className="input inputperfil" type="text" name="nombreUsuario" value={usuario.nombreUsuario} onChange={handleChange} disabled={!editando} />
                      <span className="icon is-small is-left"></span>
                    </div>
                  </div>
                  <div className="field">
                    <label className="label"><FontAwesomeIcon icon={faUserTie} style={{ marginRight: '5px' }} /> Nombre</label>
                    <div className="control has-icons-left">
                      <input className="input inputperfil" type="text" name="nombre" value={usuario.nombre} onChange={handleChange} disabled={!editando} />
                      <span className="icon is-small is-left"></span>
                    </div>
                  </div>
                  <div className="field">
                    <label className="label"><FontAwesomeIcon icon={faUser} style={{ marginRight: '5px' }} /> Apellido Paterno</label>
                    <div className="control has-icons-left">
                      <input className="input inputperfil" type="text" name="apellidoPaterno" value={usuario.apellidoPaterno} onChange={handleChange} disabled={!editando} />
                      <span className="icon is-small is-left"></span>
                    </div>
                  </div>
                  <div className="field">
                    <label className="label"><FontAwesomeIcon icon={faUser} style={{ marginRight: '5px' }} /> Apellido Materno</label>
                    <div className="control has-icons-left">
                      <input className="input inputperfil" type="text" name="apellidoMaterno" value={usuario.apellidoMaterno} onChange={handleChange} disabled={!editando} />
                      <span className="icon is-small is-left"></span>
                    </div>
                  </div>
                </div>
                <div className="column">
                  <div className="field">
                    <label className="label"><FontAwesomeIcon icon={faBirthdayCake} style={{ marginRight: '5px' }} /> Edad</label>
                    <div className="control has-icons-left">
                      <input className="input inputperfil" type="number" name="edad" value={usuario.edad} onChange={handleChange} disabled={!editando} />
                      <span className="icon is-small is-left"></span>
                    </div>
                  </div>
                  <div className="field">
                    <label className="label"><FontAwesomeIcon icon={faPhone} style={{ marginRight: '5px' }} /> Teléfono</label>
                    <div className="control has-icons-left">
                      <input className="input inputperfil" type="text" name="telefono" value={usuario.telefono} onChange={handleChange} disabled={!editando} />
                      <span className="icon is-small is-left"></span>
                    </div>
                  </div>
                  <div className="field">
                    <label className="label"><FontAwesomeIcon icon={faEnvelope} style={{ marginRight: '5px' }} /> Correo</label>
                    <div className="control has-icons-left">
                      <input className="input inputperfil" type="email" name="correo" value={usuario.correo} onChange={handleChange} disabled={!editando} />
                      <span className="icon is-small is-left"></span>
                    </div>
                  </div>
                  <div className="field">
                    <label className="label"><FontAwesomeIcon icon={faKey} style={{ marginRight: '5px' }} /> Matrícula</label>
                    <div className="control has-icons-left">
                      <input className="input inputperfil" type="text" value={usuario.matricula} disabled />
                      <span className="icon is-small is-left"></span>
                    </div>
                  </div>
                  <div className="field">
                    <label className="label"><FontAwesomeIcon icon={faKey} style={{ marginRight: '5px' }} /> Contraseña</label>
                    <div className="control has-icons-left">
                      <input className="input inputperfil" type="password" name="contrasena" value={usuario.contrasena} onChange={handleChange} disabled={!editando} placeholder="••••••••" />
                      <span className="icon is-small is-left"></span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="field is-grouped is-grouped-right mt-4">
                <div className="control">
                  <button className="button is-info" onClick={() => { if (editando) handleGuardar(); setEditando(!editando); }} disabled={cargando}>
                    {editando ? <><FontAwesomeIcon icon={faSave} style={{ marginRight: '5px' }} /> Guardar</> : <><FontAwesomeIcon icon={faEdit} style={{ marginRight: '5px' }} /> Editar</>}
                  </button>
                </div>
                <div className="control">
                  <button className="button is-danger" onClick={alCerrar}>
                    <FontAwesomeIcon icon={faTimes} style={{ marginRight: '5px' }} /> Cerrar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <button className="modal-close is-large" aria-label="close" onClick={alCerrar}></button>
    </div>
  );
};

export default Perfil;
