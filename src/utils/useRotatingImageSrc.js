// ======================= comentario =========
// Hook que resuelve la mejor URL de imagen y maneja fallback.
// Recibe (type, name, uid). Usa Akabab por nombre para people.
import { useEffect, useState } from "react";
import { bestImageUrl, placeholder } from "./images";

export default function useRotatingImageSrc(type, name, uid) {
  const [src, setSrc] = useState(placeholder(type, uid)); // placeholder inicial
  const [resolved, setResolved] = useState(false);

  useEffect(() => {
    let abort = false;
    setResolved(false);
    // coloca placeholder rápido para evitar parpadeo
    setSrc(placeholder(type, uid));

    (async () => {
      try {
        const url = await bestImageUrl(type, name, uid);
        if (!abort && url) setSrc(url);
      } catch {
        // nos quedamos con placeholder
      } finally {
        if (!abort) setResolved(true);
      }
    })();

    return () => { abort = true; };
  }, [type, name, uid]);

  // ======================= comentario =========
  // onError: si la URL final falla en runtime, nos quedamos con placeholder
  const onError = () => {
    const ph = placeholder(type, uid);
    if (src !== ph) setSrc(ph);
  };

  return { src, onError, resolved };
}
