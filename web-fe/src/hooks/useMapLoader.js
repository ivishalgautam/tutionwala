import { useJsApiLoader } from "@react-google-maps/api";
import { useState } from "react";

export default function useMapLoader() {
  const [libraries] = useState(["core", "maps", "places", "marker"]);
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_MAPS_API_KEY,
    libraries,
  });

  return { isLoaded };
}
