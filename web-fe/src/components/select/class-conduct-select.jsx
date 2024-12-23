import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import ReactSelect from "react-select";

const options = [
  { label: "Online", value: "online" },
  { label: "Offline", value: "offline" },
  // { label: "Nearby", value: "nearby" },
  // { label: "Any", value: "any" },
];

export default function ClassConductSelect({ searchParams }) {
  const [selectedOption, setSelectedOption] = useState(null);
  const router = useRouter();
  const mode = searchParams.get("mode");
  const defaultValues = useCallback(() => {
    return (
      options.filter(({ value }) => mode?.split(" ").includes(value)) ?? []
    );
  }, [mode]);
  useEffect(() => {
    if (!selectedOption) return;
    const newSearchParams = new URLSearchParams(searchParams.toString());
    const valuesToSet = Array.isArray(selectedOption)
      ? selectedOption
          .map(({ value }) => value)
          .join(" ")
          .toString()
      : selectedOption.value;
    if (mode) {
      newSearchParams.set("mode", valuesToSet);
    } else {
      newSearchParams.append("mode", valuesToSet);
    }

    if (!selectedOption || selectedOption?.value === "any") {
      newSearchParams.delete("mode");
    }

    router.push(`?${newSearchParams.toString()}`);
  }, [selectedOption, router, searchParams]);

  return (
    <ReactSelect
      options={options}
      defaultValue={defaultValues}
      placeholder={"Select Class Conduct"}
      onChange={setSelectedOption}
      menuPortalTarget={document.body}
      isMulti
    />
  );
}
