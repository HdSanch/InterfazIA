import Navbar from "../components/Navbar";

export default function Evaluacion() {
  return (
    <>
      <Navbar />
      <div style={{ padding: "40px" }}>
        <h2>Evaluación</h2>

        <p>Responde la siguiente pregunta:</p>

        <div style={{
          background: "#ffffff",
          padding: "20px",
          marginTop: "20px"
        }}>
          <p>
            ¿Cuál es la principal ventaja de utilizar listas enlazadas?
          </p>

          <button>A) Uso eficiente de memoria</button><br />
          <button>B) Acceso aleatorio rápido</button><br />
          <button>C) Menor complejidad</button>
        </div>
      </div>
    </>
  );
}
