import Sidebar from "../components/Sidebar";
import People from "../components/People";
import Planets from "../components/Planets";
import Vehicles from "../components/Vehicles";
import { Routes, Route, Navigate } from "react-router-dom";

export default function Home() {
  return (
    <div className="container-fluid mt-4">
      <div className="row">
        <div className="col-12 col-lg-3 col-xl-2 mb-4">
          <Sidebar />
        </div>
        <div className="col-12 col-lg-9 col-xl-10">
          {/* Secciones */}
          <Routes>
            <Route path="/" element={<Navigate to="people" replace />} />
            <Route path="people" element={<Section title="Characters"><People /></Section>} />
            <Route path="planets" element={<Section title="Planets"><Planets /></Section>} />
            <Route path="vehicles" element={<Section title="Vehicles"><Vehicles /></Section>} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <>
      <h2 className="mb-3" style={{ color: "#e11d48" }}>{title}</h2>
      {children}
    </>
  );
}
