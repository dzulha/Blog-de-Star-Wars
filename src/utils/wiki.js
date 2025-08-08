// ======================= comentario =========
// Busca una miniatura en Wikipedia/Wikimedia por nombre,
// sesgada a Star Wars y al tipo (planets/vehicles). Cachea 30 días.

const CACHE_KEY = "wiki-thumbs-v2";
const TTL_MS = 1000 * 60 * 60 * 24 * 30; // 30 días

const norm = (s) => String(s || "").trim().toLowerCase();

function readCache() {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return { at: Date.now(), data: {} };
    const obj = JSON.parse(raw);
    if (Date.now() - (obj.at || 0) > TTL_MS) return { at: Date.now(), data: {} };
    return obj;
  } catch {
    return { at: Date.now(), data: {} };
  }
}
function writeCache(obj) {
  try { localStorage.setItem(CACHE_KEY, JSON.stringify(obj)); } catch {}
}

/**
 * Devuelve URL de miniatura o null.
 * @param {string} name - Ej: "Tatooine", "AT-AT"
 * @param {"planets"|"vehicles"} type
 */
export async function getWikiThumbByName(name, type) {
  if (!name) return null;
  const key = `${type}:${norm(name)}`;

  // 1) Cache
  const cache = readCache();
  if (key in cache.data) return cache.data[key];

  // 2) Consultamos 5 resultados y elegimos el mejor
  const qName = encodeURIComponent(name);
  const search = `(${qName} (Star Wars)) OR (${qName} Star Wars) OR (${qName})`;
  const url =
    `https://en.wikipedia.org/w/api.php?action=query` +
    `&generator=search&gsrsearch=${search}&gsrlimit=5` +
    `&prop=pageimages|pageterms&piprop=thumbnail&pithumbsize=640&wbptterms=description` +
    `&format=json&origin=*`;

  try {
    const res = await fetch(url);
    const json = await res.json();
    const pages = Object.values(json?.query?.pages || {});
    if (!pages.length) {
      cache.data[key] = null; cache.at = Date.now(); writeCache(cache);
      return null;
    }

    const nName = norm(name);
    const wantWord = type === "planets" ? "planet" : "vehicle";

    const scorePage = (p) => {
      const title = String(p.title || "");
      const nTitle = norm(title);
      const hasThumb = !!p?.thumbnail?.source;
      const terms = (p?.terms?.description || []).map(norm).join(" ");
      let score = 0;

      if (/\(star wars\)/i.test(title)) score += 100;
      if (new RegExp(`\\b${nName}\\b`, "i").test(title)) score += 60;

      if (new RegExp(`\\b${wantWord}\\b`, "i").test(title)) score += 30;
      if (terms.includes("star wars")) score += 25;
      if (terms.includes(wantWord)) score += 15;

      if (hasThumb) score += 20;
      if (/\(disambiguation\)/i.test(title)) score -= 80;

      return { score, page: p };
    };

    const best = pages.map(scorePage).sort((a, b) => b.score - a.score)[0];
    const thumb = best?.page?.thumbnail?.source || null;

    cache.data[key] = thumb;
    cache.at = Date.now();
    writeCache(cache);

    return thumb;
  } catch {
    cache.data[key] = null;
    cache.at = Date.now();
    writeCache(cache);
    return null;
  }
}
