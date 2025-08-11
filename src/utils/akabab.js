const AKABAB_URL = "https://raw.githubusercontent.com/akabab/starwars-api/0.2.1/api/all.json";
const CACHE_KEY = "akabab-all";
const TTL_MS = 1000 * 60 * 60 * 24 * 30;


function norm(s) {
  return String(s || "").trim().toLowerCase();
}

let cachePromise = null;
export function loadAkababIndex() {
  if (cachePromise) return cachePromise;

  cachePromise = new Promise(async (resolve) => {
    try {
      const raw = localStorage.getItem(CACHE_KEY);
      if (raw) {
        const { at, data } = JSON.parse(raw);
        if (Date.now() - (at || 0) < TTL_MS && Array.isArray(data)) {
          const dict = buildDict(data);
          return resolve(dict);
        }
      }
      const res = await fetch(AKABAB_URL);
      const json = await res.json();
      localStorage.setItem(CACHE_KEY, JSON.stringify({ at: Date.now(), data: json }));
      const dict = buildDict(json);
      resolve(dict);
    } catch {
      resolve(new Map());
    }
  });

  return cachePromise;
}


function buildDict(list) {
  const dict = new Map();
  for (const item of list) {
    if (item?.name && item?.image) {
      dict.set(norm(item.name), item.image);
    }
  }
  return dict;
}

export async function getAkababImageByName(name) {
  const dict = await loadAkababIndex();
  return dict.get(norm(name)) || null;
}
