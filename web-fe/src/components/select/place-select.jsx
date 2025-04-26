"use client";

import { useQueryState } from "nuqs";
import ReactSelect from "react-select";
import { Button } from "../ui/button";

const options = [
  { label: "Tutor place", value: "tutorPlace" },
  { label: "Student place", value: "studentPlace" },
  { label: "Other", value: "other" },
];

export default function ClassPlaceSelect({ styles }) {
  const [place, setPlace] = useQueryState("place");

  const selectedOptions =
    place
      ?.split(" ")
      .map((value) => options.find((opt) => opt.value === value))
      .filter(Boolean) ?? [];

  const handleChange = (selected) => {
    if (!selected || selected.length === 0) {
      setPlace(null); // Remove from URL
    } else {
      const joined = selected.map((opt) => opt.value).join(" ");
      setPlace(joined); // Update URL
    }
  };

  // Handle reset button click
  const handleReset = () => {
    setPlace(null);
  };

  return (
    <div className="flex items-center gap-2">
      <div className="flex-grow">
        <ReactSelect
          options={options}
          value={selectedOptions}
          placeholder="Select Class place"
          onChange={handleChange}
          isMulti
          menuPortalTarget={
            typeof window !== "undefined" ? document.body : null
          }
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
