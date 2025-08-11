
const CACHE_KEY = "wiki-extracts-v2";
const TTL_MS = 1000 * 60 * 60 * 24 * 30;

const normKey = (t, n) => `${t}:${String(n || "").trim().toLowerCase()}`;

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

async function tryRestSummary(title) {
  const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}?redirect=true`;
  const res = await fetch(url);
  if (!res.ok) return null;
  const j = await res.json();
  if (!j?.extract) return null;
  return j.extract;
}

async function tryLegacyExtract(title) {
  const url =
    `https://en.wikipedia.org/w/api.php?action=query` +
    `&prop=extracts&exintro=1&explaintext=1&redirects=1` +
    `&titles=${encodeURIComponent(title)}&format=json&origin=*`;
  const res = await fetch(url);
  if (!res.ok) return null;
  const j = await res.json();
  const pages = j?.query?.pages || {};
  const first = Object.values(pages)[0];
  return first?.extract || null;
}


export async function getWikiExtractByName(name, type) {
  if (!name) return null;

  const key = normKey(type, name);
  const cache = readCache();
  if (key in cache.data) return cache.data[key];

  let extract = null;
  try {
    extract = await tryRestSummary(`${name} (Star Wars)`);
    if (!extract) extract = await tryRestSummary(name);
    if (!extract) extract = await tryLegacyExtract(`${name} (Star Wars)`);
    if (!extract) extract = await tryLegacyExtract(name);
  } catch {
  }

  cache.data[key] = extract || null;
  cache.at = Date.now();
  writeCache(cache);

  return extract;
}
