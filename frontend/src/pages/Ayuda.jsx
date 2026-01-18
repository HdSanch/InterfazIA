import { useState } from "react";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import "../styles/main.css";

export default function Ayuda() {
  const [activeFaq, setActiveFaq] = useState(null);

  const toggleFaq = (index) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  const faqs = [
    {
      question: "¿Qué formatos de documentos son compatibles?",
      answer: "El sistema acepta documentos en formato PDF, Microsoft Word (DOC y DOCX). Asegúrese de que el contenido sea legible y esté bien estructurado para obtener mejores resultados."
    },
    {
      question: "¿Cuánto tiempo tarda el procesamiento?",
      answer: "El procesamiento del documento generalmente toma entre 10 y 30 segundos, dependiendo del tamaño y complejidad del archivo. Recibirá una notificación una vez completado el análisis."
    },
    {
      question: "¿Los documentos cargados son seguros?",
      answer: "Sí, todos los documentos se procesan mediante conexiones encriptadas y se almacenan de forma segura. La información es tratada con estricta confidencialidad según las políticas institucionales."
    },
    {
      question: "¿Puedo editar el contenido generado?",
      answer: "El contenido generado por la IA puede ser revisado y utilizado como base para su estudio. Sin embargo, se recomienda complementarlo con fuentes adicionales y su propio análisis crítico."
    }
  ];

  return (
    <>
      <Navbar />
      
      <div className="help-container">
        <motion.div 
          className="help-wrapper"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {/* HEADER */}
          <motion.div 
            className="help-header"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h1 className="help-title">Centro de Ayuda</h1>
            <p className="help-subtitle">
              Guía completa para utilizar el simulador de clases con inteligencia artificial
            </p>
          </motion.div>

          {/* STEPS */}
          <motion.div 
            className="help-steps-grid"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="help-step-card">
              <div className="step-number">1</div>
              <h3>Cargar documento académico</h3>
              <p>
                Acceda a la sección "Simulador" y cargue su material de estudio en formato PDF o Word. 
                El documento debe contener el contenido que desea analizar.
              </p>
            </div>

            <div className="help-step-card">
              <div className="step-number">2</div>
              <h3>Procesamiento con IA</h3>
              <p>
                El sistema analizará automáticamente el documento utilizando inteligencia artificial. 
                Se generarán resúmenes, conceptos clave y material de estudio personalizado.
              </p>
            </div>

            <div className="help-step-card">
              <div className="step-number">3</div>
              <h3>Revisar contenido generado</h3>
              <p>
                Explore el contenido procesado en el área de trabajo. Podrá acceder a resúmenes, 
                definiciones y estructuras de aprendizaje basadas en su documento.
              </p>
            </div>

            <div className="help-step-card">
              <div className="step-number">4</div>
              <h3>Realizar evaluaciones</h3>
              <p>
                Complete las evaluaciones generadas automáticamente para verificar su comprensión 
                del material. Las preguntas se basan en el contenido de su documento.
              </p>
            </div>

            <div className="help-step-card">
              <div className="step-number">5</div>
              <h3>Obtener retroalimentación</h3>
              <p>
                Reciba retroalimentación detallada sobre su desempeño. El sistema identificará 
                áreas de mejora y sugerirá temas para reforzar.
              </p>
            </div>

            <div className="help-step-card">
              <div className="step-number">6</div>
              <h3>Interactuar con la IA</h3>
              <p>
                Utilice el chat integrado para hacer preguntas específicas sobre el contenido, 
                solicitar aclaraciones o profundizar en temas particulares.
              </p>
            </div>
          </motion.div>

          {/* FAQ */}
          <motion.div 
            className="help-faq-section"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h2 className="faq-section-title">Preguntas Frecuentes</h2>
            <div className="faq-list">
              {faqs.map((faq, index) => (
                <div 
                  key={index} 
                  className={`faq-item ${activeFaq === index ? 'active' : ''}`}
                >
                  <button 
                    className="faq-question"
                    onClick={() => toggleFaq(index)}
                  >
                    <span>{faq.question}</span>
                    <span className="faq-icon">▼</span>
                  </button>
                  <div className="faq-answer">
                    <p>{faq.answer}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* TIPS */}
          <motion.div 
            className="help-tips-section"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <h3 className="tips-title">
              <span>💡</span>
              Consejos para Mejores Resultados
            </h3>
            <div className="tips-list">
              <div className="tip-item">
                <span className="tip-icon">📝</span>
                <div className="tip-content">
                  <h4>Documentos bien estructurados</h4>
                  <p>
                    Utilice documentos con títulos, subtítulos y párrafos claramente definidos. 
                    Esto mejora significativamente la calidad del análisis.
                  </p>
                </div>
              </div>

              <div className="tip-item">
                <span className="tip-icon">📊</span>
                <div className="tip-content">
                  <h4>Contenido relevante</h4>
                  <p>
                    Asegúrese de que el documento contenga información académica pertinente. 
                    Evite documentos con exceso de imágenes o formato complejo.
                  </p>
                </div>
              </div>

              <div className="tip-item">
                <span className="tip-icon">🎯</span>
                <div className="tip-content">
                  <h4>Tamaño óptimo</h4>
                  <p>
                    Los documentos entre 5 y 50 páginas ofrecen los mejores resultados. 
                    Documentos muy extensos pueden requerir más tiempo de procesamiento.
                  </p>
                </div>
              </div>

              <div className="tip-item">
                <span className="tip-icon">🔄</span>
                <div className="tip-content">
                  <h4>Revisión continua</h4>
                  <p>
                    Revise y complemente el contenido generado con sus propias notas. 
                    La IA es una herramienta de apoyo, no un sustituto del estudio activo.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* CONTACT */}
          <motion.div 
            className="help-contact-section"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <h3 className="contact-title">¿Necesita Asistencia Adicional?</h3>
            <p className="contact-description">
              Nuestro equipo de soporte está disponible para ayudarle con cualquier consulta o inconveniente técnico.
            </p>
            <button className="contact-button">
              Contactar Soporte
            </button>
          </motion.div>
        </motion.div>
      </div>
    </>
  );
}