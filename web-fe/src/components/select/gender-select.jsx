"use client";

import { useQueryState } from "nuqs";
import ReactSelect from "react-select";
import { Button } from "../ui/button";

const options = [
  { label: "Male", value: "male" },
  { label: "Female", value: "female" },
  { label: "Any", value: "any" },
];

export default function GenderSelect() {
  const [gender, setGender] = useQueryState("gender");
  const selectedOption = options.find((opt) => opt.value === gender) ?? null;

  const handleChange = (option) => {
    if (!option || option.value === "any") {
      setGender(null);
    } else {
      setGender(option.value);
    }
  };

  const handleReset = () => {
    setGender(null);
  };

  return (
    <div className="flex items-center gap-2">
      <div className="flex-grow">
        <ReactSelect
          options={options}
          value={selectedOption}
          placeholder="Select gender"
          onChange={handleChange}
          menuPortalTarget={
            typeof window !== "undefined" ? document.body : null
          }
          className="rounded border"
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
