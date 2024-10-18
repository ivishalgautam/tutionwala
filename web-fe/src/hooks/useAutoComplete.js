import { useEffect, useRef, useState } from "react";

export function useAutocomplete(
  isLoaded,
  componentRestrictions = { country: ["in"] },
) {
  const [autoComplete, setAutoComplete] = useState(null);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isLoaded) {
      const indiaBounds = new google.maps.LatLngBounds(
        new google.maps.LatLng(6.5546079, 68.1113787), // Southwest
        new google.maps.LatLng(35.6745457, 97.395561), // Northeast
      );

      const gAutoComplete = new google.maps.places.Autocomplete(
        inputRef.current,
        {
          bounds: indiaBounds,
          fields: ["formatted_address", "geometry", "name"],
          componentRestrictions: { country: ["in"] },
        },
      );
      setAutoComplete(gAutoComplete);
    }
  }, [isLoaded]);

  useEffect(() => {
    if (autoComplete) {
      autoComplete.addListener("place_changed", () => {
        const place = autoComplete.getPlace();
        setSelectedPlace({
          address: place.formatted_address,
          location: place.geometry?.location,
          name: place.name,
        });
      });
    }
  }, [autoComplete]);

  return { inputRef, selectedPlace };
}
