import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import ReactSelect from "react-select";

const options = [
  { label: "Online", value: "online" },
  { label: "Offline", value: "offline" },
];

export default function ClassConductSelect({ searchParams }) {
  const [selectedOption, setSelectedOption] = useState(null);
  const router = useRouter();
  const mode = searchParams.get("mode");
  const defaultValues = useCallback(() => {
    return options.filter(({ value }) => mode === value) ?? [];
  }, [mode]);
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

    router.push(`?${newSearchParams.toString()}`, { scroll: false });
  }, [selectedOption, router, searchParams, mode]);

  return (
    <ReactSelect
      options={options}
      defaultValue={defaultValues}
      placeholder={"Select Mode"}
      onChange={setSelectedOption}
      menuPortalTarget={document.body}
    />
  );
}
