import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import ReactSelect from "react-select";
import { Rating } from "@smastrom/react-rating";
import "@smastrom/react-rating/style.css";

const ratings = [
  {
    value: "0",
    label: <Rating style={{ maxWidth: 100 }} value={0} readOnly />,
  },
  {
    value: "1",
    label: <Rating style={{ maxWidth: 100 }} value={1} readOnly />,
  },
  {
    value: "2",
    label: <Rating style={{ maxWidth: 100 }} value={2} readOnly />,
  },
  {
    value: "3",
    label: <Rating style={{ maxWidth: 100 }} value={3} readOnly />,
  },
  {
    value: "4",
    label: <Rating style={{ maxWidth: 100 }} value={4} readOnly />,
  },
  {
    value: "5",
    label: <Rating style={{ maxWidth: 100 }} value={5} readOnly />,
  },
];

export default function RatingSelect({ searchParams }) {
  const [selectedOption, setSelectedOption] = useState(null);
  const router = useRouter();

  useEffect(() => {
    if (!selectedOption) return;
    const newSearchParams = new URLSearchParams(searchParams.toString());
    if (searchParams.get("rating")) {
      newSearchParams.set("rating", selectedOption.value);
    } else {
      newSearchParams.append("rating", selectedOption.value);
    }

    if (!selectedOption) {
      newSearchParams.delete("rating");
    }

    router.push(`?${newSearchParams.toString()}`);
  }, [selectedOption, router, searchParams]);

  return (
    <ReactSelect
      className="min-w-96"
      options={ratings}
      placeholder={"Filter by ratings"}
      onChange={setSelectedOption}
    />
  );
}
