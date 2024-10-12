import { useJsApiLoader } from "@react-google-maps/api";

export default function useMapLoader() {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_MAPS_API_KEY,
    libraries: ["core", "maps", "places", "marker"],
  });

  return { isLoaded };
}
