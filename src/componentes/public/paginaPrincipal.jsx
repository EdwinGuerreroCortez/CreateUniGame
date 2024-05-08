import React from 'react';
import imagen from '../img/unity.gif';
import '../CSS/style.css'; // Importa el archivo CSS aquí

const PaginaPrincipal = () => {
  return (
    <section className="section">
      <div className="container">
        <div className="columns is-centered">
          <div className="column is-half">
            <div className="card tarjeta-larga"> {/* Agrega la clase tarjeta-larga */}
              <div className="card-content">
                <h1 className="title has-text-centered">Bienvenido a nuestra plataforma de tutoriales</h1>
                <p className="subtitle has-text-centered">
                  Aprende a crear tu propio juego con Unity y C#
                </p>
                <div className="content">
                  <p>
                    Bienvenido a nuestra plataforma de tutoriales sobre la creación de juegos con Unity y C#. Aquí encontrarás una variedad de videos tutoriales que te guiarán paso a paso a través del proceso de creación de tu propio juego, desde los conceptos básicos hasta técnicas avanzadas.
                  </p>
                  <p>
                    No importa si eres un principiante absoluto o un desarrollador experimentado, nuestros tutoriales están diseñados para ayudarte a aprender y mejorar tus habilidades en el desarrollo de juegos.
                  </p>
                  <p>
                    ¡Comienza tu viaje en el emocionante mundo de la creación de juegos hoy mismo!
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="column is-one-third">
            <div className="image" id="imagenGrande"> {/* Aplica el ID aquí */}
              <img src={imagen} alt="Descripción de la imagen" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default PaginaPrincipal;
