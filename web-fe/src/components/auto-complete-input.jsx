"use client";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { useJsApiLoader } from "@react-google-maps/api";
import { useAutocomplete } from "@/hooks/useAutoComplete";
import useMapLoader from "@/hooks/useMapLoader";

const libs = ["places"];

export default function AutoCompleteInput() {
  const { isLoaded } = useMapLoader();

  const { inputRef, selectedPlace } = useAutocomplete(isLoaded);

  return (
    <div className="mx-auto max-w-[900px] space-y-4 p-8">
      <Input ref={inputRef} />
    </div>
  );
}
