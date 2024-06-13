import React from 'react';
import Slider from 'react-slick';
import juego2 from '../img/juego2.png';
import juego3 from '../img/juego2d.jpg';
import juego4 from '../img/juego4.jpg';
import juego5 from '../img/juego5.jpg';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import '../CSS/style.css';

const PaginaPrincipal = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 1000, // Velocidad de la transición en milisegundos (ms)
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000, // Tiempo de espera entre transiciones en milisegundos (ms)
    customPaging: (i) => <div className="dot"></div>,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          initialSlide: 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
    beforeChange: (current, next) => {
      const currentSlide = document.querySelector(`.slick-slide[data-index="${current}"]`);
      currentSlide.classList.add('fadeOut');

      const nextSlide = document.querySelector(`.slick-slide[data-index="${next}"]`);
      nextSlide.classList.add('fadeIn');
    },
    afterChange: (current) => {
      const currentSlide = document.querySelector(`.slick-slide[data-index="${current}"]`);
      currentSlide.classList.remove('fadeOut');
      currentSlide.classList.add('fadeIn');
    },
  };

  return (
    <section className="section has-background-black-bis">
      <div className="container">
        <div className="columns is-vcentered">
          <div className="column is-half">
            <div className="slider-container">
              <Slider {...settings}>
                {[juego2, juego3, juego4, juego5].map((imgSrc, index) => (
                  <div key={index} className="slider-slide">
                    <img src={imgSrc} alt={`Slide ${index + 1}`} className="slider-image" />
                  </div>
                ))}
              </Slider>
            </div>
          </div>
          <div className="column is-half">
            <div className="card tarjeta-larga has-background-black has-border-white has-shadow">
              <div className="card-content">
                <div className="content has-text-centered">
                  <h1 className="title has-text-white">Explora el mundo de la creación de juegos</h1>
                  <p className="has-text-white">
                    Nuestra plataforma te ofrece todas las herramientas necesarias para comenzar a desarrollar tus propios videojuegos, abarcando desde conceptos fundamentales hasta técnicas de programación y diseño gráfico.
                  </p>
                  <p className="is-size-4 has-text-white">
                    ¡No esperes más y comienza tu aventura en el desarrollo de juegos hoy mismo!
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="has-text-white has-text-centered additional-text" style={{ color: 'green' }}>
          <h2 className="is-size-4">
            Comienza a usar Unity. Da vida a todo lo que puedas imaginar con Unity.
          </h2>
          <h2 className="is-size-4 color-change">
            Explora nuestros temas; contamos con videos que explicarán paso a paso el proceso para la creación de un pequeño videojuego.
          </h2>
        </div>
      </div>
    </section>
  );
}

export default PaginaPrincipal;
