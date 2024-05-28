import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bulma/css/bulma.min.css';
import '../CSS/adminForms.css'; // Archivo CSS adicional para estilos específicos

const CuestionariosForm = () => {
  const [file, setFile] = useState(null);
  const [tema, setTema] = useState('');
  const [temas, setTemas] = useState([]);

  // Obtener la lista de temas desde el backend
  useEffect(() => {
    const fetchTemas = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/temas');
        setTemas(response.data);
      } catch (error) {
        console.error('Error al obtener los temas:', error);
      }
    };

    fetchTemas();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (file && tema.trim()) {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('tema', tema);

      try {
        const response = await axios.post('http://localhost:3001/api/evaluaciones/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        alert('Archivo subido exitosamente');
        setFile(null);
        setTema('');
      } catch (error) {
        console.error('Error al subir archivo:', error);
        alert('Error al subir archivo');
      }
    }
  };

  return (
    <div className="container" style={{ backgroundColor: '#14161A', minHeight: '100vh', padding: '20px' }}>
      <div className="box" style={{ backgroundColor: '#1F1F1F', borderRadius: '10px' }}>
        <h1 className="title has-text-centered has-text-white">Subir Cuestionario</h1>
        <form onSubmit={handleSubmit}>
          <div className="field">
            <label className="label has-text-white">Archivo Excel</label>
            <div className="control">
              <input
                className="input"
                type="file"
                accept=".xlsx, .xls"
                onChange={(e) => setFile(e.target.files[0])}
                required
              />
            </div>
          </div>
          <div className="field">
            <label className="label has-text-white">Tema</label>
            <div className="control">
              <div className="select">
                <select value={tema} onChange={(e) => setTema(e.target.value)} required>
                  <option value="" disabled>Selecciona un tema</option>
                  {temas.map((tema) => (
                    <option key={tema._id} value={tema._id}>{tema.titulo}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          <div className="field is-grouped is-grouped-centered">
            <div className="control">
              <button type="submit" className="button is-success">
                Subir Cuestionario
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CuestionariosForm;
