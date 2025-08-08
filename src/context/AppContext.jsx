// ======================= comentario =========
// Contexto global de la aplicación: aquí guardamos y manejamos los favoritos.
// Este contexto es inyectado a toda la app con injectContext(App).

import React, { useEffect, useState } from "react";

// ======================= comentario =========
// Creamos el objeto Context para exportarlo y usarlo en otros componentes
export const Context = React.createContext();

// ======================= comentario =========
// Clave de almacenamiento en localStorage para favoritos
const STORAGE_KEY = "sw-favorites";

const injectContext = (PassedComponent) => {
  const StoreWrapper = (props) => {
    // ======================= comentario =========
    // Estado inicial: intentamos leer favoritos desde localStorage
    const [favorites, setFavorites] = useState(() => {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        return raw ? JSON.parse(raw) : [];
      } catch {
        return [];
      }
    });

    // ======================= comentario =========
    // Cada vez que cambian los favoritos, se guardan en localStorage
    useEffect(() => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
      } catch (e) {
        console.error("No se pudo guardar favoritos:", e);
      }
    }, [favorites]);

    // ======================= comentario =========
    // Alterna un favorito: si existe lo quita, si no lo agrega
    const toggleFavorite = (item) => {
      setFavorites((prev) => {
        const exists = prev.some((f) => f.id === item.id);
        return exists ? prev.filter((f) => f.id !== item.id) : [...prev, item];
      });
    };

    // ======================= comentario =========
    // Limpia todos los favoritos y opcionalmente caches de listas
    const clearFavorites = () => {
      setFavorites([]);
      try {
        // Borra la clave de favoritos
        localStorage.removeItem(STORAGE_KEY);

        // Opcional: borra caches de listados para forzar fetch en la próxima visita
        localStorage.removeItem("sw-cache-people");
        localStorage.removeItem("sw-cache-planets");
        localStorage.removeItem("sw-cache-vehicles");
      } catch (e) {
        console.error("No se pudo limpiar localStorage:", e);
      }
    };

    // ======================= comentario =========
    // Retornamos el Context.Provider con store y acciones disponibles
    return (
      <Context.Provider
        value={{
          store: { favorites },
          actions: { toggleFavorite, clearFavorites },
        }}
      >
        <PassedComponent {...props} />
      </Context.Provider>
    );
  };

  return StoreWrapper;
};

export default injectContext;
