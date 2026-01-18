import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import "../styles/main.css";

export default function Home() {
  const navigate = useNavigate();

  return (
    <>
      <Navbar />

      <main className="home-container">
        {/* HERO */}
        <motion.section
          className="home-hero"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.h1 
            className="home-title"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            Simulador de Clases <br />
            <span>Personalizadas con IA</span>
          </motion.h1>

          <motion.p 
            className="home-subtitle"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            Genera resúmenes, preguntas y planes de estudio a partir de tus propios
            documentos, usando inteligencia artificial.
          </motion.p>

          <motion.div 
            className="home-actions"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            <motion.button
              className="btn-primary"
              onClick={() => navigate("/tema")}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Iniciar Simulación
            </motion.button>

            <motion.button
              className="btn-secondary"
              onClick={() => navigate("/ayuda")}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              ¿Cómo funciona?
            </motion.button>
          </motion.div>
        </motion.section>

        {/* HOW IT WORKS */}
        <motion.section
          className="home-steps"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <motion.div 
            className="step-card"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.5 }}
            whileHover={{ y: -12 }}
          >
            <h3>1. Sube tu material</h3>
            <p>
              Carga documentos académicos en PDF o Word para ser analizados por la IA.
            </p>
          </motion.div>

          <motion.div 
            className="step-card"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.5 }}
            whileHover={{ y: -12 }}
          >
            <h3>2. Procesamiento inteligente</h3>
            <p>
              El sistema genera resúmenes, preguntas y planes de estudio personalizados.
            </p>
          </motion.div>

          <motion.div 
            className="step-card"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.4, duration: 0.5 }}
            whileHover={{ y: -12 }}
          >
            <h3>3. Aprende interactuando</h3>
            <p>
              Conversa con la IA, aclara dudas y refuerza tu aprendizaje.
            </p>
          </motion.div>
        </motion.section>
      </main>
    </>
  );
}