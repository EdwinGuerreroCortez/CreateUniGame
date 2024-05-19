import React, { useState } from 'react';
import 'bulma/css/bulma.min.css'; // Importa Bulma CSS
import '../CSS/perfil.css';

const Perfil = ({ estaAbierto, alCerrar }) => {
  const [usuario, setUsuario] = useState({
    nombreUsuario: '',
    nombre: '',
    apellidoPaterno: '',
    apellidoMaterno: '',
    edad: '',
    telefono: '',
    correo: '',
    contrasena: '',
    imagen: ''
  });

  const [editando, setEditando] = useState(false);
  const [cargando, setCargando] = useState(false);
  const [imagenTemporal, setImagenTemporal] = useState('');
  const [mensajeExito, setMensajeExito] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUsuario({
      ...usuario,
      [name]: value
    });
  };

  const handleImagenChange = (e) => {
    setImagenTemporal(URL.createObjectURL(e.target.files[0]));
  };

  const handleGuardarImagen = () => {
    setUsuario({
      ...usuario,
      imagen: imagenTemporal
    });
    setImagenTemporal('');
  };

  const handleGuardar = () => {
    setCargando(true);
    setTimeout(() => {
      setCargando(false);
      setEditando(false);
      setMensajeExito(true);
      setTimeout(() => setMensajeExito(false), 3000); // Ocultar el mensaje después de 3 segundos
    }, 1000);
  };

  return (
    <div className={`modal ${estaAbierto ? 'is-active' : ''}`}>
      <div className="modal-background" onClick={alCerrar}></div>
      <div className="modal-content">
        <div className="box perfil-box">
          {mensajeExito && (
            <div className="notification is-success">
              <button className="delete" onClick={() => setMensajeExito(false)}></button>
              ¡Tus datos han sido actualizados correctamente!
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
                    <label className="label">Nombre de Usuario</label>
                    <div className="control">
                      <input className="input inputperfil" type="text" name="nombreUsuario" value={usuario.nombreUsuario} onChange={handleChange} disabled={!editando} />
                    </div>
                  </div>
                  <div className="field">
                    <label className="label">Nombre</label>
                    <div className="control">
                      <input className="input inputperfil" type="text" name="nombre" value={usuario.nombre} onChange={handleChange} disabled={!editando} />
                    </div>
                  </div>
                  <div className="field">
                    <label className="label">Apellido Paterno</label>
                    <div className="control">
                      <input className="input inputperfil" type="text" name="apellidoPaterno" value={usuario.apellidoPaterno} onChange={handleChange} disabled={!editando} />
                    </div>
                  </div>
                  <div className="field">
                    <label className="label">Apellido Materno</label>
                    <div className="control">
                      <input className="input inputperfil" type="text" name="apellidoMaterno" value={usuario.apellidoMaterno} onChange={handleChange} disabled={!editando} />
                    </div>
                  </div>
                </div>
                <div className="column">
                  <div className="field">
                    <label className="label">Edad</label>
                    <div className="control">
                      <input className="input inputperfil" type="text" name="edad" value={usuario.edad} onChange={handleChange} disabled={!editando} />
                    </div>
                  </div>
                  <div className="field">
                    <label className="label">Teléfono</label>
                    <div className="control">
                      <input className="input inputperfil" type="text" name="telefono" value={usuario.telefono} onChange={handleChange} disabled={!editando} />
                    </div>
                  </div>
                  <div className="field">
                    <label className="label">Correo</label>
                    <div className="control">
                      <input className="input inputperfil" type="email" name="correo" value={usuario.correo} onChange={handleChange} disabled={!editando} />
                    </div>
                  </div>
                  <div className="field">
                    <label className="label">Contraseña</label> 
                    <div className="control">
                      <input className="input inputperfil" type="password" name="contrasena" value={usuario.contrasena} onChange={handleChange} disabled={!editando} />
                    </div>
                  </div>
                </div>
              </div>
              <div className="field is-grouped is-grouped-right mt-4">
                <div className="control">
                  <button className="button is-info" onClick={() => setEditando(!editando)} disabled={cargando}>
                    {editando ? 'Guardar' : 'Editar'}
                  </button>
                </div>
                <div className="control">
                  <button className="button is-danger" onClick={alCerrar}>Cerrar</button>
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
