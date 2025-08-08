// ======================= comentario =========
// Centraliza la selección de imágenes por tipo.
// - people: Akabab por NOMBRE
// - planets/vehicles: Wikipedia por NOMBRE con ranking
// Si no hay, cae a placeholder.

import { getAkababImageByName } from "./akabab";
import { getWikiThumbByName } from "./Wiki";

export const IMG_FOLDER = { people: "characters", planets: "planets", vehicles: "vehicles" };

export const placeholder = (type, uid, w = 600, h = 400) =>
  `https://picsum.photos/seed/${type}-${uid}/${w}/${h}`;

export async function bestImageUrl(type, name, uid) {
  if (type === "people") {
    const ak = await getAkababImageByName(name);
    return ak || placeholder(type, uid);
  }

  if (type === "planets" || type === "vehicles") {
    const wiki = await getWikiThumbByName(name, type);   // <<< PASAMOS type
    return wiki || placeholder(type, uid);
  }

  return placeholder(type, uid);
}
