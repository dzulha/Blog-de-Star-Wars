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
    const wiki = await getWikiThumbByName(name, type);
    return wiki || placeholder(type, uid);
  }

  return placeholder(type, uid);
}
