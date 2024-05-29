// src/components/Evaluacion.js
import React, { useState } from 'react';

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
  const [respuestas, setRespuestas] = useState(Array(preguntas.length).fill(null));
  const [mostrarResultados, setMostrarResultados] = useState(false);

  const handleOptionChange = (index, opcion) => {
    const nuevasRespuestas = [...respuestas];
    nuevasRespuestas[index] = opcion;
    setRespuestas(nuevasRespuestas);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setMostrarResultados(true);
  };

  const calcularResultados = () => {
    let correctas = 0;
    respuestas.forEach((respuesta, index) => {
      if (respuesta === preguntas[index].respuestaCorrecta) {
        correctas++;
      }
    });
    return correctas;
  };

  return (
    <div className="section">
      <div className="container">
        <h1 className="title">Evaluación sobre Creación de Videojuegos</h1>
        <form onSubmit={handleSubmit}>
          {preguntas.map((pregunta, index) => (
            <div key={index} className="box">
              <h2 className="subtitle">{pregunta.pregunta}</h2>
              {pregunta.opciones.map((opcion) => (
                <div key={opcion} className="field">
                  <div className="control">
                    <label className="radio">
                      <input
                        type="radio"
                        name={`pregunta-${index}`}
                        value={opcion}
                        onChange={() => handleOptionChange(index, opcion)}
                        disabled={mostrarResultados}
                      />
                      {opcion}
                    </label>
                  </div>
                </div>
              ))}
            </div>
          ))}
          {!mostrarResultados && (
            <button type="submit" className="button is-primary">
              Enviar Respuestas
            </button>
          )}
        </form>
        {mostrarResultados && (
          <div className="box">
            <h2 className="subtitle">Resultados</h2>
            <p>Has acertado {calcularResultados()} de {preguntas.length} preguntas.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Evaluacion;
