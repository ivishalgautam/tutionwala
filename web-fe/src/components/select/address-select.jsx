"use client";

import { useQueryState } from "nuqs";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input"; // Adjust if you're using a different Input component
import { useAutocomplete } from "@/hooks/useAutocomplete"; // Adjust to your hook path
import { useMapLoader } from "@/hooks/useMapLoader"; // Adjust to your hook path

export const FilterAddress = () => {
  const { isLoaded } = useMapLoader();
  const { inputRef, selectedPlace } = useAutocomplete(isLoaded);

  // nuqs query state for addr, lat, lng
  const [addr, setAddr] = useQueryState("addr", {
    history: "push",
    scroll: false,
  });
  const [lat, setLat] = useQueryState("lat", {
    history: "push",
    scroll: false,
  });
  const [lng, setLng] = useQueryState("lng", {
    history: "push",
    scroll: false,
  });

  // Populate input field from addr query param
  useEffect(() => {
    if (!inputRef.current) return;
    inputRef.current.value = addr ?? "";
  }, [addr, inputRef]);

  // Update query params on place select
  useEffect(() => {
    if (!selectedPlace) return;

    const addressToSet = selectedPlace.address;
    const latValue = selectedPlace?.location?.lat();
    const lngValue = selectedPlace?.location?.lng();

    if (addressToSet) {
      setAddr(addressToSet);
      setLat(String(latValue));
      setLng(String(lngValue));
    } else {
      setAddr(null);
      setLat(null);
      setLng(null);
    }
  }, [selectedPlace, setAddr, setLat, setLng]);

  return <Input ref={inputRef} placeholder="Filter by location" />;
};
