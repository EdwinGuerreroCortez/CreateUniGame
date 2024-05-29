import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bulma/css/bulma.min.css';
import '../CSS/adminForms.css'; // Archivo CSS adicional para estilos específicos

const CuestionariosForm = () => {
  const [file, setFile] = useState(null);
  const [tema, setTema] = useState('');
  const [temas, setTemas] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [alert, setAlert] = useState({ type: '', message: '' });

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

  useEffect(() => {
    if (alert.message) {
      const timer = setTimeout(() => {
        setAlert({ type: '', message: '' });
      }, 5000); // Disappears after 5 seconds

      return () => clearTimeout(timer);
    }
  }, [alert]);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (file && tema.trim()) {
      setIsLoading(true);
      setAlert({ type: '', message: '' });
      const formData = new FormData();
      formData.append('file', file);
      formData.append('tema', tema);

      try {
        const response = await axios.post('http://localhost:3001/api/evaluaciones/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        setAlert({ type: 'success', message: 'Archivo subido exitosamente' });
        setFile(null);
        setTema('');
      } catch (error) {
        console.error('Error al subir archivo:', error);
        setAlert({ type: 'error', message: 'Error al subir archivo' });
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleCloseAlert = () => {
    setAlert({ type: '', message: '' });
  };

  return (
    <div style={{ backgroundColor: '#14161A', minHeight: '100vh', padding: '20px' }}>
      <div className="container">
        <h1 className="title has-text-centered has-text-white">Subir Cuestionario</h1>

        {alert.message && (
          <div className={`notification ${alert.type === 'success' ? 'is-success' : 'is-danger'}`}>
            <button className="delete" onClick={handleCloseAlert}></button>
            {alert.message}
          </div>
        )}

        <div className="box" style={{ backgroundColor: '#1F1F1F', borderRadius: '10px' }}>
          <div className="field">
            <label className="label has-text-white">Subir Archivo Excel</label>
            <div className="file is-primary has-name">
              <label className="file-label">
                <input className="file-input" type="file" accept=".xlsx, .xls" onChange={handleFileChange} />
                <span className="file-cta">
                  <span className="file-icon">
                    <i className="fas fa-upload"></i>
                  </span>
                  <span className="file-label">
                    Elige un archivo...
                  </span>
                </span>
                {file && (
                  <span className="file-name">
                    {file.name}
                  </span>
                )}
              </label>
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
          <div className="field is-grouped is-grouped-right">
            <div className="control">
              <button type="submit" className="button is-success" onClick={handleSubmit} disabled={isLoading}>
                {isLoading ? 'Cargando...' : 'Subir Cuestionario'}
              </button>
            </div>
          </div>
        </div>

        {isLoading && (
          <div className="has-text-centered">
            <button className="button is-loading is-large is-info">Cargando</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CuestionariosForm;
