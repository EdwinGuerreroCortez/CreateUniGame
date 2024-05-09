import React from 'react';
import Slider from 'react-slick';
import juego2 from '../img/juego2.png';
import juego3 from '../img/juego2d.jpg';
import juego4 from '../img/juego4.jpg';
import juego5 from '../img/juego5.jpg';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import '../CSS/style.css'; // Importa el archivo CSS de Bulma aquí

const PaginaPrincipal = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000 // Cambia la velocidad de cambio a 2 segundos
  };

  return (
    <section className="section">
      <div className="container">
        <div className="columns is-centered">
          <div className="column is-half">
            <div className="card tarjeta-larga">
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
            <Slider {...settings}>
              <div>
                <img src={juego2} alt="Slide 2" />
              </div>
              <div>
                <img src={juego3} alt="Slide 3" />
              </div>
              <div>
                <img src={juego4} alt="Slide 4" />
              </div>
              <div>
                <img src={juego5} alt="Slide 5" />
              </div>
            </Slider>
          </div>
        </div>
      </div>
    </section>
  );
}

export default PaginaPrincipal;
