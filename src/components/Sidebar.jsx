// ======================= comentario =========
// Sidebar con links a las categorías, estilo Bootstrap
import { NavLink } from "react-router-dom";

export default function Sidebar() {
  const linkClass = ({ isActive }) =>
    "list-group-item list-group-item-action" + (isActive ? " active" : "");

  return (
    <div className="sw-sidebar">
      <div className="list-group rounded-3 shadow-sm">
        <NavLink to="/people" className={linkClass}>Characters</NavLink>
        <NavLink to="/planets" className={linkClass}>Planets</NavLink>
        <NavLink to="/vehicles" className={linkClass}>Vehicles</NavLink>
      </div>
    </div>
  );
}
