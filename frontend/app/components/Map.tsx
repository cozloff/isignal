"use client";

import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";

mapboxgl.accessToken =
  "pk.eyJ1IjoiY296bG9mZiIsImEiOiJjbTgwenIzaTkwZTM5MmpvbTdmczQ4aWtnIn0.ohVgWY7Cuk8DbZ2vxUWIgQ";

export default function Map() {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/satellite-streets-v12",
      projection: "globe",
      center: [0, 0],
      zoom: 1.5,
    });

    map.on("style.load", () => {
      map.setFog({});
    });

    return () => map.remove();
  }, []);

  return <div ref={mapContainerRef} className="w-full h-full rounded-lg" />;
}
