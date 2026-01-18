import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import IntroducirTema from "./pages/IntroducirTema";
import Generando from "./pages/Generando";
import ClaseGenerada from "./pages/ClaseGenerada";
import Evaluacion from "./pages/Evaluacion";
import Resultados from "./pages/Resultados";
import Ayuda from "./pages/Ayuda";
import Workspace from "./pages/Workspace";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/tema" element={<IntroducirTema />} />
        <Route path="/generando" element={<Generando />} />
        <Route path="/workspace" element={<Workspace />} />
        <Route path="/clase" element={<ClaseGenerada />} />
        <Route path="/evaluacion" element={<Evaluacion />} />
        <Route path="/resultados" element={<Resultados />} />
        <Route path="/ayuda" element={<Ayuda />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
