"use client";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { useJsApiLoader } from "@react-google-maps/api";
import { useAutocomplete } from "@/hooks/useAutoComplete";

const libs = ["places"];

export default function AutoCompleteInput() {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_MAPS_API_KEY,
    libraries: libs,
  });

  const { inputRef, selectedPlace } = useAutocomplete(isLoaded);

  return (
    <div className="mx-auto max-w-[900px] space-y-4 p-8">
      <Input ref={inputRef} />
    </div>
  );
}
