import React, { useState } from 'react';
import 'bulma/css/bulma.min.css'; // Importa Bulma CSS
import '../CSS/style.css'
const Perfil = ({ estaAbierto, alCerrar }) => {
  const [usuario, setUsuario] = useState({
    nombre: '',
    apellidoPaterno: '',
    apellidoMaterno: '',
    nomusuario: '',
    edad: '',
    genero: '',
    telefono: '',
    correo: '',
    nivelEstudio: '',
    imagen: ''
  });

  const [editando, setEditando] = useState(false);
  const [cargando, setCargando] = useState(false);
  const [imagenTemporal, setImagenTemporal] = useState('');

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
    }, 1000);
  };

  return (
    <div className={`modal ${estaAbierto ? 'is-active' : ''}`}>
      <div className="modal-background" onClick={alCerrar}></div>
      <div className="modal-content">
        <div className="box" style={{ backgroundColor: 'white' }}>
          <h2 className="title has-text-centered"  style={{ color: 'black' }}>{`${usuario.nombre} ${usuario.apellidoPaterno} ${usuario.apellidoMaterno}`}</h2>
          <figure className="image is-128x128" style={{ margin: '0 auto' }}>
            <img className="is-rounded" src={imagenTemporal || usuario.imagen || 'https://via.placeholder.com/128'} alt="Perfil" />
          </figure>
          <div className="file is-primary is-centered mt-2" style={{ display: 'flex', justifyContent: 'center' }}>
            <label className="file-label">
              <input className="file-input" type="file" name="imagen" onChange={handleImagenChange} />
              <span className="file-cta">
                <span className="file-label">Seleccionar imagen</span>
              </span>
            </label>
          </div>
          {imagenTemporal && (
            <div className="control mt-2" style={{ display: 'flex', justifyContent: 'center' }}>
              <button className="button is-info" onClick={handleGuardarImagen}>
                Actualizar imagen
              </button>
            </div>
          )}
          <div className="columns is-vcentered mt-4">
            <div className="column">
              <div className="field">
                <label className="label" >Nombre</label>
                <div className="control">
                  <input id="inputperfil" className="input" type="text" name="nombre" value={usuario.nombre} onChange={handleChange} disabled={!editando} />
                </div>
              </div>
              <div className="field">
                <label className="label">Apellido Paterno</label>
                <div className="control">
                  <input className="input" id="inputperfil"  type="text" name="apellidoPaterno" value={usuario.apellidoPaterno} onChange={handleChange} disabled={!editando} style={{ backgroundColor: 'white', color: 'black' }} />
                </div>
              </div>
              <div className="field">
                <label className="label" >Apellido Materno</label>
                <div className="control">
                  <input className="input" id="inputperfil"  type="text" name="apellidoMaterno" value={usuario.apellidoMaterno} onChange={handleChange} disabled={!editando} style={{ backgroundColor: 'white', color: 'black' }} />
                </div>
              </div>
              <div className="field">
                <label className="label" >Nombre de Usuario</label>
                <div className="control">
                  <input className="input" id="inputperfil"  type="text" name="nomusuario" value={usuario.nomusuario} onChange={handleChange} disabled={!editando} style={{ backgroundColor: 'white', color: 'black' }} />
                </div>
              </div>
              <div className="field">
                <label className="label">Edad</label>
                <div className="control">
                  <input className="input"  id="inputperfil" type="number" name="edad" value={usuario.edad} onChange={handleChange} disabled={!editando} style={{ backgroundColor: 'white', color: 'black' }} />
                </div>
              </div>
              <div className="field">
                <label className="label">Género</label>
                <div className="control">
                  <div className="select" style={{ backgroundColor: 'white'}}>
                    <select name="genero" value={usuario.genero} onChange={handleChange} disabled={!editando} style={{ backgroundColor: 'white', color: 'black' }}>
                      <option value="">Seleccione</option>
                      <option value="Masculino">Masculino</option>
                      <option value="Femenino">Femenino</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="field">
                <label className="label" >Teléfono</label>
                <div className="control">
                  <input className="input" id="inputperfil"  type="text" name="telefono" value={usuario.telefono} onChange={handleChange} disabled={!editando} style={{ backgroundColor: 'white', color: 'black' }} />
                </div>
              </div>
              <div className="field">
                <label className="label">Correo</label>
                <div className="control">
                  <input className="input" id="inputperfil"  type="email" name="correo" value={usuario.correo} onChange={handleChange} disabled={!editando} style={{ backgroundColor: 'white', color: 'black' }} />
                </div>
              </div>
              <div className="field">
                <label className="label">Nivel de Estudio</label>
                <div className="control">
                  <div className="select" style={{ backgroundColor: 'white'}}>
                    <select name="nivelEstudio" value={usuario.nivelEstudio} onChange={handleChange} disabled={!editando} style={{ backgroundColor: 'white', color: 'black' }}>
                      <option value="">Seleccione</option>
                      <option value="Primaria">Primaria</option>
                      <option value="Secundaria">Secundaria</option>
                      <option value="Preparatoria">Preparatoria</option>
                      <option value="Universidad">Universidad</option>
                      <option value="Ninguna">Ninguna</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="field is-grouped is-grouped-centered mt-4">
                <div className="control">
                  <button className="button is-info" onClick={() => setEditando(true)} disabled={editando || cargando}>Actualizar</button>
                </div>
                <div className="control">
                  <button className={`button is-primary ${!editando ? 'is-static' : ''}`} onClick={handleGuardar} disabled={!editando || cargando}>
                    {cargando ? 'Guardando...' : 'Guardar'}
                  </button>

                </div>
              </div>
            </div>
          </div>
          <div className="field is-grouped is-grouped-centered mt-4">
          <button className="button is-danger  mt-4" onClick={alCerrar}>Cerrar</button>
        </div>
        </div>
      </div>
      <button className="modal-close is-large" aria-label="close" onClick={alCerrar}></button>
    </div>
  );
};

export default Perfil;
