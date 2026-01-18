import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { ClassProvider } from "./context/ClassContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ClassProvider>
      <App />
    </ClassProvider>
  </React.StrictMode>
);
