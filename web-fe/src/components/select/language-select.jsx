import { languages } from "@/data/languages";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import ReactSelect from "react-select";

export default function LanguageSelect({ searchParams }) {
  const [selectedOption, setSelectedOption] = useState(null);
  const router = useRouter();

  useEffect(() => {
    if (!selectedOption) return;
    const newSearchParams = new URLSearchParams(searchParams.toString());
    const languageToSet = selectedOption
      .map(({ value }) => value)
      .join(" ")
      .toString();

    if (searchParams.get("language")) {
      newSearchParams.set("language", languageToSet);
    } else {
      newSearchParams.append("language", languageToSet);
    }

    if (!languageToSet) {
      newSearchParams.delete("language");
    }

    router.push(`?${newSearchParams.toString()}`);
  }, [selectedOption, searchParams, router]);

  return (
    <ReactSelect
      className="min-w-96"
      options={languages}
      isMulti
      placeholder={"Select Preferred languages"}
      onChange={setSelectedOption}
    />
  );
}
