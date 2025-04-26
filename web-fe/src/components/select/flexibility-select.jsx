"use client";

import { useQueryState } from "nuqs";
import ReactSelect from "react-select";
import { Button } from "../ui/button";

const options = [
  { label: "One To One", value: "oneToOne" },
  { label: "Group", value: "group" },
  // Add others back if needed
  // { label: "Nearby", value: "nearby" },
  // { label: "Any", value: "any" },
];

export default function ClassFlexibilitySelect({ styles, classNames }) {
  const [flexibility, setFlexibility] = useQueryState("flexibility");

  const selectedOptions =
    flexibility
      ?.split(" ")
      .map((value) => options.find((opt) => opt.value === value))
      .filter(Boolean) ?? [];

  const handleChange = (selected) => {
    if (!selected || selected.length === 0) {
      setFlexibility(null);
    } else {
      const values = selected.map((opt) => opt.value).join(" ");
      setFlexibility(values);
    }
  };

  const handleReset = () => {
    setFlexibility(null);
  };

  return (
    <div className="flex items-center gap-2">
      <div className="flex-grow">
        <ReactSelect
          options={options}
          value={selectedOptions}
          placeholder="Select Class Flexibility"
          onChange={handleChange}
          menuPortalTarget={
            typeof window !== "undefined" ? document.body : null
          }
          isMulti
          styles={styles}
          classNames={classNames}
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
