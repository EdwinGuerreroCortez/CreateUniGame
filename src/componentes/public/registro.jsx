import React, { useState } from 'react';
import 'bulma/css/bulma.min.css';

const FormRegistro = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    nombre: '',
    apellidoPaterno: '',
    apellidoMaterno: '',
    edad: '',
    sexo: '',
    telefono: '',
    correoElectronico: '',
    gradoEstudio: '',
    usuario: '',
    contrasena: '',
    confirmarContrasena: ''
  });

  const nextStep = () => {
    setStep(step + 1);
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const StepOne = () => (
    <div className="card has-background-black has-text-white" style={{ maxWidth: '400px', margin: '40px auto', padding: '20px' }}>
      <div className="card-content">
        <h2 className="title has-text-centered">Registro - Paso 1</h2>
        <div className="field">
          <input className="input is-black" type="text" placeholder="Nombre" name="nombre" value={formData.nombre} onChange={handleChange} />
        </div>
        <div className="field">
          <input className="input is-black" type="text" placeholder="Apellido Paterno" name="apellidoPaterno" value={formData.apellidoPaterno} onChange={handleChange} />
        </div>
        <div className="field">
          <input className="input is-black" type="text" placeholder="Apellido Materno" name="apellidoMaterno" value={formData.apellidoMaterno} onChange={handleChange} />
        </div>
        <div className="field">
          <input className="input is-black" type="number" placeholder="Edad" name="edad" value={formData.edad} onChange={handleChange} />
        </div>
        <div className="field">
          <div className="select is-fullwidth">
            <select name="sexo" value={formData.sexo} onChange={handleChange}>
              <option value="">Selecciona el sexo</option>
              <option value="M">Masculino</option>
              <option value="F">Femenino</option>
              <option value="O">Otro</option>
            </select>
          </div>
        </div>
        <button className="button is-link is-fullwidth" onClick={nextStep}>Siguiente</button>
      </div>
    </div>
  );

  const StepTwo = () => (
    <div className="card has-background-black has-text-white" style={{ maxWidth: '400px', margin: '40px auto', padding: '20px' }}>
      <div className="card-content">
        <h2 className="title has-text-centered">Registro - Paso 2</h2>
        <div className="field">
          <input className="input is-black" type="text" placeholder="Teléfono" name="telefono" value={formData.telefono} onChange={handleChange} />
        </div>
        <div className="field">
          <input className="input is-black" type="email" placeholder="Correo Electrónico" name="correoElectronico" value={formData.correoElectronico} onChange={handleChange} />
        </div>
        <div className="field">
          <input className="input is-black" type="text" placeholder="Grado de Estudio" name="gradoEstudio" value={formData.gradoEstudio} onChange={handleChange} />
        </div>
        <button className="button is-link is-fullwidth"  onClick={prevStep}>Anterior</button><br />
        <button className="button is-link is-fullwidth" onClick={nextStep}>Siguiente</button>
      </div>
    </div>
  );

  const StepThree = () => (
    <div className="card has-background-black has-text-white" style={{ maxWidth: '400px', margin: '40px auto', padding: '20px' }}>
      <div className="card-content">
        <h2 className="title has-text-centered">Registro - Paso 3</h2>
        <div className="field">
          <input className="input is-black" type="text" placeholder="Usuario" name="usuario" value={formData.usuario} onChange={handleChange} />
        </div>
        <div className="field">
          <input className="input is-black" type="password" placeholder="Contraseña" name="contrasena" value={formData.contrasena} onChange={handleChange} />
        </div>
        <div className="field">
          <input className="input is-black" type="password" placeholder="Confirmar Contraseña" name="confirmarContrasena" value={formData.confirmarContrasena} onChange={handleChange} />
        </div>
        <button className="button is-link is-fullwidth" onClick={prevStep}>Anterior</button><br />
        <button className="button is-link is-fullwidth" onClick={() => alert('Registro completado!')}>Registrar</button>
      </div>
    </div>
  );

  switch (step) {
    case 1:
      return <StepOne />;
    case 2:
      return <StepTwo />;
    case 3:
      return <StepThree />;
    default:
      return <StepOne />;
  }
};

export default FormRegistro;
