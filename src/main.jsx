// ======================= IMPORTACIONES REACT Y ROUTER =========
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";

// ===== importa el HOC de tu contexto
import injectContext from "./context/AppContext";

// ======================= ESTILOS BOOTSTRAP =========
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "./styles.css";

// ===== crea la App envuelta con el Provider
const AppWithContext = injectContext(App);

// ======================= RENDER DE APP =========
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AppWithContext />   {/* <-- ahora Navbar tiene provider */}
  </React.StrictMode>
);
