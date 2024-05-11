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
    autoplaySpeed: 2500, // Cambia la velocidad de cambio a 2 segundos
    customPaging: function(i) {
      return <div className="dot"></div>; // Personaliza el estilo de los puntos de navegación
    }
  };

  return (
    <section className="section has-background-black-bis">
      <div className="container">
        <div className="columns is-vcentered">
          <div className="column is-half">
            <Slider {...settings}>
              <div className="slider-slide">
                <img src={juego2} alt="Slide 2" style={{ width: '100%', maxHeight: '100vh', objectFit: 'cover' }} />
              </div>
              <div className="slider-slide">
                <img src={juego3} alt="Slide 3" style={{ width: '100%', maxHeight: '100vh', objectFit: 'cover' }} />
              </div>
              <div className="slider-slide">
                <img src={juego4} alt="Slide 4" style={{ width: '100%', maxHeight: '100vh', objectFit: 'cover' }} />
              </div>
              <div className="slider-slide">
                <img src={juego5} alt="Slide 5" style={{ width: '100%', maxHeight: '100vh', objectFit: 'cover' }} />
              </div>
            </Slider>
          </div>
          <div className="column is-half">
            <div className="card tarjeta-larga has-background-black has-border-white has-shadow">
              <div className="card-content">
                <h1 className="title has-text-centered has-text-white">Bienvenido a nuestra plataforma</h1>
                <p className="subtitle has-text-centered has-text-white">
                  Aprende a crear tu propio juego con Unity y C#
                </p>
                <div className="content has-text-white">
                  <p>
                    Aprenderás a crear tus juegos con Unity y C#. Aquí encontrarás una variedad de videos tutoriales que te guiarán paso a paso a través del proceso de creación de tu propio juego, desde los conceptos básicos hasta técnicas avanzadas.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="has-text-white has-text-centered" style={{ marginTop: '20px' }}>
          <h1 className="is-size-3">
            Comienza usar Unity. Da vida a todo lo que puedas imaginar con Unity.
          </h1>
          <div className="container">
  <h1 className="is-size-3 animate__animated animate__bounceInLeft color-change">
    ¡Empieza tu trayecto de aprendizaje hoy!
  </h1>
</div>



        </div>
      </div>
    </section>
  );
}

export default PaginaPrincipal;
