import { useContext, useState } from "react";
import { ClassContext } from "../context/ClassContext";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "../components/Navbar";
import "../styles/main.css";

export default function IntroducirTema() {
  const { setDocId, setFileName } = useContext(ClassContext);
  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [notification, setNotification] = useState(null);
  const navigate = useNavigate();

  // Función para mostrar notificaciones
  const showNotification = (message, type = 'error') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 5000);
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      setFile(droppedFile);
    }
  };

  const removeFile = () => {
    setFile(null);
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  async function subirArchivo() {
    if (!file) {
      showNotification("Por favor, seleccione un archivo para continuar", 'warning');
      return;
    }

    setIsUploading(true);

    try {
      const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch(`${apiBaseUrl}/documents/upload`, {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      const data = await res.json();

      // Manejo de errores específicos
      if (!res.ok) {
        if (res.status === 429) {
          showNotification("⚠️ Límite de cuota de API alcanzado. Por favor, espere unos minutos e intente nuevamente.", 'warning');
          return;
        }
        
        if (res.status === 413) {
          showNotification("❌ El archivo es demasiado grande. Tamaño máximo: 10 MB", 'error');
          return;
        }

        if (res.status === 400) {
          showNotification(`❌ ${data.detail || 'Error al procesar el archivo'}`, 'error');
          return;
        }
        
        showNotification(`❌ Error al subir el archivo: ${data.detail || 'Error desconocido'}`, 'error');
        return;
      }

      // Éxito
      setDocId(data.doc_id);
      setFileName(file.name);
      
      showNotification("✅ Documento cargado exitosamente", 'success');
      
      // Navegar después de mostrar el toast de éxito
      setTimeout(() => {
        navigate("/workspace");
      }, 1000);
      
    } catch (error) {
      console.error("Error completo:", error);
      showNotification("❌ Error de conexión. Verifique que el servidor esté funcionando.", 'error');
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <>
      <Navbar />
      
      {/* NOTIFICACIONES FLOTANTES */}
      <AnimatePresence>
        {notification && (
          <motion.div
            className={`notification-toast ${notification.type}`}
            initial={{ opacity: 0, y: -50, x: '-50%' }}
            animate={{ opacity: 1, y: 20 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.3 }}
          >
            <div className="notification-content">
              {notification.message}
            </div>
            <button 
              className="notification-close"
              onClick={() => setNotification(null)}
            >
              ✕
            </button>
          </motion.div>
        )}
      </AnimatePresence>
      
      <div className="upload-container">
        <motion.div 
          className="upload-wrapper"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* HEADER */}
          <div className="upload-header">
            <h1 className="upload-title">
              Cargar <span>Documento Académico</span>
            </h1>
            <p className="upload-description">
              Suba su material de estudio para iniciar el proceso de análisis mediante inteligencia artificial
            </p>
          </div>

          {/* UPLOAD CARD */}
          <motion.div 
            className="upload-card"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            {/* FILE DROP ZONE */}
            <div className="file-input-wrapper">
              <div
                className={`file-drop-zone ${file ? 'has-file' : ''} ${isDragging ? 'dragging' : ''}`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <div className="upload-icon-wrapper">
                  <span className="upload-icon">📄</span>
                </div>
                <h3>
                  {file ? 'Archivo seleccionado' : 'Seleccionar archivo'}
                </h3>
                <p>Arrastre el archivo aquí o haga clic para examinar</p>
                <p className="file-types">
                  PDF • DOCX • DOC
                </p>
                <input
                  type="file"
                  className="real-file-input"
                  onChange={handleFileChange}
                  accept=".pdf,.doc,.docx"
                />
              </div>

              {/* FILE PREVIEW */}
              {file && (
                <motion.div 
                  className="file-preview"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="file-icon">📄</div>
                  <div className="file-info">
                    <div className="file-name">{file.name}</div>
                    <div className="file-size">{formatFileSize(file.size)}</div>
                  </div>
                  <button 
                    className="file-remove"
                    onClick={removeFile}
                    type="button"
                    title="Eliminar archivo"
                  >
                    ✕
                  </button>
                </motion.div>
              )}
            </div>

            {/* UPLOAD BUTTON */}
            <button
              className={`upload-button ${isUploading ? 'loading' : ''}`}
              onClick={subirArchivo}
              disabled={!file || isUploading}
            >
              {isUploading ? 'Procesando archivo...' : 'Procesar documento'}
            </button>

            {/* SECURITY BADGE */}
            <div className="security-badge">
              <span className="security-icon">🔒</span>
              <span>Conexión segura y encriptada</span>
            </div>

            {/* INFO BOX */}
            <div className="info-box">
              <h4>Requisitos del documento</h4>
              <ul>
                <li>Formato aceptado: PDF, Microsoft Word (DOC, DOCX)</li>
                <li>Tamaño máximo: 10 MB</li>
                <li>El documento debe contener texto legible</li>
                <li>Se recomienda contenido estructurado con títulos y subtítulos</li>
              </ul>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </>
  );
}