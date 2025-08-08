// ======================= comentario =========
// Carga el índice de personajes de Akabab y crea un diccionario por nombre.
// Cachea en localStorage con TTL para evitar pedirlo siempre.

const AKABAB_URL = "https://raw.githubusercontent.com/akabab/starwars-api/0.2.1/api/all.json";
const CACHE_KEY = "akabab-all";
const TTL_MS = 1000 * 60 * 60 * 24 * 30; // 30 días

// ======================= comentario =========
// Normaliza nombres (minúsculas, sin espacios extras)
function norm(s) {
  return String(s || "").trim().toLowerCase();
}

// ======================= comentario =========
// Devuelve {getImageByName} una vez lista la data; se auto-inicializa y cachea
let cachePromise = null;
export function loadAkababIndex() {
  if (cachePromise) return cachePromise;

  cachePromise = new Promise(async (resolve) => {
    try {
      // 1) intenta cache
      const raw = localStorage.getItem(CACHE_KEY);
      if (raw) {
        const { at, data } = JSON.parse(raw);
        if (Date.now() - (at || 0) < TTL_MS && Array.isArray(data)) {
          const dict = buildDict(data);
          return resolve(dict);
        }
      }
      // 2) fetch remoto
      const res = await fetch(AKABAB_URL);
      const json = await res.json();
      localStorage.setItem(CACHE_KEY, JSON.stringify({ at: Date.now(), data: json }));
      const dict = buildDict(json);
      resolve(dict);
    } catch {
      // en fallo, resuelve un map vacío (seguiremos con placeholders)
      resolve(new Map());
    }
  });

  return cachePromise;
}

// ======================= comentario =========
// Construye Map name->image de la data de Akabab
function buildDict(list) {
  const dict = new Map();
  for (const item of list) {
    // item.name (ej. "Luke Skywalker"), item.image (url https a su retrato)
    if (item?.name && item?.image) {
      dict.set(norm(item.name), item.image);
    }
  }
  return dict;
}

// ======================= comentario =========
// Helper asíncrono: devuelve URL de imagen por nombre si existe
export async function getAkababImageByName(name) {
  const dict = await loadAkababIndex();
  return dict.get(norm(name)) || null;
}
