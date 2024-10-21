import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import ReactSelect from "react-select";
import { Rating } from "@smastrom/react-rating";
import "@smastrom/react-rating/style.css";

const RatingCard = ({ value }) => {
  return <Rating style={{ maxWidth: 100 }} value={value} readOnly />;
};

const ratings = [
  {
    value: "0",
    label: (
      <div className="flex items-center justify-start gap-2">
        <RatingCard value={0} />
        <span className="font-medium">0.0/5.0</span>
      </div>
    ),
  },
  {
    value: "1",
    label: (
      <div className="flex items-center justify-start gap-2">
        <RatingCard value={1} />
        <span className="font-medium">1.0/5.0</span>
      </div>
    ),
  },
  {
    value: "2",
    label: (
      <div className="flex items-center justify-start gap-2">
        <RatingCard value={2} />
        <span className="font-medium">2.0/5.0</span>
      </div>
    ),
  },
  {
    value: "3",
    label: (
      <div className="flex items-center justify-start gap-2">
        <RatingCard value={3} />
        <span className="font-medium">3.0/5.0</span>
      </div>
    ),
  },
  {
    value: "4",
    label: (
      <div className="flex items-center justify-start gap-2">
        <RatingCard value={4} />
        <span className="font-medium">4.0/5.0</span>
      </div>
    ),
  },
  {
    value: "5",
    label: (
      <div className="flex items-center justify-start gap-2">
        <RatingCard value={5} />
        <span className="font-medium">5.0/5.0</span>
      </div>
    ),
  },
];

export default function RatingSelect({ searchParams }) {
  const [selectedOption, setSelectedOption] = useState(null);
  const router = useRouter();
  const rating = searchParams.get("rating");
  const defaultValues = useCallback(() => {
    return (
      ratings.filter(({ value }) => rating?.split(" ").includes(value)) ?? []
    );
  }, [rating]);

  useEffect(() => {
    if (!selectedOption) return;
    const newSearchParams = new URLSearchParams(searchParams.toString());
    const valuesToSet = Array.isArray(selectedOption)
      ? selectedOption
          .map(({ value }) => value)
          .join(" ")
          .toString()
      : selectedOption.value;
    if (rating) {
      newSearchParams.set("rating", valuesToSet);
    } else {
      newSearchParams.append("rating", valuesToSet);
    }

    if (!valuesToSet) {
      newSearchParams.delete("rating");
    }

    router.push(`?${newSearchParams.toString()}`);
  }, [selectedOption, router, searchParams]);

  return (
    <ReactSelect
      options={ratings}
      defaultValue={defaultValues}
      placeholder={"Filter by ratings"}
      onChange={setSelectedOption}
      isMulti
      menuPortalTarget={document.body}
    />
  );
}
