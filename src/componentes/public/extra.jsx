import React from 'react';
import logo1 from '../img/icono_ap.png';
import logo2 from '../img/icono_con.png';
import logo3 from '../img/icono_herra.png';

const caracteristicas = [
  { id: 1, icono: logo1, titulo: "Aprendizaje Interactivo", descripcion: "Accede a cursos dinámicos que te permiten aprender a tu propio ritmo, facilitando la comprensión de cada concepto antes de avanzar." },
  { id: 2, icono: logo2, titulo: "Contenido Especializado", descripcion: "Nuestros contenidos están diseñados por expertos en diversas áreas de la computación, cubriendo desde los fundamentos hasta técnicas avanzadas." },
  { id: 3, icono: logo3, titulo: "Comunidad y Soporte", descripcion: "Únete a nuestra comunidad de entusiastas de la tecnología, participa en discusiones y recibe soporte directo de instructores." }
];

const Extra = () => {
  return (
    <div style={{ backgroundColor: '#14161A', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <div className="container" style={{ backgroundColor: '#14161A', padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
        <h1 className="title has-text-centered has-text-white is-size-4">¿Por qué elegir nuestra plataforma?</h1>
        <div className="columns is-multiline">
          {caracteristicas.map((item) => (
            <div key={item.id} className="column is-one-third">
              <div className="card" style={{
                margin: '10px',
                backgroundColor: 'white',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1), 0 0 15px rgba(255, 255, 255, 0.6)',
                minHeight: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                border: '1px solid #ccc',
                borderRadius: '10px',
                overflow: 'hidden'
              }}>
                <div className="card-image" style={{ padding: '10px' }}>
                  <figure className="image is-128x128" style={{ margin: 'auto' }}>
                    <img src={item.icono} alt={`Icono de ${item.titulo}`} style={{ width: '120px', height: '120px' }} />
                  </figure>
                </div>
                <div className="card-content">
                  <p className="title is-5 has-text-centered has-text-dark">{item.titulo}</p>
                  <p className="subtitle is-6 has-text-centered has-text-grey-dark">{item.descripcion}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Extra;
