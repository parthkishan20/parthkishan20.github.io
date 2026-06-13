import { useEffect, useState } from "react";

export function useImagePreload(imageSrc: string) {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoaded(false);
    const img = new Image();
    img.src = imageSrc;
    img.onload = () => setLoaded(true);
    img.onerror = () => setLoaded(true);
  }, [imageSrc]);

  return loaded;
}
