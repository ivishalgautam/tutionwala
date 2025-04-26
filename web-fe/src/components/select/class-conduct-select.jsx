"use client";

import { useQueryState } from "nuqs";
import { useMemo } from "react";
import ReactSelect from "react-select";
import { Button } from "../ui/button";

const options = [
  { label: "Online", value: "online" },
  { label: "Offline", value: "offline" },
];

export default function ClassConductSelect({ styles, classNames }) {
  const [mode, setMode] = useQueryState("mode");

  const selectedOption = useMemo(() => {
    return options.find((option) => option.value === mode) || null;
  }, [mode]);

  const handleChange = (option) => {
    if (!option || option.value === "any") {
      setMode(null); // Removes `mode` from the URL
    } else {
      setMode(option.value); // Sets `mode` in the URL
    }
  };

  const handleReset = () => {
    setMode(null);
  };

  return (
    <div className="flex items-center gap-2">
      <div className="flex-grow">
        <ReactSelect
          options={options}
          value={selectedOption}
          placeholder="Select Mode"
          onChange={handleChange}
          menuPortalTarget={document.body}
          styles={styles}
          classNames={classNames}
        />
      </div>
      {selectedOption && (
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
