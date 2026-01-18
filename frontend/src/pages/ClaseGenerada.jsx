import Navbar from "../components/Navbar";

export default function ClaseGenerada() {
  return (
    <>
      <Navbar />
      <div style={{ padding: "40px" }}>
        <h2>Clase generada</h2>

        <div style={{
          background: "#ffffff",
          padding: "20px",
          marginTop: "20px",
          borderRadius: "6px"
        }}>
          <p>
            Aquí se mostrará el contenido generado por la inteligencia artificial.
          </p>
        </div>

        <div style={{ marginTop: "20px" }}>
          <button>No entendí el tema</button>
          <button style={{ marginLeft: "10px" }}>Más ejemplos</button>
          <button style={{ marginLeft: "10px" }}>Bibliografía</button>
        </div>
      </div>
    </>
  );
}
