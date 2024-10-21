import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import ReactSelect from "react-select";

const options = [
  { label: "Yes", value: "yes" },
  { label: "No", value: "no" },
  { label: "Any", value: "any" },
];

export default function DemoClassSelect({ searchParams }) {
  const [selectedOption, setSelectedOption] = useState(null);
  const router = useRouter();
  const demo = searchParams.get("demo");

  useEffect(() => {
    if (!selectedOption) return;
    const newSearchParams = new URLSearchParams(searchParams.toString());
    if (searchParams.get("demo")) {
      newSearchParams.set("demo", selectedOption.value);
    } else {
      newSearchParams.append("demo", selectedOption.value);
    }

    if (!selectedOption || selectedOption?.value === "any") {
      newSearchParams.delete("demo");
    }

    router.push(`?${newSearchParams.toString()}`);
  }, [selectedOption, router, searchParams]);

  return (
    <ReactSelect
      options={options}
      defaultValue={options.find((so) => so.value === demo)}
      placeholder={"Select demo class"}
      onChange={setSelectedOption}
      menuPortalTarget={document.body}
    />
  );
}
