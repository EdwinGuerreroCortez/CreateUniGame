import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bulma/css/bulma.min.css';
import '../CSS/adminForms.css'; // Archivo CSS adicional para estilos específicos

const MisionVisionForm = () => {
  const [mision, setMision] = useState('');
  const [vision, setVision] = useState('');
  const [items, setItems] = useState([]);
  const [alert, setAlert] = useState({ type: '', message: '' });

    const fetchMisionVision = async () => {
    try {
      const response = await axios.get('http://172.16.19.1:3001/api/misionVision');
      setItems(response.data);
    } catch (error) {
      setAlert({ type: 'danger', message: 'Error al cargar los datos' });
      hideAlert();
    }
  };

    useEffect(() => {
    fetchMisionVision();
  }, []);

  const handleAgregar = async () => {
    if (mision.trim() && vision.trim()) {
      const newItem = { mision, vision };
      try {
        const response = await axios.post('http://172.16.19.1:3001/api/misionVision', newItem);
        setItems([...items, response.data]);
        setMision('');
        setVision('');
        setAlert({ type: 'success', message: 'Misión y Visión agregadas exitosamente' });
        hideAlert();
      } catch (error) {
        setAlert({ type: 'danger', message: 'Error al agregar el item' });
        hideAlert();
      }
    } else {
      setAlert({ type: 'warning', message: 'Por favor completa todos los campos' });
      hideAlert();
    }
  };

  const handleEliminar = async (index, id) => {
    try {
      await axios.delete(`http://172.16.19.1:3001/api/misionVision/${id}`);
      setItems(items.filter((_, i) => i !== index));
      setAlert({ type: 'success', message: 'Misión y Visión eliminadas exitosamente' });
      hideAlert();
    } catch (error) {
      setAlert({ type: 'danger', message: 'Error al eliminar el item' });
      hideAlert();
    }
  };

  const hideAlert = () => {
    setTimeout(() => {
      setAlert({ type: '', message: '' });
    }, 3000); // Ocultar la alerta después de 3 segundos
  };

  return (
    <div style={{ backgroundColor: '#14161A', minHeight: '100vh', padding: '20px' }}>
      <div className="container">
        <h1 className="title has-text-centered has-text-white">Administrar Misión y Visión</h1>
        {alert.message && (
          <div className={`notification is-${alert.type} fixed-alert`}>
            <button className="delete" onClick={() => setAlert({ type: '', message: '' })}></button>
            {alert.message}
          </div>
        )}
        <div className="box" style={{ backgroundColor: '#1F1F1F', borderRadius: '10px' }}>
          <div className="columns is-multiline">
            <div className="column is-half">
              <div className="field">
                <label className="label has-text-white">Misión</label>
                <div className="control">
                  <textarea
                    className="textarea"
                    value={mision}
                    onChange={(e) => setMision(e.target.value)}
                    placeholder="Escribe la misión"
                    required
                  />
                </div>
              </div>
            </div>
            <div className="column is-half">
              <div className="field">
                <label className="label has-text-white">Visión</label>
                <div className="control">
                  <textarea
                    className="textarea"
                    value={vision}
                    onChange={(e) => setVision(e.target.value)}
                    placeholder="Escribe la visión"
                    required
                  />
                </div>
              </div>
            </div>
            <div className="column is-full">
              <div className="field is-grouped is-grouped-centered">
                <div className="control">
                  <button className="button is-success" onClick={handleAgregar}>
                    Agregar Misión y Visión
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="column is-full">
            <h2 className="title is-4 has-text-centered has-text-white">Lista de Misión y Visión</h2>
            <table className="table is-fullwidth is-striped is-hoverable">
              <thead>
                <tr>
                  <th className="has-text-white">Misión</th>
                  <th className="has-text-white">Visión</th>
                  <th className="has-text-white">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, index) => (
                  <tr key={item._id} style={{ backgroundColor: '#2C2F33' }}>
                    <td className="has-text-white">{item.mision}</td>
                    <td className="has-text-white">{item.vision}</td>
                    <td className="has-text-centered">
                      <button
                        className="button is-danger is-small"
                        onClick={() => handleEliminar(index, item._id)}
                        data-tooltip="Eliminar"
                        style={{ padding: '0.75rem', minWidth: '2.5rem' }}
                      >
                        <span className="icon is-large">
                          <i className="fas fa-trash-alt"></i>
                        </span>
                      </button>
                    </td>


                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MisionVisionForm;
