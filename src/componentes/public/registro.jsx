import React, { useState } from 'react';
import 'bulma/css/bulma.min.css';

const handleChange = (formData, setFormData) => e => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
};

const validateStepOne = (formData) => {
    const { nombre, apellidoPaterno, apellidoMaterno, edad, sexo } = formData;
    if (!nombre || !apellidoPaterno || !apellidoMaterno || !edad || !sexo) {
        alert("Todos los campos deben ser completados.");
        return false;
    }
    if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s'-]+$/.test(nombre) || !/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s'-]+$/.test(apellidoPaterno) || !/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s'-]+$/.test(apellidoMaterno)) {
        alert("Nombres y apellidos solo pueden contener letras, espacios, guiones y apóstrofes.");
        return false;
    }
    if (isNaN(edad) || edad < 0 ) {
        alert("Verifique que la edad sea correcta");
        return false;
    } else if (edad > 80) {
        alert("Su edad es mayor a nuestras condiciones");
        return false;
    } else if (edad <= 10) {
        alert("No tiene edad para tomar este curso");
        return false;
    }
    return true;
};

const validateStepTwo = (formData) => {
    const { telefono, correoElectronico, gradoEstudio } = formData;
    if (!telefono || !correoElectronico || !gradoEstudio) {
        alert("Todos los campos deben ser completados.");
        return false;
    }
    if (!/^\d{10}$/.test(telefono)) {
        alert("El teléfono debe contener exactamente 10 dígitos.");
        return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correoElectronico)) {
        alert("Correo electrónico no válido.");
        return false;
    }
    const validGrades = ['Primaria', 'Secundaria', 'Preparatoria', 'Universidad', 'Ninguna'];
    if (!validGrades.includes(gradoEstudio)) {
        alert("Seleccione un nivel de estudios válido.");
        return false;
    }
    return true;
};

const validateStepThree = (formData) => {
    const { usuario, contrasena, confirmarContrasena } = formData;
    if (!usuario || !contrasena || !confirmarContrasena) {
        alert("Todos los campos deben ser completados.");
        return false;
    }
    if (!new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})').test(contrasena)) {
        alert("La contraseña debe tener al menos 8 caracteres, incluyendo una mayúscula, una minúscula, un número y un carácter especial.");
        return false;
    }
    if (contrasena !== confirmarContrasena) {
        alert("Las contraseñas no coinciden.");
        return false;
    }
    return true;
};

const inputStyle = { marginBottom: '15px' };

const StepOne = ({ formData, setFormData, nextStep }) => (
    <div style={{ backgroundColor: '#14161A', display: 'flex', justifyContent: 'center', alignItems: 'center'  }}>
        <div className="card has-background-black has-text-white" style={{ maxWidth: '400px', margin: '40px auto', padding: '20px', boxShadow: '0px 0px 10px 0px rgba(255,255,255,0.5)' }}>
            <div className="card-content">
                <h2 className="title has-text-centered has-text-white">Registro - Paso 1</h2>
                <div className="field">
                    <input className="input is-black" type="text" placeholder="Nombre" name="nombre" value={formData.nombre} onChange={handleChange(formData, setFormData)} style={inputStyle} />
                    <input className="input is-black" type="text" placeholder="Apellido Paterno" name="apellidoPaterno" value={formData.apellidoPaterno} onChange={handleChange(formData, setFormData)} style={inputStyle} />
                    <input className="input is-black" type="text" placeholder="Apellido Materno" name="apellidoMaterno" value={formData.apellidoMaterno} onChange={handleChange(formData, setFormData)} style={inputStyle} />
                    <input className="input is-black" type="number" placeholder="Edad" name="edad" value={formData.edad} onChange={handleChange(formData, setFormData)} style={inputStyle} />
                    <div className="select is-fullwidth" style={inputStyle}>
                        <select name="sexo" value={formData.sexo} onChange={handleChange(formData, setFormData)}>
                            <option value="">Selecciona el Genero</option>
                            <option value="M">Masculino</option>
                            <option value="F">Femenino</option>
                        </select>
                    </div>
                </div>
                <button className="button is-link is-fullwidth" style={{ marginTop: '10px' }} onClick={() => validateStepOne(formData) && nextStep()}>Siguiente</button>
            </div>
        </div>
    </div>
);

const StepTwo = ({ formData, setFormData, nextStep, prevStep }) => (
    <div style={{ backgroundColor: '#14161A', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <div className="card has-background-black has-text-white" style={{ maxWidth: '400px', margin: '40px auto', padding: '20px', boxShadow: '0px 0px 10px 0px rgba(255,255,255,0.5)' }}>
            <div className="card-content">
                <h2 className="title has-text-centered has-text-white">Registro - Paso 2</h2>
                <div className="field">
                    <input className="input is-black" type="text" placeholder="Teléfono" name="telefono" value={formData.telefono} onChange={handleChange(formData, setFormData)} style={inputStyle} />
                    <input className="input is-black" type="email"                     placeholder="Correo Electrónico" name="correoElectronico" value={formData.correoElectronico} onChange={handleChange(formData, setFormData)} style={inputStyle} />
                    <div className="select is-fullwidth" style={inputStyle}>
                        <select name="gradoEstudio" value={formData.gradoEstudio} onChange={handleChange(formData, setFormData)}>
                            <option value="">Selecciona el Nivel de Estudios</option>
                            <option value="Primaria">Primaria</option>
                            <option value="Secundaria">Secundaria</option>
                            <option value="Preparatoria">Preparatoria</option>
                            <option value="Universidad">Universidad</option>
                            <option value="Ninguna">Ninguna</option>
                        </select>
                    </div>
                </div>
                <button className="button is-link is-fullwidth" style={{ marginTop: '10px' }} onClick={prevStep}>Anterior</button>
                <button className="button is-link is-fullwidth" style={{ marginTop: '10px' }} onClick={() => validateStepTwo(formData) && nextStep()}>Siguiente</button>
            </div>
        </div>
    </div>
);

const StepThree = ({ formData, setFormData, prevStep, nextStep }) => (
    <div style={{ backgroundColor: '#14161A', display: 'flex', justifyContent: 'center', alignItems: 'center'  }}>
        <div className="card has-background-black has-text-white" style={{ maxWidth: '400px', margin: '40px auto', padding: '20px', boxShadow: '0px 0px 10px 0px rgba(255,255,255,0.5)' }}>
            <div className="card-content">
                <h2 className="title has-text-centered has-text-white">Registro - Paso 3</h2>
                <div className="field">
                    <input className="input is-black" type="text" placeholder="Usuario" name="usuario" value={formData.usuario} onChange={handleChange(formData, setFormData)} style={inputStyle} />
                    <input className="input is-black" type="password" placeholder="Contraseña" name="contrasena" value={formData.contrasena} onChange={handleChange(formData, setFormData)} style={inputStyle} />
                    <input className="input is-black" type="password" placeholder="Confirmar Contraseña" name="confirmarContrasena" value={formData.confirmarContrasena} onChange={handleChange(formData, setFormData)} style={inputStyle} />
                </div>
                <button className="button is-link is-fullwidth" style={{ marginTop: '10px' }} onClick={prevStep}>Anterior</button>
                <button className="button is-link is-fullwidth" style={{ marginTop: '10px' }} onClick={() => validateStepThree(formData) && nextStep()}>Siguiente</button>
            </div>
        </div>
    </div>
);

const handleChangeLenguajes = (formData, setFormData, value) => {
    const newLenguajes = formData.lenguajes.includes(value) 
      ? formData.lenguajes.filter(l => l !== value)
      : [...formData.lenguajes, value];
    setFormData({ ...formData, lenguajes: newLenguajes });
};

const StepFour = ({ formData, setFormData, prevStep, finishRegistration }) => (
    <div style={{ backgroundColor: '#14161A', display: 'flex', justifyContent: 'center', alignItems: 'center'  }}>
        <div className="card has-background-black has-text-white" style={{ maxWidth: '400px', margin: '40px auto', padding: '20px', boxShadow: '0px 0px 10px 0px rgba(255,255,255,0.5)' }}>
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
            const response = await fetch('http://localhost:3001/api/usuarios', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: formData.usuario,
                    password: formData.contrasena,
                    tipo: 'cliente',
                    datos_personales: {
                        nombre: formData.nombre,
                        apellido_paterno: formData.apellidoPaterno,
                        apellido_materno: formData.apellidoMaterno,
                        edad: parseInt(formData.edad, 10),
                        genero: formData.sexo,
                        telefono: formData.telefono,
                        correo: formData.correoElectronico,
                        grado_de_estudios: formData.gradoEstudio,
                    },
                    experiencia_en_lenguaje_de_programacion: formData.lenguajes,
                    evaluaciones_realizadas: [],
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
