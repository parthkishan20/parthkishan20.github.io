import { useEffect, useState } from "react";

export function useImagePreload(imageSrc: string) {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const img = new Image();
    img.src = imageSrc;
    img.onload = () => setLoaded(true);
  }, [imageSrc]);

  return loaded;
}
