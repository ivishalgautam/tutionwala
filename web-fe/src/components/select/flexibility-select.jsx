import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import ReactSelect from "react-select";

const options = [
  { label: "One To One", value: "oneToOne" },
  { label: "Group", value: "group" },
  // { label: "Nearby", value: "nearby" },
  // { label: "Any", value: "any" },
];

export default function ClassFlexibilitySelect({ searchParams }) {
  const [selectedOption, setSelectedOption] = useState(null);
  const router = useRouter();
  const flexibility = searchParams.get("flexibility");
  const defaultValues = useCallback(() => {
    return (
      options.filter(({ value }) => flexibility?.split(" ").includes(value)) ??
      []
    );
  }, [flexibility]);
  useEffect(() => {
    if (!selectedOption) return;
    const newSearchParams = new URLSearchParams(searchParams.toString());
    const valuesToSet = selectedOption
      .map(({ value }) => value)
      .join(" ")
      .toString();

    if (flexibility) {
      newSearchParams.set("flexibility", valuesToSet);
    } else {
      newSearchParams.append("flexibility", valuesToSet);
    }

    if (!valuesToSet) {
      newSearchParams.delete("flexibility");
    }

    router.push(`?${newSearchParams.toString()}`, { scroll: false });
  }, [selectedOption, router, searchParams, flexibility]);

  return (
    <ReactSelect
      options={options}
      defaultValue={defaultValues}
      placeholder={"Select Class Flexibility"}
      onChange={setSelectedOption}
      menuPortalTarget={document.body}
      isMulti
    />
  );
}
