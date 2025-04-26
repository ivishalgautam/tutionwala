"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import useMapLoader from "@/hooks/useMapLoader";
import { LocateIcon } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

const showInfoContent = (fullAddr) => {
  return `
      <div className="text-black font-bold">
        ${fullAddr}
      </div>
  `;
};

export default function MapStatic({ coordinates, fullAddr, setFullAddr }) {
  const [map, setMap] = useState(null);
  const mapRef = useRef(null);
  const { isLoaded } = useMapLoader();

  useEffect(() => {
    // initialize map
    const initializeMap = async () => {
      if (isLoaded && coordinates[0] !== 0 && coordinates[1] !== 0) {
        const mapOptions = {
          center: {
            lat: coordinates[0],
            lng: coordinates[1],
          },
          zoom: 17,
          mapId: "my-map",
        };

        const gMap = new google.maps.Map(mapRef.current, mapOptions);
        setMap(gMap);
        const markerPosition = { lat: coordinates[0], lng: coordinates[1] };

        // ✅ Add marker
        const marker = new google.maps.marker.AdvancedMarkerElement({
          map: gMap,
          position: markerPosition,
          gmpDraggable: false,
          title: "Marker",
        });

        // ✅ Add info window
        const infoWindow = new google.maps.InfoWindow({
          content: null,
        });

        marker.addListener("click", () => {
          infoWindow.open(gMap, marker);
        });

        const geocoder = new google.maps.Geocoder();
        geocoder.geocode({ location: markerPosition }, (results, status) => {
          if (status === "OK" && results[0]) {
            const address = results[0].address_components;
            const shortName =
              address[0]?.long_name || results[0].formatted_address;
            setFullAddr(results[0].formatted_address); // ✅ Set place name
          } else {
            setFullAddr("Address not found");
          }
        });

        // infoWindow.open(gMap, marker);
      }
    };

    initializeMap();
  }, [isLoaded, coordinates, fullAddr]);

  return (
    <div>
      <div className="mx-auto w-full space-y-4">
        <div className="h-96 rounded-lg drop-shadow-xl" ref={mapRef}></div>
      </div>
    </div>
  );
}
