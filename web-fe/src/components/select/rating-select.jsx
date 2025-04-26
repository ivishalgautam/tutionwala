"use client";

import { useQueryState } from "nuqs";
import { useEffect, useMemo } from "react";
import ReactSelect from "react-select";
import { Rating } from "@smastrom/react-rating";
import "@smastrom/react-rating/style.css";
import { Button } from "../ui/button";

const RatingCard = ({ value }) => (
  <Rating style={{ maxWidth: 100 }} value={value} readOnly />
);

const ratings = [0, 1, 2, 3, 4, 5].map((num) => ({
  value: String(num),
  label: (
    <div className="flex items-center justify-start gap-2">
      <RatingCard value={num} />
      <span className="font-medium">{num}.0/5.0</span>
    </div>
  ),
}));

export default function RatingSelect({ styles, classNames }) {
  const [ratingParam, setRatingParam] = useQueryState("rating");

  const selectedOptions = useMemo(() => {
    if (!ratingParam) return [];
    const values = ratingParam.split(" ");
    return ratings.filter(({ value }) => values.includes(value));
  }, [ratingParam]);

  const handleChange = (selected) => {
    if (!selected || selected.length === 0) {
      setRatingParam(null); // Using null instead of empty string to remove param
    } else {
      const valueStr = selected.map(({ value }) => value).join(" ");
      setRatingParam(valueStr);
    }
  };

  // Handle reset button click
  const handleReset = () => {
    setRatingParam(null);
  };

  return (
    <div className="flex items-center gap-2">
      <div className="flex-grow">
        <ReactSelect
          options={ratings}
          value={selectedOptions}
          placeholder={"Filter by ratings"}
          onChange={handleChange}
          isMulti
          menuPortalTarget={document.body}
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
