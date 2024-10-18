import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import ReactSelect from "react-select";

const options = [
  { label: "Online", value: "online" },
  { label: "Offliine", value: "offliine" },
  { label: "Nearby", value: "nearby" },
  { label: "Any", value: "any" },
];

export default function ClassConductSelect({ searchParams }) {
  const [selectedOption, setSelectedOption] = useState(null);
  const router = useRouter();
  const gender = searchParams.get("mode");

  useEffect(() => {
    if (!selectedOption) return;
    const newSearchParams = new URLSearchParams(searchParams.toString());
    if (searchParams.get("mode")) {
      newSearchParams.set("mode", selectedOption.value);
    } else {
      newSearchParams.append("mode", selectedOption.value);
    }

    if (!selectedOption || selectedOption?.value === "any") {
      newSearchParams.delete("mode");
    }

    router.push(`?${newSearchParams.toString()}`);
  }, [selectedOption, router, searchParams]);

  return (
    <ReactSelect
      options={options}
      defaultValue={options.find((so) => so.value === gender)}
      placeholder={"Select Class Conduct"}
      onChange={setSelectedOption}
      menuPortalTarget={document.body}
    />
  );
}
