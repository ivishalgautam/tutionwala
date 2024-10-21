import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import ReactSelect from "react-select";

const options = [
  { label: "Male", value: "male" },
  { label: "Female", value: "female" },
  { label: "Any", value: "any" },
];

export default function GenderSelect({ searchParams }) {
  const [selectedOption, setSelectedOption] = useState(null);
  const router = useRouter();
  const gender = searchParams.get("gender");

  useEffect(() => {
    if (!selectedOption) return;
    const newSearchParams = new URLSearchParams(searchParams.toString());
    if (searchParams.get("gender")) {
      newSearchParams.set("gender", selectedOption.value);
    } else {
      newSearchParams.append("gender", selectedOption.value);
    }

    if (!selectedOption || selectedOption?.value === "any") {
      newSearchParams.delete("gender");
    }

    router.push(`?${newSearchParams.toString()}`);
  }, [selectedOption, router, searchParams]);

  return (
    <ReactSelect
      options={options}
      defaultValue={options.find((so) => so.value === gender)}
      placeholder={"Select gender"}
      onChange={setSelectedOption}
      menuPortalTarget={document.body}
    />
  );
}
