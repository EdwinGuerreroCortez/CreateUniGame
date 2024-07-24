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
    if (isNaN(edad) || edad < 0) {
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
    const { telefono, correoElectronico, gradoEstudio, matricula } = formData;
    if (!telefono || !correoElectronico || !gradoEstudio || !matricula) {
        alert("Todos los campos deben ser completados.");
        return false;
    }
    if (!/^\d{10}$/.test(telefono)) {
        alert("El teléfono debe contener exactamente 10 dígitos.");
        return false;
    }
    const validGrades = ['Primaria', 'Secundaria', 'Preparatoria', 'Universidad', 'Ninguna'];
    if (!validGrades.includes(gradoEstudio)) {
        alert("Seleccione un nivel de estudios válido.");
        return false;
    }
    if (!/^[20]\d{7}$/.test(matricula)) {
        alert("Por favor verifique que su matricula sea valido");
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

const StepIndicator = ({ step }) => (
    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
        {[1, 2, 3, 4, 5].map((s) => (
            <div
                key={s}
                style={{
                    width: '10px',
                    height: '10px',
                    margin: '0 5px',
                    borderRadius: '50%',
                    backgroundColor: s <= step ? 'white' : '#555',
                }}
            />
        ))}
    </div>
);

const StepEmailVerification = ({ formData, setFormData, nextStep }) => {
    const [code, setCode] = useState('');
    const [emailSent, setEmailSent] = useState(false);

    const sendVerificationEmail = async () => {
        try {
            const response = await fetch('http://localhost:3001/api/enviar-codigo-registro', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email: formData.correoElectronico }),
            });

            const data = await response.json();
            if (response.ok) {
                alert('Código de verificación enviado a tu correo electrónico.');
                setEmailSent(true);
            } else {
                alert(data.message);
            }
        } catch (error) {
            alert('Hubo un problema al enviar el código de verificación.');
            console.error('Error al enviar el código de verificación:', error);
        }
    };

    const verifyCode = async () => {
        try {
            const response = await fetch('http://localhost:3001/api/verificar-codigo-registro', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email: formData.correoElectronico, code }),
            });

            const data = await response.json();
            if (response.ok) {
                alert('Código de verificación correcto.');
                nextStep();
            } else {
                alert(data.message);
            }
        } catch (error) {
            alert('Hubo un problema al verificar el código de verificación.');
            console.error('Error al verificar el código de verificación:', error);
        }
    };

    return (
        <div style={{ backgroundColor: '#14161A', display: 'flex', justifyContent: 'center', alignItems: 'center', background: 'linear-gradient(1deg, #40c489, #101216)' }}>
            <div className="card has-background-black has-text-white" style={{ maxWidth: '420px', margin: '40px auto', padding: '20px', boxShadow: '0px 0px 10px 0px rgba(255,255,255,0.5)' }}>
                <div className="card-content">
                    <h2 className="title has-text-centered has-text-white">Verificación de Correo</h2>
                    <StepIndicator step={1} />
                    <div className="field">
                        <input className="input is-black" type="email" placeholder="Correo Electrónico" name="correoElectronico" value={formData.correoElectronico} onChange={handleChange(formData, setFormData)} style={{ marginBottom: '15px' }} />
                        {!emailSent && (
                            <button className="button is-link is-fullwidth" onClick={sendVerificationEmail} style={{ marginBottom: '10px' }}>Enviar Código</button>
                        )}
                        {emailSent && (
                            <div className="field">
                                <input className="input is-black" type="text" placeholder="Código de Verificación" value={code} onChange={(e) => setCode(e.target.value)} style={{ marginBottom: '15px' }} />
                                <button className="button is-link is-fullwidth" onClick={verifyCode} style={{ marginBottom: '10px' }}>Verificar Código</button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

const StepOne = ({ formData, setFormData, nextStep }) => (
    <div style={{ backgroundColor: '#14161A', display: 'flex', justifyContent: 'center', alignItems: 'center', background: 'linear-gradient(1deg, #40c489, #101216)' }}>
        <div className="card has-background-black has-text-white" style={{ maxWidth: '420px', margin: '40px auto', padding: '20px', boxShadow: '0px 0px 10px 0px rgba(255,255,255,0.5)' }}>
            <div className="card-content">
                <h2 className="title has-text-centered has-text-white">Registro - Paso 1</h2>
                <StepIndicator step={2} />
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
    <div style={{ backgroundColor: '#14161A', display: 'flex', justifyContent: 'center', alignItems: 'center', background: 'linear-gradient(1deg, #40c489, #101216)' }}>
        <div className="card has-background-black has-text-white" style={{ maxWidth: '420px', margin: '40px auto', padding: '20px', boxShadow: '0px 0px 10px 0px rgba(255,255,255,0.5)' }}>
            <div className="card-content">
                <h2 className="title has-text-centered has-text-white">Registro - Paso 2</h2>
                <StepIndicator step={3} />
                <div className="field">
                    <input className="input is-black" type="text" placeholder="Teléfono" name="telefono" value={formData.telefono} onChange={handleChange(formData, setFormData)} style={inputStyle} />
                    <input className="input is-black" type="email" placeholder="Correo Electrónico" name="correoElectronico" value={formData.correoElectronico} readOnly style={inputStyle} />
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
                    <input className="input is-black" type="text" placeholder="Matrícula" name="matricula" value={formData.matricula} onChange={handleChange(formData, setFormData)} style={inputStyle} />
                </div>
                <button className="button is-link is-fullwidth" style={{ marginTop: '10px' }} onClick={prevStep}>Anterior</button>
                <button className="button is-link is-fullwidth" style={{ marginTop: '10px' }} onClick={() => validateStepTwo(formData) && nextStep()}>Siguiente</button>
            </div>
        </div>
    </div>
);

const StepThree = ({ formData, setFormData, prevStep, nextStep }) => {
    const [showPassword1, setShowPassword1] = useState(false);
    const [showPassword2, setShowPassword2] = useState(false);

    return (
        <div style={{ backgroundColor: '#14161A', display: 'flex', justifyContent: 'center', alignItems: 'center', background: 'linear-gradient(1deg, #40c489, #101216)' }}>
            <div className="card has-background-black has-text-white" style={{ maxWidth: '420px', margin: '40px auto', padding: '20px', boxShadow: '0px 0px 10px 0px rgba(255,255,255,0.5)' }}>
                <div className="card-content">
                    <h2 className="title has-text-centered has-text-white">Registro - Paso 3</h2>
                    <StepIndicator step={4} />
                    <div className="field">
                        <input className="input is-black" type="text" placeholder="Usuario" name="usuario" value={formData.usuario} onChange={handleChange(formData, setFormData)} style={inputStyle} />
                        <div className="field has-addons" style={{ marginBottom: '15px', alignItems: 'center' }}>
                            <input className="input is-black" type={showPassword1 ? "text" : "password"} placeholder="Contraseña" name="contrasena" value={formData.contrasena} onChange={handleChange(formData, setFormData)} style={{ marginBottom: '0', flex: '1' }} />
                            <button className="button is-light" type="button" onClick={() => setShowPassword1(!showPassword1)} style={{ marginLeft: '10px', width: '90px' }}>
                                {showPassword1 ? "Ocultar" : "Mostrar"}
                            </button>
                        </div>
                        <div className="field has-addons" style={{ alignItems: 'center' }}>
                            <input className="input is-black" type={showPassword2 ? "text" : "password"} placeholder="Confirmar Contraseña" name="confirmarContrasena" value={formData.confirmarContrasena} onChange={handleChange(formData, setFormData)} style={{ marginBottom: '0', flex: '1' }} />
                            <button className="button is-light" type="button" onClick={() => setShowPassword2(!showPassword2)} style={{ marginLeft: '10px', width: '90px' }}>
                                {showPassword2 ? "Ocultar" : "Mostrar"}
                            </button>
                        </div>
                    </div>
                    <button className="button is-link is-fullwidth" style={{ marginTop: '10px' }} onClick={prevStep}>Anterior</button>
                    <button className="button is-link is-fullwidth" style={{ marginTop: '10px' }} onClick={() => validateStepThree(formData) && nextStep()}>Siguiente</button>
                </div>
            </div>
        </div>
    );
};

const handleChangeLenguajes = (formData, setFormData, value) => {
    if (value === 'Todos') {
        const allOptions = ['Python', 'JavaScript', 'C#', 'C++', 'Java', 'Lua', 'HTML5', 'Swift', 'Ruby', 'PHP', 'Kotlin', 'MySQL', 'PostgreSQL', 'MongoDB', 'SQLite', 'Oracle', 'SQL Server'];
        setFormData({ ...formData, lenguajes: allOptions });
    } else if (value === 'Ninguno') {
        setFormData({ ...formData, lenguajes: [] });
    } else {
        const newLenguajes = formData.lenguajes.includes(value)
            ? formData.lenguajes.filter(l => l !== value)
            : [...formData.lenguajes, value];
        setFormData({ ...formData, lenguajes: newLenguajes });
    }
};

const StepFour = ({ formData, setFormData, prevStep, finishRegistration }) => (
    <div style={{ backgroundColor: '#14161A', display: 'flex', justifyContent: 'center', alignItems: 'center', background: 'linear-gradient(1deg, #40c489, #101216)' }}>
        <div className="card has-background-black has-text-white" style={{ maxWidth: '600px', margin: '40px auto', padding: '20px', boxShadow: '0px 0px 10px 0px rgba(255,255,255,0.5)' }}>
            <div className="card-content">
                <h2 className="title has-text-centered has-text-white">Experiencia - Paso 4</h2>
                <StepIndicator step={5} />
                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', marginBottom: '20px' }}>
                    <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
                        {['Python', 'JavaScript', 'C#', 'C++', 'Java', 'HTML5', 'Swift', 'Ruby', 'PHP'].map((lang) => (
                            <label className="checkbox" key={lang} style={{ width: '30%', margin: '10px 0', textAlign: 'left' }}>
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
                    <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
                        {['MySQL', 'PostgreSQL', 'MongoDB', 'SQLite', 'Oracle', 'SQL Server'].map((db) => (
                            <label className="checkbox" key={db} style={{ width: '30%', margin: '10px 0', textAlign: 'left' }}>
                                <input
                                    type="checkbox"
                                    name="lenguajes"
                                    value={db}
                                    checked={formData.lenguajes.includes(db)}
                                    onChange={() => handleChangeLenguajes(formData, setFormData, db)}
                                    style={{ marginRight: '5px' }}
                                />
                                {db}
                            </label>
                        ))}
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        {['Todos', 'Ninguno'].map((option) => (
                            <label className="checkbox" key={option} style={{ width: '30%', margin: '10px 0', textAlign: 'left' }}>
                                <input
                                    type="checkbox"
                                    name="lenguajes"
                                    value={option}
                                    checked={option === 'Todos' ? formData.lenguajes.length === 17 : formData.lenguajes.length === 0}
                                    onChange={() => handleChangeLenguajes(formData, setFormData, option)}
                                    style={{ marginRight: '5px' }}
                                />
                                {option}
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
        matricula: '',
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
            const response = await fetch('http://localhost:3001/api/verificar', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    telefono: formData.telefono,
                    correo: formData.correoElectronico,
                    matricula: formData.matricula,
                }),
            });

            const data = await response.json();

            if (data.message === 'Teléfono ya registrado.') {
                alert('El teléfono ya está registrado. Por favor, use otro número.');
                return;
            } else if (data.message === 'Correo electrónico ya registrado.') {
                alert('El correo electrónico ya está registrado. Por favor, use otro correo.');
                return;
            } else if (data.message === 'Matrícula ya registrada.') {
                alert('La matrícula ya está registrada. Por favor, use otra matrícula.');
                return;
            }

            if (data.message === 'Usuario no encontrado.') {
                const registro = await fetch('http://localhost:3001/api/usuarios', {
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
                            matricula: formData.matricula
                        },
                        experiencia_en_lenguaje_de_programacion: formData.lenguajes,
                        evaluaciones_realizadas: [],
                    }),
                });

                const registroData = await registro.json();

                if (!registro.ok) {
                    throw new Error('Error al registrar el usuario');
                }

                alert('Registro completado!');
                setTimeout(() => {
                    window.location.href = '/studyweb/public/login';
                }, 1000);
            }
        } catch (error) {
            alert('Hubo un problema al registrar el usuario: ' + error.message);
            console.error('Error al registrar el usuario:', error);
        }
    };

    return (
        <div>
            {step === 1 && <StepEmailVerification formData={formData} setFormData={setFormData} nextStep={nextStep} />}
            {step === 2 && <StepOne formData={formData} setFormData={setFormData} nextStep={nextStep} />}
            {step === 3 && <StepTwo formData={formData} setFormData={setFormData} nextStep={nextStep} prevStep={prevStep} />}
            {step === 4 && <StepThree formData={formData} setFormData={setFormData} nextStep={nextStep} prevStep={prevStep} />}
            {step === 5 && <StepFour formData={formData} setFormData={setFormData} prevStep={prevStep} finishRegistration={finishRegistration} />}
        </div>
    );
};

export default FormRegistro;
