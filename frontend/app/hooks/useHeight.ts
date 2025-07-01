import { useEffect, useState } from "react";

export function useHeight(threshold = 500) {
  const thresholds = [500, 600, 700, 800, 900, 1000, 1100];
  const initialFlags = Object.fromEntries(
    thresholds.map((t) => [`h${t}`, false])
  );

  const [flags, setFlags] = useState(initialFlags);

  useEffect(() => {
    const handleResize = () => {
      const updated = Object.fromEntries(
        thresholds.map((t) => [`h${t}`, window.innerHeight <= t])
      );
      setFlags(updated);
    };

    requestAnimationFrame(() => {
      handleResize();
    });

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return flags as Record<
    `h${500 | 600 | 700 | 800 | 900 | 1000 | 1100}`,
    boolean
  >;
}
