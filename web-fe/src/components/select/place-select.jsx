import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import ReactSelect from "react-select";

const options = [
  { label: "Tutor place", value: "tutorPlace" },
  { label: "Student place", value: "studentPlace" },
  { label: "Other", value: "other" },
];

export default function ClassPlaceSelect({ searchParams }) {
  const [selectedOption, setSelectedOption] = useState(null);
  const router = useRouter();

  const place = searchParams.get("place");
  const defaultValues = useCallback(() => {
    return (
      options.filter(({ value }) => place?.split(" ").includes(value)) ?? []
    );
  }, [place]);

  useEffect(() => {
    if (!selectedOption) return;
    const newSearchParams = new URLSearchParams(searchParams.toString());

    const valuesToSet = selectedOption
      .map(({ value }) => value)
      .join(" ")
      .toString();

    if (place) {
      newSearchParams.set("place", valuesToSet);
    } else {
      newSearchParams.append("place", valuesToSet);
    }

    if (!valuesToSet) {
      newSearchParams.delete("place");
    }

    router.push(`?${newSearchParams.toString()}`, { scroll: false });
  }, [selectedOption, router, searchParams, place]);

  return (
    <ReactSelect
      options={options}
      defaultValue={defaultValues}
      placeholder={"Select Class place"}
      onChange={setSelectedOption}
      menuPortalTarget={document.body}
      isMulti
    />
  );
}
