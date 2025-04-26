"use client";

import { useQueryState } from "nuqs";
import { languages } from "@/data/languages";
import ReactSelect from "react-select";
import { Button } from "../ui/button";

export default function LanguageSelect({ styles }) {
  const [language, setLanguage] = useQueryState("language");

  const selectedOptions =
    language
      ?.split(" ")
      .map((value) => languages.find((lang) => lang.value === value))
      .filter(Boolean) ?? [];

  const handleChange = (selected) => {
    if (!selected || selected.length === 0) {
      setLanguage(null);
    } else {
      const valueString = selected.map((opt) => opt.value).join(" ");
      setLanguage(valueString);
    }
  };

  // Handle reset button click
  const handleReset = () => {
    setLanguage(null);
  };

  return (
    <div className="flex items-center gap-2">
      <div className="flex-grow">
        <ReactSelect
          options={languages}
          isMulti
          value={selectedOptions}
          placeholder="Select Preferred Languages"
          onChange={handleChange}
          menuPortalTarget={
            typeof window !== "undefined" ? document.body : null
          }
          styles={styles}
        />
      </div>
      {selectedOptions.length > 0 && (
        <Button
          onClick={handleReset}
          type="button"
          aria-label="Reset mode selection"
        >
          Reset
        </Button>
      )}
    </div>
  );
}
