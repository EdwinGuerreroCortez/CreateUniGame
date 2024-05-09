import React, { useState } from 'react';
import 'bulma/css/bulma.min.css';


const handleChange = (formData, setFormData) => e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
};

const inputStyle = { marginBottom: '15px' };  // Estilo para incrementar el espaciado entre los campos
const buttonStyle = { marginTop: '10px', marginBottom: '10px' };  // Estilo para el espaciado entre botones


const StepOne = ({ formData, setFormData, nextStep }) => (
    <div className="card has-background-black has-text-white" style={{ maxWidth: '400px', margin: '40px auto', padding: '20px' }}>
        <div className="card-content">
            <h2 className="title has-text-centered">Registro - Paso 1</h2>
            <div className="field" >
                <input className="input is-black" type="text" placeholder="Nombre" name="nombre" value={formData.nombre} onChange={handleChange(formData, setFormData)} style={inputStyle} />
                <input className="input is-black" type="text" placeholder="Apellido Paterno" name="apellidoPaterno" value={formData.apellidoPaterno} onChange={handleChange(formData, setFormData)} style={inputStyle}/>
                <input className="input is-black" type="text" placeholder="Apellido Materno" name="apellidoMaterno" value={formData.apellidoMaterno} onChange={handleChange(formData, setFormData)} style={inputStyle}/>
                <input className="input is-black" type="number" placeholder="Edad" name="edad" value={formData.edad} onChange={handleChange(formData, setFormData)} style={inputStyle}/>
                <div className="select is-fullwidth" style={inputStyle}>
                    <select name="sexo" value={formData.sexo} onChange={handleChange(formData, setFormData)}>
                        <option value="">Selecciona el Genero</option>
                        <option value="M">Masculino</option>
                        <option value="F">Femenino</option>
                    </select>
                </div>
            </div>
            <button className="button is-link is-fullwidth" style={{ marginTop: '10px' }} onClick={nextStep}>Siguiente</button>
        </div>
    </div>
);

const StepTwo = ({ formData, setFormData, nextStep, prevStep }) => (
    <div className="card has-background-black has-text-white" style={{ maxWidth: '400px', margin: '40px auto', padding: '20px' }}>
        <div className="card-content">
            <h2 className="title has-text-centered">Registro - Paso 2</h2>
            <div className="field">
                <input className="input is-black" type="text" placeholder="Teléfono" name="telefono" value={formData.telefono} onChange={handleChange(formData, setFormData)} style={inputStyle} />
                <input className="input is-black" type="email" placeholder="Correo Electrónico" name="correoElectronico" value={formData.correoElectronico} onChange={handleChange(formData, setFormData)} style={inputStyle}/>
                <input className="input is-black" type="text" placeholder="Grado de Estudio" name="gradoEstudio" value={formData.gradoEstudio} onChange={handleChange(formData, setFormData)} style={inputStyle}/>
            </div>
            <button className="button is-link is-fullwidth" style={{ marginTop: '10px' }} onClick={prevStep}>Anterior</button>
            <button className="button is-link is-fullwidth" style={{ marginTop: '10px' }} onClick={nextStep}>Siguiente</button>
        </div>
    </div>
);

const StepThree = ({ formData, setFormData, prevStep, nextStep }) => (
    <div className="card has-background-black has-text-white" style={{ maxWidth: '400px', margin: '40px auto', padding: '20px' }}>
        <div className="card-content">
            <h2 className="title has-text-centered">Registro - Paso 3</h2>
            <div className="field">
                <input className="input is-black" type="text" placeholder="Usuario" name="usuario" value={formData.usuario} onChange={handleChange(formData, setFormData)} style={inputStyle}/>
                <input className="input is-black" type="password" placeholder="Contraseña" name="contrasena" value={formData.contrasena} onChange={handleChange(formData, setFormData)} style={inputStyle}/>
                <input className="input is-black" type="password" placeholder="Confirmar Contraseña" name="confirmarContrasena" value={formData.confirmarContrasena} onChange={handleChange(formData, setFormData)} style={inputStyle}/>
            </div>
            <button className="button is-link is-fullwidth" style={{ marginTop: '10px' }} onClick={prevStep}>Anterior</button>
            <button className="button is-link is-fullwidth" style={{ marginTop: '10px' }} onClick={nextStep}>Siguiente</button>
        </div>
    </div>
);

const handleChangeLenguajes = (formData, setFormData, value) => {
    const newLenguajes = formData.lenguajes.includes(value) 
      ? formData.lenguajes.filter(l => l !== value) // Eliminar si ya está
      : [...formData.lenguajes, value]; // Agregar si no está
    setFormData({ ...formData, lenguajes: newLenguajes });
  };
  
  const StepFour = ({ formData, setFormData, prevStep, finishRegistration }) => {
    const finishAndRedirect = () => {
        finishRegistration();  // Asumiendo que esto maneja la lógica necesaria
        window.location.href = '/login'; // Cambia la URL a la página de login
    };

    return ( // Asegúrate de incluir el return aquí
        <div className="card has-background-black has-text-white" style={{ maxWidth: '400px', margin: '40px auto', padding: '20px' }}>
            <div className="card-content">
                <h2 className="title has-text-centered">Experiencia en Lenguajes</h2>
                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', marginBottom: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-around', marginBottom: '10px' }}>
                        {['Python', 'JavaScript', 'C#', 'C++'].map((lang) => (
                            <label className="checkbox" key={lang} style={{ marginRight: '10px' }}>
                                <input 
                                    type="checkbox" 
                                    name="lenguajes" 
                                    value={lang} 
                                    checked={formData.lenguajes.includes(lang)} 
                                    onChange={() => handleChangeLenguajes(formData, setFormData, lang)} 
                                    style={{ marginRight: '5px' }}
                                />
                                {lang}
                            </label>
                        ))}
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-around' }}>
                        {['Java', 'Lua', 'HTML5', 'Swift'].map((lang) => (
                            <label className="checkbox" key={lang} style={{ marginRight: '10px' }}>
                                <input 
                                    type="checkbox" 
                                    name="lenguajes" 
                                    value={lang} 
                                    checked={formData.lenguajes.includes(lang)} 
                                    onChange={() => handleChangeLenguajes(formData, setFormData, lang)} 
                                    style={{ marginRight: '5px' }}
                                />
                                {lang}
                            </label>
                        ))}
                    </div>
                </div>
                <button className="button is-link is-fullwidth" style={{ marginTop: '10px' }} onClick={prevStep}>Anterior</button>
                <button className="button is-link is-fullwidth" style={{ marginTop: '10px' }} onClick={finishAndRedirect}>Registrar</button>
            </div>
        </div>
    );
};

  
  

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
        confirmarContrasena: '',
        lenguajes: []
    });

    const nextStep = () => {
        setStep(step + 1);
    };

    const prevStep = () => {
        setStep(step - 1);
    };

    const finishRegistration = () => {
        alert('Registro completado!');
        // Aquí podrías añadir código para procesar los datos del formulario
    };

    switch (step) {
        case 1:
            return <StepOne formData={formData} setFormData={setFormData} nextStep={nextStep} />;
        case 2:
            return <StepTwo formData={formData} setFormData={setFormData} nextStep={nextStep} prevStep={prevStep} />;
        case 3:
            return <StepThree formData={formData} setFormData={setFormData} nextStep={nextStep} prevStep={prevStep} />;
        case 4:
            return <StepFour formData={formData} setFormData={setFormData} prevStep={prevStep} finishRegistration={finishRegistration} />;
        default:
            return <StepOne formData={formData} setFormData={setFormData} nextStep={nextStep} />;
    }
};

export default FormRegistro;
