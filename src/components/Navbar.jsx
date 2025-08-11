// =======================  =========
import { Link } from "react-router-dom";
import { useContext } from "react";
import { Context } from "../context/AppContext";
import SearchAutocomplete from "./SearchAutocomplete";

export default function Navbar() {
  const { store, actions } = useContext(Context);

  return (
    <nav className="navbar navbar-dark bg-dark">
      <div className="container gap-3">
        {/* =======================  ========= Branding y Home */}
        <Link className="navbar-brand" to="/">StarWarsBlog</Link>

        {/* =======================  ========= Buscador con autocompletar */}
        <div className="flex-grow-1" style={{ maxWidth: 520 }}>
          <SearchAutocomplete />
        </div>

        {/* =======================  ========= Dropdown de favoritos */}
        <div className="dropdown">
          <button className="btn btn-primary dropdown-toggle" data-bs-toggle="dropdown">
            Favorites <span className="badge bg-warning text-dark ms-1">{store.favorites.length}</span>
          </button>
          <ul className="dropdown-menu dropdown-menu-end" style={{ minWidth: 260 }}>
            {store.favorites.length === 0 && (
              <li className="dropdown-item text-muted">No favorites yet</li>
            )}

            {store.favorites.map((fav) => (
              <li key={fav.id} className="d-flex align-items-center gap-2 dropdown-item">
                <Link className="text-decoration-none flex-grow-1"
                      to={`/details/${fav.type}/${fav.uid}`}>
                  {fav.name}
                </Link>
                <button
                  className="btn btn-sm btn-outline-danger"
                  onClick={() => actions.toggleFavorite(fav)}
                  title="Remove"
                >
                  <i className="fas fa-trash" />
                </button>
              </li>
            ))}

            {/* =======================  ========= Separador  */}
            {store.favorites.length > 0 && (
              <>
                <li><hr className="dropdown-divider" /></li>
                <li className="px-2 pb-2">
                  <button
                    className="btn btn-sm btn-outline-secondary w-100"
                    onClick={actions.clearFavorites}
                    title="Clear all favorites"
                  >
                    Clear favorites
                  </button>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}
