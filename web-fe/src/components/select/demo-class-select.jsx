"use client";

import { useQueryState } from "nuqs";
import ReactSelect from "react-select";
import { Button } from "../ui/button";

const options = [
  { label: "Yes", value: "yes" },
  { label: "No", value: "no" },
  { label: "Any", value: "any" },
];

export default function DemoClassSelect({ styles }) {
  const [demo, setDemo] = useQueryState("demo");

  const selectedOption =
    options.find((option) => option.value === demo) ?? null;

  const handleChange = (option) => {
    if (!option || option.value === "any") {
      setDemo(null);
    } else {
      setDemo(option.value);
    }
  };

  const handleReset = () => {
    setDemo(null);
  };

  return (
    <div className="flex items-center gap-2">
      <div className="flex-grow">
        <ReactSelect
          options={options}
          value={selectedOption}
          placeholder="Select demo class"
          onChange={handleChange}
          menuPortalTarget={
            typeof window !== "undefined" ? document.body : null
          }
          styles={styles}
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
