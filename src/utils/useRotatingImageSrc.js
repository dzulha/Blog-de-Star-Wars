
import { useEffect, useState } from "react";
import { bestImageUrl, placeholder } from "./images";

export default function useRotatingImageSrc(type, name, uid) {
  const [src, setSrc] = useState(placeholder(type, uid));
  const [resolved, setResolved] = useState(false);

  useEffect(() => {
    let abort = false;
    setResolved(false);
    setSrc(placeholder(type, uid));

    (async () => {
      try {
        const url = await bestImageUrl(type, name, uid);
        if (!abort && url) setSrc(url);
      } catch {
      } finally {
        if (!abort) setResolved(true);
      }
    })();

    return () => { abort = true; };
  }, [type, name, uid]);

  const onError = () => {
    const ph = placeholder(type, uid);
    if (src !== ph) setSrc(ph);
  };

  return { src, onError, resolved };
}
