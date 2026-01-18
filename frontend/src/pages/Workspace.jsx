import { useContext, useState } from "react";
import { ClassContext } from "../context/ClassContext";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "../components/Navbar";
import ChatBox from "../components/ChatBox";
import QuestionsInteractive from "../components/QuestionsInteractive";
import "../styles/main.css";

export default function Workspace() {
  const { docId, content, setContent, fileName } = useContext(ClassContext);
  const [isLoading, setIsLoading] = useState(false);
  const [activeAction, setActiveAction] = useState(null);
  const [notification, setNotification] = useState(null);
  const navigate = useNavigate();

  // Función para mostrar notificaciones
  const showNotification = (message, type = 'error') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  // Función para formatear Markdown a HTML
  const formatMarkdown = (text) => {
    if (!text) return '';
    
    return text
      // Headers
      .replace(/^### (.*$)/gim, '<h3 class="md-h3">$1</h3>')
      .replace(/^## (.*$)/gim, '<h2 class="md-h2">$1</h2>')
      .replace(/^# (.*$)/gim, '<h1 class="md-h1">$1</h1>')
      
      // Bold
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      
      // Italic
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      
      // Lists
      .replace(/^\* (.*$)/gim, '<li class="md-li">$1</li>')
      .replace(/^- (.*$)/gim, '<li class="md-li">$1</li>')
      
      // Checkboxes
      .replace(/^\[ \] (.*$)/gim, '<label class="md-checkbox"><input type="checkbox" disabled> $1</label>')
      .replace(/^\[✓\] (.*$)/gim, '<label class="md-checkbox"><input type="checkbox" checked disabled> $1</label>')
      
      // Horizontal rule
      .replace(/^---$/gim, '<hr>')
      
      // Line breaks
      .replace(/\n/g, '<br>');
  };

  if (!docId) {
    return (
      <>
        <Navbar />
        <div className="workspace-empty">
          <div className="empty-icon">📄</div>
          <h3 className="empty-title">No hay documento cargado</h3>
          <p className="empty-description">
            Para comenzar a trabajar, debe cargar un documento académico en el sistema.
          </p>
          <button 
            className="empty-action-btn"
            onClick={() => navigate("/tema")}
          >
            Cargar Documento
          </button>
        </div>
      </>
    );
  }

  async function safeFetch(url) {
    try {
      const res = await fetch(url, { method: "POST" });
      const data = await res.json();

      // Verificar si hay error 429
      if (!res.ok && res.status === 429) {
        showNotification("⚠️ Límite diario de la API alcanzado. Por favor, intente más tarde.", 'warning');
        return null;
      }

      // Verificar si el backend devolvió un error en el JSON
      if (data?.error?.code === 429) {
        showNotification("⚠️ Límite diario de la API alcanzado. Por favor, intente más tarde.", 'warning');
        return null;
      }

      if (!res.ok) {
        showNotification(`❌ Error del servidor: ${data.detail || 'Error desconocido'}`, 'error');
        return null;
      }

      return data;
    } catch (error) {
      console.error("Error en safeFetch:", error);
      showNotification("❌ Error de conexión con el servidor.", 'error');
      return null;
    }
  }

  async function generarResumen() {
    setIsLoading(true);
    setActiveAction('resumen');
    setContent('');
    
    try {
      const data = await safeFetch(
        `http://127.0.0.1:8000/documents/${docId}/summary`
      );
      
      console.log("Respuesta resumen:", data);
      
      if (data?.summary) {
        setContent(data.summary);
        showNotification("✅ Resumen generado correctamente", 'success');
      } else if (data !== null) {
        showNotification("❌ No se pudo generar el resumen", 'error');
      }
    } catch (error) {
      console.error("Error en generarResumen:", error);
      showNotification("❌ Error al generar el resumen", 'error');
    } finally {
      setIsLoading(false);
    }
  }

  async function generarPreguntas() {
    setIsLoading(true);
    setActiveAction('preguntas');
    setContent('');
    
    try {
      const data = await safeFetch(
        `http://127.0.0.1:8000/documents/${docId}/practice/generate?n=8`
      );
      
      console.log("Respuesta preguntas:", data);
      
      if (data?.questions && Array.isArray(data.questions)) {
        // Guardamos las preguntas como JSON para renderizar el componente interactivo
        setContent(JSON.stringify({ type: 'questions', data: data.questions }));
        showNotification("✅ Preguntas generadas correctamente", 'success');
      } else if (data !== null) {
        showNotification("❌ No se pudieron generar las preguntas", 'error');
      }
    } catch (error) {
      console.error("Error en generarPreguntas:", error);
      showNotification("❌ Error al generar las preguntas", 'error');
    } finally {
      setIsLoading(false);
    }
  }

  async function generarPlan() {
    setIsLoading(true);
    setActiveAction('plan');
    setContent('');
    
    try {
      const data = await safeFetch(
        `http://127.0.0.1:8000/documents/${docId}/study-plan`
      );
      
      console.log("Respuesta plan:", data);
      
      // El backend devuelve "study_plan" no "plan"
      if (data?.study_plan) {
        setContent(data.study_plan);
        showNotification("✅ Plan de estudio generado correctamente", 'success');
      } else if (data !== null) {
        showNotification("❌ No se pudo generar el plan de estudio", 'error');
      }
    } catch (error) {
      console.error("Error en generarPlan:", error);
      showNotification("❌ Error al generar el plan de estudio", 'error');
    } finally {
      setIsLoading(false);
    }
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(content);
    showNotification("📋 Contenido copiado al portapapeles", 'success');
  };

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
      
      <div className="workspace-container">
        <div className="workspace-layout">
          {/* SIDEBAR */}
          <aside className="workspace-sidebar">
            <div className="sidebar-header">
              <div className="sidebar-title">Documento Actual</div>
              <div className="document-info">
                <div className="document-label">Archivo</div>
                <div className="document-name">{fileName}</div>
              </div>
            </div>

            <div className="sidebar-actions">
              <button 
                className={`sidebar-action-btn ${activeAction === 'resumen' ? 'active' : ''}`}
                onClick={generarResumen}
                disabled={isLoading}
              >
                <span className="action-icon">📝</span>
                Generar Resumen
              </button>

              <button 
                className={`sidebar-action-btn ${activeAction === 'preguntas' ? 'active' : ''}`}
                onClick={generarPreguntas}
                disabled={isLoading}
              >
                <span className="action-icon">❓</span>
                Generar Preguntas
              </button>

              <button 
                className={`sidebar-action-btn ${activeAction === 'plan' ? 'active' : ''}`}
                onClick={generarPlan}
                disabled={isLoading}
              >
                <span className="action-icon">📊</span>
                Plan de Estudio
              </button>
            </div>
          </aside>

          {/* MAIN CONTENT */}
          <main className="workspace-main">
            <div className="workspace-header">
              <h2>Espacio de Trabajo</h2>
            </div>

            <div className="workspace-content-area">
              {/* CONTENT DISPLAY */}
              <motion.div 
                className="content-display-card"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="content-display-header">
                  <div className="content-display-title">
                    {activeAction === 'resumen' && 'Resumen del Documento'}
                    {activeAction === 'preguntas' && 'Preguntas de Práctica'}
                    {activeAction === 'plan' && 'Plan de Estudio'}
                    {!activeAction && 'Contenido Generado'}
                  </div>
                  {content && !isLoading && activeAction !== 'preguntas' && (
                    <div className="content-actions">
                      <button 
                        className="content-action-icon"
                        onClick={copyToClipboard}
                        title="Copiar"
                      >
                        📋
                      </button>
                    </div>
                  )}
                </div>

                <div className="content-display-body">
                  {isLoading ? (
                    <div className="content-loading">
                      <div className="loading-spinner"></div>
                      <div className="loading-text">Procesando documento...</div>
                    </div>
                  ) : content ? (
                    (() => {
                      // Intentar parsear como JSON para detectar preguntas
                      try {
                        const parsed = JSON.parse(content);
                        if (parsed.type === 'questions') {
                          return <QuestionsInteractive questions={parsed.data} docId={docId} />;
                        }
                      } catch (e) {
                        // No es JSON, mostrar como markdown
                      }
                      
                      // Mostrar contenido con formato Markdown
                      return (
                        <div 
                          className="content-text markdown-content" 
                          dangerouslySetInnerHTML={{ __html: formatMarkdown(content) }}
                        />
                      );
                    })()
                  ) : (
                    <div className="content-placeholder">
                      <div className="placeholder-icon">📄</div>
                      <div className="placeholder-text">Sin contenido generado</div>
                      <div className="placeholder-hint">
                        Seleccione una acción en el panel lateral para comenzar
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>

              {/* CHAT SECTION */}
              <motion.div 
                className="workspace-chat-section"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <div className="chat-header">
                  <div className="chat-title">
                    <span>💬</span>
                    Asistente Virtual
                  </div>
                </div>
                <ChatBox />
              </motion.div>
            </div>
          </main>
        </div>
      </div>
    </>
  );
}