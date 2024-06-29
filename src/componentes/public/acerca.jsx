import React from 'react';
import imagenStudyWeb from '../img/img_acerca.webp'; // Suponiendo que tienes una imagen representativa
import 'bulma/css/bulma.min.css';
import '../CSS/AcercaDeUniGame.css'; // Archivo CSS para los estilos adicionales

const AcercaDeStudyWeb = () => {
  return (
    <section className="section" style={styles.section}>
      <div className="container">
        <div className="columns is-vcentered">
          <div className="column is-half">
            <figure className="image-container" style={styles.imageContainer}>
              <img src={imagenStudyWeb} alt="StudyWeb" style={styles.image} />
            </figure>
          </div>
          <div className="column is-half">
            <div className="content has-text-centered">
              <h1 className="title has-text-white glowing-text animate-text">Acerca de StudyWeb</h1>
              <p className="has-text-white glowing-text animate-text">
                StudyWeb es la plataforma ideal para aquellos estudiantes que desean ampliar sus conocimientos en diversas áreas de la computación y tecnología. Ofrecemos una experiencia de aprendizaje integral con contenidos interactivos, videos tutoriales, ejercicios prácticos y evaluaciones.
              </p>
              <p className="has-text-white glowing-text animate-text">
                Nuestra misión es democratizar el acceso a la educación en tecnología, proporcionando herramientas y recursos de calidad que permitan a cualquier persona, sin importar su nivel de experiencia, aprender y mejorar sus habilidades en computación.
              </p>
              <p className="has-text-white glowing-text animate-text">
                Con StudyWeb, puedes aprender sobre programación, bases de datos, desarrollo de software, y mucho más, todo a tu propio ritmo y con el apoyo de una comunidad vibrante y de instructores expertos.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

const styles = {
  section: {
    backgroundColor: '#14161A',
    color: 'white',
    padding: '60px 20px',
    fontFamily: 'Poppins, sans-serif',
  },
  imageContainer: {
    position: 'relative',
    display: 'inline-block',
    boxShadow: '0 0 15px 5px rgba(72, 199, 142, 0.5)', // Borde luminoso alrededor de la imagen
    borderRadius: '10px',
  },
  image: {
    display: 'block',
    borderRadius: '10px',
    maxWidth: '100%',
    height: 'auto',
  },
};

export default AcercaDeStudyWeb;
