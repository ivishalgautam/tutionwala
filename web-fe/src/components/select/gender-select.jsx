import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import ReactSelect from "react-select";

export default function GenderSelect({ searchParams }) {
  const [selectedOption, setSelectedOption] = useState(null);
  const router = useRouter();

  useEffect(() => {
    if (!selectedOption) return;
    const newSearchParams = new URLSearchParams(searchParams.toString());

    if (searchParams.get("gender")) {
      newSearchParams.set("gender", selectedOption.value);
    } else {
      newSearchParams.append("gender", selectedOption.value);
    }

    if (!selectedOption) {
      newSearchParams.delete("gender");
    }

    router.push(`?${newSearchParams.toString()}`);
  }, [selectedOption, router, searchParams]);

  return (
    <ReactSelect
      className="min-w-96"
      options={[
        { label: "Male", value: "male" },
        { label: "Female", value: "female" },
      ]}
      placeholder={"Select gender"}
      onChange={setSelectedOption}
    />
  );
}
