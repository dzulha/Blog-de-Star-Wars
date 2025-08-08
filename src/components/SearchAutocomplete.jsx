// ======================= IMPORTACIONES =========
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import useRotatingImageSrc from "../utils/useRotatingImageSrc";

// ======================= comentario =========
// Endpoints por tipo (SWAPI.tech)
const ENDPOINTS = {
  people: "https://www.swapi.tech/api/people",
  planets: "https://www.swapi.tech/api/planets",
  vehicles: "https://www.swapi.tech/api/vehicles",
};

// ======================= comentario =========
// Helper de búsqueda: intenta ?name= y luego ?search= (por compatibilidad)
async function searchResource(baseUrl, q, limit = 5) {
  if (!q) return [];
  try {
    const r1 = await fetch(
      `${baseUrl}?page=1&limit=${limit}&name=${encodeURIComponent(q)}`
    ).then((r) => r.json());
    if (r1?.results?.length) return r1.results;
  } catch {}
  try {
    const r2 = await fetch(
      `${baseUrl}?page=1&limit=${limit}&search=${encodeURIComponent(q)}`
    ).then((r) => r.json());
    if (r2?.results?.length) return r2.results;
  } catch {}
  return [];
}

// ======================= COMPONENTE =========
export default function SearchAutocomplete() {
  const [q, setQ] = useState("");                       // ======================= comentario ========= Valor del input
  const [open, setOpen] = useState(false);              // ======================= comentario ========= Panel visible
  const [loading, setLoading] = useState(false);        // ======================= comentario ========= Estado de búsqueda
  const [results, setResults] = useState([]);           // ======================= comentario ========= [{type, uid, name}]
  const boxRef = useRef(null);
  const debounceRef = useRef(null);
  const nav = useNavigate();

  // ======================= comentario =========
  // Cerrar el panel cuando se hace clic fuera del componente
  useEffect(() => {
    function onClick(e) {
      if (boxRef.current && !boxRef.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  // ======================= comentario =========
  // Debounce de 300ms para no saturar la API mientras el usuario escribe
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (!q.trim()) {
      setResults([]);
      setOpen(false);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        const [pp, pl, vv] = await Promise.all([
          searchResource(ENDPOINTS.people, q, 5),
          searchResource(ENDPOINTS.planets, q, 5),
          searchResource(ENDPOINTS.vehicles, q, 5),
        ]);

        // ======================= comentario =========
        // Normalizamos a un arreglo único y limitamos a 10 sugerencias
        const norm = [
          ...pp.map((x) => ({ type: "people", uid: x.uid, name: x.name })),
          ...pl.map((x) => ({ type: "planets", uid: x.uid, name: x.name })),
          ...vv.map((x) => ({ type: "vehicles", uid: x.uid, name: x.name })),
        ].slice(0, 10);

        setResults(norm);
        setOpen(true);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(debounceRef.current);
  }, [q]);

  // ======================= comentario =========
  // Navega a la vista de detalle, cierra el panel y limpia el input
  const go = (r) => {
    nav(`/details/${r.type}/${r.uid}`);
    setOpen(false);
    setQ("");
  };

  return (
    <div className="position-relative" ref={boxRef} style={{ minWidth: 260 }}>
      <input
        className="form-control"
        placeholder="Search people, planets, vehicles..."
        value={q}
        onChange={(e) => setQ(e.target.value)}
        onFocus={() => q && setOpen(true)}
      />

      {open && (
        <div
          className="position-absolute mt-1 w-100 bg-white border rounded shadow-sm sw-autocomplete"
          style={{ zIndex: 1050 }}
        >
          {loading && <div className="p-2 text-muted">Searching...</div>}

          {!loading && results.length === 0 && (
            <div className="p-2 text-muted">No results</div>
          )}

          {!loading && results.length > 0 && (
            <ul className="list-group list-group-flush">
              {results.map((r) => {
                // ======================= comentario =========
                // Imagen por nombre (people) y placeholder para lo demás.
                const { src, onError } = useRotatingImageSrc(r.type, r.name, r.uid);

                return (
                  <li
                    key={`${r.type}-${r.uid}`}
                    className="list-group-item list-group-item-action d-flex align-items-center gap-2 sw-suggestion"
                    onClick={() => go(r)}
                    style={{ cursor: "pointer" }}
                  >
                    <img
                      src={src}
                      alt={r.name}
                      className="sw-thumb"
                      loading="lazy"
                      decoding="async"
                      onError={onError}
                    />
                    <span className="flex-grow-1">{r.name}</span>
                    <span className="badge bg-secondary text-uppercase">{r.type}</span>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
