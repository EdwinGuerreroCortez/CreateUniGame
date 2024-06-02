import React, { useState, useEffect } from 'react';
import "bulma/css/bulma.min.css";

const preguntas = [
  {
    pregunta: "¿Cuál es el primer paso en el proceso de creación de un videojuego?",
    opciones: ["Conceptualización", "Desarrollo", "Marketing", "Lanzamiento"],
    respuestaCorrecta: "Conceptualización",
  },
  {
    pregunta: "¿Qué lenguaje de programación es comúnmente utilizado para desarrollar videojuegos?",
    opciones: ["Python", "JavaScript", "C++", "Ruby"],
    respuestaCorrecta: "C++",
  },
  {
    pregunta: "¿Qué motor de juego es conocido por su alta calidad gráfica y uso en AAA games?",
    opciones: ["Unity", "Unreal Engine", "Godot", "GameMaker"],
    respuestaCorrecta: "Unreal Engine",
  },
  {
    pregunta: "¿Qué es un 'sprite' en el desarrollo de videojuegos?",
    opciones: ["Un tipo de enemigo", "Un gráfico bidimensional", "Una herramienta de desarrollo", "Una técnica de sonido"],
    respuestaCorrecta: "Un gráfico bidimensional",
  },
  {
    pregunta: "¿Cuál es la función principal de un diseñador de niveles?",
    opciones: ["Crear la música del juego", "Programar la lógica del juego", "Diseñar los escenarios y misiones", "Testear el juego"],
    respuestaCorrecta: "Diseñar los escenarios y misiones",
  },
  {
    pregunta: "¿Qué significa 'FPS' en el contexto de videojuegos?",
    opciones: ["Frames Per Second", "First Person Shooter", "Fantasy Puzzle Simulation", "Fighting PlayStation"],
    respuestaCorrecta: "First Person Shooter",
  },
  {
    pregunta: "¿Qué herramienta se usa para la gestión de versiones en el desarrollo de software, incluidos los videojuegos?",
    opciones: ["Git", "Docker", "Kubernetes", "Photoshop"],
    respuestaCorrecta: "Git",
  },
  {
    pregunta: "¿Qué técnica se usa para crear una animación suave y realista en videojuegos?",
    opciones: ["Ray Tracing", "Motion Capture", "Sprite Animation", "Blending"],
    respuestaCorrecta: "Motion Capture",
  },
  {
    pregunta: "¿Qué es un 'patch' en el desarrollo de videojuegos?",
    opciones: ["Una actualización del juego", "Un personaje jugable", "Un tipo de bug", "Un nivel secreto"],
    respuestaCorrecta: "Una actualización del juego",
  },
  {
    pregunta: "¿Cuál es la finalidad de un 'beta test' en el desarrollo de videojuegos?",
    opciones: ["Probar el juego en desarrollo para encontrar errores", "Diseñar personajes", "Escribir el guion del juego", "Lanzar el juego oficialmente"],
    respuestaCorrecta: "Probar el juego en desarrollo para encontrar errores",
  },
];

const Evaluacion = () => {
  const [preguntasRestantes, setPreguntasRestantes] = useState([...preguntas, { pregunta: "Pregunta abierta: Describe tu experiencia con los videojuegos en 200 palabras o menos.", abierta: true }]);
  const [preguntaActual, setPreguntaActual] = useState(null);
  const [respuestaSeleccionada, setRespuestaSeleccionada] = useState(null);
  const [mostrarResultados, setMostrarResultados] = useState(false);
  const [respuestas, setRespuestas] = useState([]);
  const [numeroPregunta, setNumeroPregunta] = useState(0);
  const [respuestaAbierta, setRespuestaAbierta] = useState('');

  useEffect(() => {
    seleccionarPreguntaAleatoria();
  }, []);

  const seleccionarPreguntaAleatoria = () => {
    const indexAleatorio = Math.floor(Math.random() * preguntasRestantes.length);
    const preguntaSeleccionada = preguntasRestantes[indexAleatorio];
    setPreguntaActual(preguntaSeleccionada);
    setPreguntasRestantes(preguntasRestantes.filter((_, index) => index !== indexAleatorio));
  };

  const handleOptionChange = (opcion) => {
    setRespuestaSeleccionada(opcion);
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    if (value.split(' ').length <= 200) {
      setRespuestaAbierta(value);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (preguntaActual.abierta) {
      const nuevasRespuestas = [...respuestas, {
        correcta: respuestaAbierta.trim().length > 0,
      }];
      setRespuestas(nuevasRespuestas);
      setRespuestaAbierta('');
    } else {
      const nuevasRespuestas = [...respuestas, {
        correcta: respuestaSeleccionada === preguntaActual.respuestaCorrecta,
      }];
      setRespuestas(nuevasRespuestas);
      setRespuestaSeleccionada(null);
    }

    if (preguntasRestantes.length > 0) {
      seleccionarPreguntaAleatoria();
      setNumeroPregunta(numeroPregunta + 1);
    } else {
      setMostrarResultados(true);
    }
  };

  const calcularResultados = () => {
    let correctas = 0;
    respuestas.forEach(respuesta => {
      if (respuesta.correcta) {
        correctas++;
      }
    });
    return correctas;
  };

  return (
    <div className="section" style={{ minHeight: '100vh', backgroundColor: '#14161A' }}>
      <div className="container">
        <div className="columns is-centered">
          <div className="column is-full-mobile is-half-tablet is-one-third-desktop">
            <div className="box" style={{ padding: '2rem', boxShadow: '0px 0px 10px 0px rgba(0, 255, 0, 0.5)', borderColor: 'green', borderWidth: '2px', borderStyle: 'solid', backgroundColor: '#021929' }}>
              <h1 className="title has-text-white has-text-centered">Evaluación</h1>
              <h2 className="subtitle has-text-white has-text-centered">Pregunta {numeroPregunta + 1} de {preguntas.length + 1}</h2>
              {preguntaActual && !mostrarResultados && (
                <form onSubmit={handleSubmit}>
                  <div className="box" style={{ marginBottom: '1.5rem', backgroundColor: '#14161A', borderColor: 'green', borderWidth: '1px', borderStyle: 'solid' }}>
                    <h2 className="subtitle has-text-white">{preguntaActual.pregunta}</h2>
                    {!preguntaActual.abierta ? (
                      preguntaActual.opciones.map((opcion) => (
                        <div key={opcion} className="field">
                          <div className="control">
                            <label className="radio has-text-white">
                              <input
                                type="radio"
                                name={`pregunta`}
                                value={opcion}
                                onChange={() => handleOptionChange(opcion)}
                                disabled={mostrarResultados}
                                style={{ marginRight: '0.5rem' }}
                              />
                              {opcion}
                            </label>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="field">
                        <div className="control">
                          <textarea
                            className="textarea"
                            value={respuestaAbierta}
                            onChange={handleInputChange}
                            maxLength={200}
                            placeholder="Escribe tu respuesta aquí (máximo 200 palabras)"
                            style={{ backgroundColor: '#14161A', color: 'white', borderColor: 'green' }}
                          />
                        </div>
                        <p className="has-text-white has-text-right">{respuestaAbierta.split(' ').length} / 200 palabras</p>
                      </div>
                    )}
                  </div>
                  <div className="has-text-centered">
                    <button
                      type="submit"
                      className="button is-dark is-medium"
                      style={{ backgroundColor: '#224df7', borderColor: 'green', borderWidth: '2px', borderStyle: 'solid' }}
                      disabled={!respuestaSeleccionada && !respuestaAbierta.trim()}
                    >
                      {preguntasRestantes.length > 0 ? 'Siguiente Pregunta' : 'Ver Resultados'}
                    </button>
                  </div>      
                </form>
              )}
              {mostrarResultados && (
                <div className="box" style={{ backgroundColor: '#14161A', borderColor: 'green', borderWidth: '1px', borderStyle: 'solid' }}>
                  <h2 className="subtitle has-text-white has-text-centered">Resultados</h2>
                  <p className="has-text-white has-text-centered">Has acertado {calcularResultados()} de {preguntas.length} preguntas.</p>
                  <p className="has-text-white has-text-centered">Porcentaje de aciertos: {(calcularResultados() / preguntas.length * 100).toFixed(2)}%</p>
                  <div className="has-text-centered" style={{ marginTop: '1rem' }}>
                    <button className="button is-dark is-medium" style={{ backgroundColor: '#224df7', borderColor: 'green', borderWidth: '2px', borderStyle: 'solid' }} onClick={() => window.location.href = '/curso'}>
                      Volver al curso
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Evaluacion;
