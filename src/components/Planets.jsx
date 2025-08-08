// ======================= IMPORTACIONES =========
import React, { useEffect, useState, useContext } from "react";
import { Context } from "../context/AppContext";
import ItemCard from "./ItemCard";

// ======================= comentario =========
// Clave para cache en localStorage
const CACHE_KEY = "sw-cache-planets";

// ======================= comentario =========
// Helper para eliminar duplicados por uid
const dedupByUid = (arr = []) => {
  const map = new Map();
  for (const x of arr) map.set(x.uid, x);
  return Array.from(map.values());
};

// ======================= COMPONENTE =========
const Planets = ({ pageSize = 12 }) => {
  const { actions } = useContext(Context);

  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [skipFetch, setSkipFetch] = useState(false);

  // ======================= comentario =========
  // 1) Leer cache (una sola vez) y limpiar duplicados
  useEffect(() => {
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
      const { items: cachedItems = [], page: cachedPage = 1, done: cachedDone = false } = JSON.parse(cached);
      const clean = dedupByUid(cachedItems);
      setItems(clean);
      setPage(cachedPage);
      setDone(!!cachedDone);
      setSkipFetch(true);
      localStorage.setItem(CACHE_KEY, JSON.stringify({ items: clean, page: cachedPage, done: cachedDone }));
    }
  }, []);

  // ======================= comentario =========
  // 2) Fetch por página + merge sin duplicados + guardar cache
  useEffect(() => {
    if (skipFetch) { setSkipFetch(false); return; }

    const load = async () => {
      setLoading(true);
      try {
        const res = await fetch(`https://www.swapi.tech/api/planets?page=${page}&limit=${pageSize}`);
        const data = await res.json();
        const next = data.results || [];

        setItems(prev => {
          const merged = dedupByUid([...prev, ...next]);
          localStorage.setItem(CACHE_KEY, JSON.stringify({ items: merged, page, done: next.length < pageSize }));
          return merged;
        });

        if (next.length < pageSize) setDone(true);
      } catch (e) {
        console.error("Error fetching planets:", e);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [page, pageSize, skipFetch]);

  return (
    <>
      <div className="row g-4">
        {items.map((p) => (
          <div className="col-12 col-sm-6 col-md-4 col-lg-3" key={`planets-${p.uid}`}>
            <ItemCard
              item={p}
              type="planets"
              onFav={() =>
                actions.toggleFavorite({ id: `planets-${p.uid}`, type: "planets", uid: p.uid, name: p.name })
              }
            />
          </div>
        ))}
      </div>

      <div className="d-flex justify-content-center my-4">
        {!done ? (
          <button className="btn btn-outline-primary" disabled={loading} onClick={() => setPage(n => n + 1)}>
            {loading ? "Loading..." : "Load more"}
          </button>
        ) : (
          <span className="text-muted">No more planets</span>
        )}
      </div>
    </>
  );
};

export default Planets;
