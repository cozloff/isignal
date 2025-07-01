import { useEffect, useState } from "react";

export function useVertical() {
  const [isVertical, setIsVertical] = useState(() =>
    typeof window !== "undefined"
      ? window.innerHeight > window.innerWidth
      : false
  );

  useEffect(() => {
    const handleResize = () => {
      setIsVertical(window.innerHeight > window.innerWidth);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return { isVertical };
}
