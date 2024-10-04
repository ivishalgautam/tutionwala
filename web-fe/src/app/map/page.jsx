"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useJsApiLoader } from "@react-google-maps/api";
import { LocateIcon } from "lucide-react";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

const libs = ["core", "maps", "places", "marker"];

const showInfoContent = (fullAddr, name) => {
  return `
    <div>
      <div class="text-black font-bold">
        ${name}
      </div>
    </div>
  `;
};

const currentLatLng = async () => {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        let lat = position.coords.latitude;
        let lng = position.coords.longitude;
        resolve([lat, lng]);
      },
      (error) => {
        reject(error);
        toast.warning("Allow location permission!");
      },
    );
  });
};

export default function AutoComplete() {
  const [map, setMap] = useState(null);
  const [autoComplete, setAutoComplete] = useState(null);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [coordinates, setCoordinates] = useState([0, 0]);
  const markersRef = useRef([]);
  const mapRef = useRef(null);
  const geocoderRef = useRef(null);
  const placeAutoCompleteRef = useRef(null);

  const clearMarkers = useCallback(() => {
    markersRef.current.forEach((marker) => {
      marker.setMap(null);
    });
    markersRef.current = [];
  }, []);

  const getCurrentLatLng = async () => {
    try {
      const coords = await currentLatLng();
      setCoordinates(coords);
    } catch (error) {
      console.error("Error getting location:", error);
    }
  };

  const setMarker = useCallback(
    (location, name, full_addr) => {
      if (!map) return;

      clearMarkers();

      map.setCenter(location);
      const marker = new google.maps.Marker({
        map: map,
        position: location,
        draggable: true,
        title: "Marker",
      });

      let infoCard = new google.maps.InfoWindow({
        position: location,
        content: showInfoContent(full_addr, name),
      });

      infoCard.open({
        map: map,
        anchor: marker,
      });

      markersRef.current.push(marker);
      google.maps.event.addListener(marker, "dragend", () => {
        const newPosition = marker.getPosition();

        // Update the info window with the new position
        if (newPosition && geocoderRef.current) {
          geocoderRef.current.geocode(
            { location: newPosition.toJSON() },
            (results, status) => {
              if (status === "OK" && results[0]) {
                const newAddress = results[0].formatted_address;

                // Close previous InfoWindow
                infoCard.close();

                // Update the info window content and re-open it at the new location
                infoCard = new google.maps.InfoWindow({
                  content: showInfoContent(newAddress, newAddress),
                  maxWidth: 200,
                });
                infoCard.open({
                  map: map,
                  anchor: marker,
                });

                // Optionally update the input field with the new address
                placeAutoCompleteRef.current.value = newAddress;
                setSelectedPlace(newAddress);
              } else {
                console.error("Geocoder failed due to: " + status);
              }
            },
          );
        }
      });
    },
    [map, clearMarkers],
  );

  const geocodeLatLng = useCallback(
    (location) => {
      if (!geocoderRef.current) {
        geocoderRef.current = new google.maps.Geocoder();
      }

      geocoderRef.current.geocode({ location }, (results, status) => {
        if (status === "OK" && results[0]) {
          const fullAddr = results[0].formatted_address;
          setMarker(location, fullAddr, fullAddr); // Use address as both name and full address
        } else {
          console.error("Geocoder failed due to: " + status);
        }
      });
    },
    [setMarker],
  );

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_MAPS_API_KEY,
    libraries: libs,
  });

  useEffect(() => {
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

        const indiaBounds = new google.maps.LatLngBounds(
          new google.maps.LatLng(6.5546079, 68.1113787), // Southwest
          new google.maps.LatLng(35.6745457, 97.395561), // Northeast
        );

        const gAutoComplete = new google.maps.places.Autocomplete(
          placeAutoCompleteRef.current,
          {
            bounds: indiaBounds,
            fields: ["formatted_address", "geometry", "name"],
            componentRestrictions: { country: ["in"] },
          },
        );
        setAutoComplete(gAutoComplete);
      }
    };

    initializeMap();
  }, [isLoaded, coordinates]);

  useEffect(() => {
    if (autoComplete) {
      autoComplete.addListener("place_changed", () => {
        const place = autoComplete.getPlace();
        if (place.formatted_address) {
          placeAutoCompleteRef.current.value = place.formatted_address; // Fill the input with the selected address
          setSelectedPlace(place.formatted_address);
        }
        const position = place.geometry?.location;
        if (position) {
          setMarker(position, place.name, place.formatted_address);
        }
      });
    }
  }, [autoComplete, setMarker]);

  // Add map click listener once the map is set
  useEffect(() => {
    if (map) {
      map.addListener("click", (event) => {
        if (event.latLng) {
          if (!geocoderRef.current) {
            geocoderRef.current = new google.maps.Geocoder();
          }

          geocoderRef.current.geocode(
            { location: event.latLng },
            (results, status) => {
              if (status === "OK" && results[0]) {
                const fullAddr = results[0].formatted_address;
                if (fullAddr) {
                  placeAutoCompleteRef.current.value = fullAddr; // Fill the input with the selected address
                  setSelectedPlace(fullAddr);
                }
                setMarker(event.latLng, fullAddr, fullAddr); // Use address as both name and full address
              } else {
                console.error("Geocoder failed due to: " + status);
              }
            },
          );
        }
      });
    }
  }, [map, setMarker]);

  useEffect(() => {
    getCurrentLatLng();
  }, []);

  return (
    <div>
      <div className="mx-auto max-w-[900px] space-y-4 p-8">
        <Input ref={placeAutoCompleteRef} />
        <div className="h-96 rounded-lg" ref={mapRef}></div>
        <Button type="button" onClick={getCurrentLatLng}>
          <LocateIcon />
        </Button>
      </div>
    </div>
  );
}
