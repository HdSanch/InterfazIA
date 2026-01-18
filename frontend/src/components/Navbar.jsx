import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import "../styles/main.css";

export default function Navbar() {
  return (
    <motion.header 
      className="navbar"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="navbar-left">
        <motion.div
          whileHover={{ scale: 1.05, rotate: 5 }}
          transition={{ duration: 0.3 }}
        >
          <img src="/escudo.png" alt="EPN" className="logo" />
        </motion.div>
        <span className="brand">Escuela Politécnica Nacional</span>
      </div>

      <nav className="navbar-right">
        <NavLink to="/" className="nav-link">
          {({ isActive }) => (
            <motion.span
              whileHover={{ y: -2 }}
              className={isActive ? "active" : ""}
            >
              Inicio
            </motion.span>
          )}
        </NavLink>
        
        <NavLink to="/tema" className="nav-link">
          {({ isActive }) => (
            <motion.span
              whileHover={{ y: -2 }}
              className={isActive ? "active" : ""}
            >
              Simulador
            </motion.span>
          )}
        </NavLink>
        
        <NavLink to="/ayuda" className="nav-link">
          {({ isActive }) => (
            <motion.span
              whileHover={{ y: -2 }}
              className={isActive ? "active" : ""}
            >
              Ayuda
            </motion.span>
          )}
        </NavLink>
      </nav>
    </motion.header>
  );
}