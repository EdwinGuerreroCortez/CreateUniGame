import React from 'react';
import Slider from 'react-slick';
import img1 from '../img/img (1).jpg';
import img2 from '../img/img (2).jpg';
import img3 from '../img/img (3).jpg';
import img5 from '../img/img (5).jpg';
import img6 from '../img/img (6).jpg';
import img7 from '../img/img (7).jpg';
import img8 from '../img/img (8).jpg';
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
                {[img1, img2, img3, img5, img6, img7, img8].map((imgSrc, index) => (
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
                  <h1 className="title has-text-white">Explora el mundo de la Informatica</h1>
                  <p className="has-text-white">
                    Nuestra plataforma te ofrece todas las herramientas necesarias para comenzar a aprender diversas áreas de la computación, abarcando desde conceptos fundamentales hasta técnicas avanzadas en programación, diseño de bases de datos y desarrollo de software.
                  </p>
                  <p className="is-size-4 has-text-white">
                    ¡No esperes más y comienza tu aventura en el mundo de la Informatica hoy mismo!
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="has-text-white has-text-centered additional-text" style={{ color: 'green' }}>
          <h2 className="is-size-4">
            Aprende a programar. Da vida a tus ideas con nuestros cursos especializados.
          </h2>
          <h2 className="is-size-4 color-change">
            Explora nuestros temas; contamos con videos y materiales que explicarán paso a paso diversos procesos en el desarrollo de software, bases de datos y más.
          </h2>
        </div>
      </div>
    </section>
  );
}

export default PaginaPrincipal;
