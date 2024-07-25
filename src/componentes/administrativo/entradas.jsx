import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bulma/css/bulma.min.css';
import '../CSS/adminForms.css'; // Archivo CSS adicional para estilos específicos

const Entradas = () => {
  const [entradas, setEntradas] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [totalVisitas, setTotalVisitas] = useState(0);

  useEffect(() => {
    const fetchEntradas = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/entradas');
        const sortedEntradas = response.data.sort((a, b) => b.visitas - a.visitas); // Ordenar en orden descendente
        setEntradas(sortedEntradas);

                const total = sortedEntradas.reduce((sum, entrada) => sum + entrada.visitas, 0);
        setTotalVisitas(total);
      } catch (error) {
        console.error('Error al obtener las entradas:', error);
        setErrorMessage('Error al obtener las entradas.');
      }
    };

    fetchEntradas();
  }, []);

  return (
    <div style={{ backgroundColor: '#14161A', minHeight: '100vh', padding: '20px' }}>
      <div className="container">
        <h1 className="title has-text-centered has-text-white">Entradas de Usuarios</h1>

        {errorMessage && (
          <div className="notification is-danger">
            <button className="delete" onClick={() => setErrorMessage('')}></button>
            {errorMessage}
          </div>
        )}

        <div className="box" style={{ backgroundColor: '#1F1F1F', borderRadius: '20px', position: 'relative' }}>
          <div className="table-container">
            <table className="table is-fullwidth is-striped is-hoverable" style={{ fontSize: '1.2em' }}>
              <thead>
                <tr>
                  <th className="has-text-white">Nombre</th>
                  <th className="has-text-white">Correo</th>
                  <th className="has-text-white">Veces Ingresado</th>
                </tr>
              </thead>
              <tbody>
                {entradas.map((entrada) => (
                  <tr key={entrada._id} style={{ backgroundColor: '#2C2F33' }}>
                    <td>{entrada.nombre}</td>
                    <td>{entrada.correo}</td>
                    <td>{entrada.visitas}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

         
      </div>
       <div style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            color: 'white',
            padding: '10px',
            borderRadius: '10px',
            textAlign: 'center'
          }}>
            <p style={{ margin: 0 }}>Total de Visitas:</p>
            <p style={{ fontSize: '24px', margin: 0 }}>{totalVisitas}</p>
          </div>
        </div>
    </div>
  );
};

export default Entradas;
