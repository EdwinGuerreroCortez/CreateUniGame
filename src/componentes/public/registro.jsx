import React, { useState } from 'react';
import 'bulma/css/bulma.min.css';


const handleChange = (formData, setFormData) => e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
};

const inputStyle = { marginBottom: '15px' };  // Estilo para incrementar el espaciado entre los campos
const buttonStyle = { marginTop: '10px', marginBottom: '10px' };  // Estilo para el espaciado entre botones


const StepOne = ({ formData, setFormData, nextStep }) => (
    <div style={{ backgroundColor: '#14161A', display: 'flex', justifyContent: 'center', alignItems: 'center'  }}>
    <div className="card has-background-black has-text-white" style={{ maxWidth: '400px', margin: '40px auto', padding: '20px', boxShadow: '0px 0px 10px 0px rgba(255,255,255,0.5)' }}>
        <div className="card-content">
            <h2 className="title has-text-centered has-text-white">Registro - Paso 1</h2>
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
    </div>
);

const StepTwo = ({ formData, setFormData, nextStep, prevStep }) => (
    <div style={{ backgroundColor: '#14161A', display: 'flex', justifyContent: 'center', alignItems: 'center'  }}>
    <div className="card has-background-black has-text-white" style={{ maxWidth: '400px', margin: '40px auto', padding: '20px',boxShadow: '0px 0px 10px 0px rgba(255,255,255,0.5)' }}>
        <div className="card-content">
            <h2 className="title has-text-centered has-text-white">Registro - Paso 2</h2>
            <div className="field">
                <input className="input is-black" type="text" placeholder="Teléfono" name="telefono" value={formData.telefono} onChange={handleChange(formData, setFormData)} style={inputStyle} />
                <input className="input is-black" type="email" placeholder="Correo Electrónico" name="correoElectronico" value={formData.correoElectronico} onChange={handleChange(formData, setFormData)} style={inputStyle}/>
                <input className="input is-black" type="text" placeholder="Grado de Estudio" name="gradoEstudio" value={formData.gradoEstudio} onChange={handleChange(formData, setFormData)} style={inputStyle}/>
            </div>
            <button className="button is-link is-fullwidth" style={{ marginTop: '10px' }} onClick={prevStep}>Anterior</button>
            <button className="button is-link is-fullwidth" style={{ marginTop: '10px' }} onClick={nextStep}>Siguiente</button>
        </div>
    </div>
    </div>
);

const StepThree = ({ formData, setFormData, prevStep, nextStep }) => (
    <div style={{ backgroundColor: '#14161A', display: 'flex', justifyContent: 'center', alignItems: 'center'  }}>
    <div className="card has-background-black has-text-white" style={{ maxWidth: '400px', margin: '40px auto', padding: '20px',boxShadow: '0px 0px 10px 0px rgba(255,255,255,0.5)' }}>
        <div className="card-content">
            <h2 className="title has-text-centered has-text-white">Registro - Paso 3</h2>
            <div className="field">
                <input className="input is-black" type="text" placeholder="Usuario" name="usuario" value={formData.usuario} onChange={handleChange(formData, setFormData)} style={inputStyle}/>
                <input className="input is-black" type="password" placeholder="Contraseña" name="contrasena" value={formData.contrasena} onChange={handleChange(formData, setFormData)} style={inputStyle}/>
                <input className="input is-black" type="password" placeholder="Confirmar Contraseña" name="confirmarContrasena" value={formData.confirmarContrasena} onChange={handleChange(formData, setFormData)} style={inputStyle}/>
            </div>
            <button className="button is-link is-fullwidth" style={{ marginTop: '10px' }} onClick={prevStep}>Anterior</button>
            <button className="button is-link is-fullwidth" style={{ marginTop: '10px' }} onClick={nextStep}>Siguiente</button>
        </div>
    </div>
    </div>
);

const handleChangeLenguajes = (formData, setFormData, value) => {
    const newLenguajes = formData.lenguajes.includes(value) 
      ? formData.lenguajes.filter(l => l !== value) // Eliminar si ya está
      : [...formData.lenguajes, value]; // Agregar si no está
    setFormData({ ...formData, lenguajes: newLenguajes });
  };
  
 const StepFour = ({ formData, setFormData, prevStep, finishRegistration }) => (
    <div style={{ backgroundColor: '#14161A', display: 'flex', justifyContent: 'center', alignItems: 'center'  }}>
    <div className="card has-background-black has-text-white" style={{ maxWidth: '400px', margin: '40px auto', padding: '20px' ,boxShadow: '0px 0px 10px 0px rgba(255,255,255,0.5)'}}>
        <div className="card-content">
            <h2 className="title has-text-centered has-text-white">Experiencia en Lenguajes</h2>
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
            <button className="button is-link is-fullwidth" style={{ marginTop: '10px' }} onClick={finishRegistration}>Registrar</button>
        </div>
    </div>
    </div>
);

  
  

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

    const finishRegistration = async () => {
        try {
            const response = await fetch('https://gamebackend-5jyi.onrender.com/api/usuarios', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    nombre: formData.nombre,
                    apellido_paterno: formData.apellidoPaterno,
                    apellido_materno: formData.apellidoMaterno,
                    edad: formData.edad,
                    genero: formData.sexo,
                    telefono: formData.telefono,
                    correo: formData.correoElectronico,
                    grado_de_estudios: formData.gradoEstudio,
                    usuario: formData.usuario,
                    password: formData.contrasena,
                    experiencia_en_lenguaje_de_programacion: formData.lenguajes,
                }),
            });
    
            if (!response.ok) {
                throw new Error('Error al registrar el usuario');
            }
    
            alert('Registro completado!');
            window.location.href = '/login';
        } catch (error) {
            alert('Hubo un problema al registrar el usuario: ' + error.message);
        }
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
