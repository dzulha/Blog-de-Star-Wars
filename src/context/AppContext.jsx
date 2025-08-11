import React, { useEffect, useState } from "react";

export const Context = React.createContext();

const STORAGE_KEY = "sw-favorites";

const injectContext = (PassedComponent) => {
  const StoreWrapper = (props) => {

    const [favorites, setFavorites] = useState(() => {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        return raw ? JSON.parse(raw) : [];
      } catch {
        return [];
      }
    });


    useEffect(() => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
      } catch (e) {
        console.error("No se pudo guardar favoritos:", e);
      }
    }, [favorites]);


    const toggleFavorite = (item) => {
      setFavorites((prev) => {
        const exists = prev.some((f) => f.id === item.id);
        return exists ? prev.filter((f) => f.id !== item.id) : [...prev, item];
      });
    };


    const clearFavorites = () => {
      setFavorites([]);
      try {
        localStorage.removeItem(STORAGE_KEY);

        localStorage.removeItem("sw-cache-people");
        localStorage.removeItem("sw-cache-planets");
        localStorage.removeItem("sw-cache-vehicles");
      } catch (e) {
        console.error("No se pudo limpiar localStorage:", e);
      }
    };


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
