import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "bulma/css/bulma.min.css";
import "../CSS/customStyles.css"; // Archivo CSS adicional para estilos específicos

const SubirImagenes = () => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [fileDetails, setFileDetails] = useState([]);
  const [uploadProgress, setUploadProgress] = useState(null);
  const [uploadedImageNames, setUploadedImageNames] = useState([]);
  const [showFileDetails, setShowFileDetails] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState('');

  useEffect(() => {
    if (alertMessage) {
      const timer = setTimeout(() => {
        setAlertMessage('');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [alertMessage]);

  const allowedExtensions = ['jpeg', 'jpg', 'png', 'gif'];

  const handleFileChange = (event) => {
    const files = event.target.files;
    const invalidFiles = Array.from(files).filter(file => {
      const extension = file.name.split('.').pop().toLowerCase();
      return !allowedExtensions.includes(extension);
    });
    if (invalidFiles.length > 0) {
      const invalidFileNames = invalidFiles.map(file => `${file.name} (${file.type})`).join(', ');
      setAlertMessage(`Formatos no válidos: ${invalidFileNames}`);
      setAlertType('is-danger');
      setSelectedFiles([]);
      setFileDetails([]);
      setShowFileDetails(false);
    } else {
      const details = Array.from(files).map(file => ({
        name: file.name,
        type: file.type,
        newName: file.name.split('.').slice(0, -1).join('.'), // Extract name without extension
        extension: file.name.split('.').pop() // Extract the extension
      }));
      setSelectedFiles(files);
      setFileDetails(details);
      setShowFileDetails(true);
      setAlertMessage('');
    }
  };

  const handleNameChange = (index, newName) => {
    const updatedDetails = [...fileDetails];
    updatedDetails[index].newName = newName;
    setFileDetails(updatedDetails);
  };

  const handleUpload = async () => {
    const invalidNames = fileDetails.filter(file => file.newName.trim() === '').map(file => file.name);
    if (invalidNames.length > 0) {
      setAlertMessage(`Los siguientes archivos tienen nombres inválidos: ${invalidNames.join(', ')}`);
      setAlertType('is-danger');
      setShowFileDetails(false);
      return;
    }

    const formData = new FormData();
    for (let i = 0; i < selectedFiles.length; i++) {
      const newName = `${fileDetails[i].newName}.${fileDetails[i].extension}`;
      formData.append('imagenes', selectedFiles[i], newName);
    }

    try {
      const response = await axios.post('http://localhost:3001/api/imagenesReact/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        onUploadProgress: (progressEvent) => {
          setUploadProgress(Math.round((progressEvent.loaded * 100) / progressEvent.total));
        }
      });
      
      setUploadedImageNames(response.data.imageNames);
      setUploadProgress(null);
      setSelectedFiles([]);
      setShowFileDetails(false);
      setShowConfirmation(true);
      setAlertMessage('Imágenes subidas exitosamente');
      setAlertType('is-success');
    } catch (error) {
      console.error('Error al subir las imágenes:', error);
      setUploadProgress(null);
      setAlertMessage('Error al subir las imágenes');
      setAlertType('is-danger');
    }
  };

  const handleConfirm = () => {
    setShowConfirmation(false);
  };

  const handleCancel = () => {
    setUploadedImageNames([]);
    setShowFileDetails(false);
    setShowConfirmation(false);
    setSelectedFiles([]);
  };

  return (
    <div className="section" style={{ minHeight: '60vh', backgroundColor: '#14161A', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <div className="container">
        {alertMessage && (
          <div className={`notification ${alertType}`}>
            {alertMessage}
            <button className="delete" onClick={() => setAlertMessage('')}></button>
          </div>
        )}
        <div className="columns is-centered">
          <div className="column is-full-mobile is-half-tablet is-one-third-desktop">
            <div className="box custom-box">
              <h1 className="title has-text-white has-text-centered">Subir Imágenes</h1>
              <div className="file-upload-container">
                <div className="file has-name is-centered custom-file-box">
                  <label className="file-label">
                    <input className="file-input" type="file" multiple onChange={handleFileChange} />
                    <span className="file-cta">
                      <span className="file-icon">
                        <i className="fas fa-upload"></i>
                      </span>
                      <span className="file-label">Seleccionar archivos...</span>
                    </span>
                    {selectedFiles.length > 0 && (
                      <span className="file-name">
                        {Array.from(selectedFiles).map(file => file.name).join(', ')}
                      </span>
                    )}
                  </label>
                </div>
              </div>
              {uploadProgress !== null && (
                <div className="progress-container" style={{ marginTop: '1rem' }}>
                  <progress className="progress is-primary" max="100" value={uploadProgress}>{uploadProgress}%</progress>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      {showFileDetails && (
        <div className="modal is-active">
          <div className="modal-background"></div>
          <div className="modal-card">
            <header className="modal-card-head">
              <p className="modal-card-title">Detalles de los Archivos</p>
              <button className="delete" aria-label="close" onClick={handleCancel}></button>
            </header>
            <section className="modal-card-body">
              <h2 className="subtitle">Archivos Seleccionados:</h2>
              <ul>
                {fileDetails.map((file, index) => (
                  <li key={index} style={{ marginBottom: '1rem' }}>
                    {file.name} ({file.type})<br />
                    <label className="label">Renombrar:</label>
                    <input
                      className="input"
                      type="text"
                      value={file.newName}
                      onChange={(e) => handleNameChange(index, e.target.value)}
                    />
                    .{file.extension}
                  </li>
                ))}
              </ul>
            </section>
            <footer className="modal-card-foot">
              <button className="button is-success" onClick={handleUpload}>Confirmar y Subir</button>
              <button className="button" onClick={handleCancel}>Cancelar</button>
            </footer>
          </div>
        </div>
      )}
      {showConfirmation && (
        <div className="modal is-active">
          <div className="modal-background"></div>
          <div className="modal-card">
            <header className="modal-card-head">
              <p className="modal-card-title">Confirmar Imágenes Cargadas</p>
              <button className="delete" aria-label="close" onClick={handleCancel}></button>
            </header>
            <section className="modal-card-body">
              <h2 className="subtitle">Nombres de Imágenes Cargadas:</h2>
              <ul>
                {uploadedImageNames.map((name, index) => (
                  <li key={index}>{name}</li>
                ))}
              </ul>
            </section>
            <footer className="modal-card-foot">
              <button className="button is-success" onClick={handleConfirm}>Confirmar</button>
              <button className="button" onClick={handleCancel}>Cancelar</button>
            </footer>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubirImagenes;
