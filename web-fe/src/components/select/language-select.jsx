import { languages } from "@/data/languages";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import ReactSelect from "react-select";

export default function LanguageSelect({ searchParams }) {
  const [selectedOption, setSelectedOption] = useState(null);
  const router = useRouter();
  const language = searchParams.get("language");
  const defaultValues = useCallback(() => {
    return (
      languages.filter(({ value }) => language?.split(" ").includes(value)) ??
      []
    );
  }, [language]);

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

    router.push(`?${newSearchParams.toString()}`, { scroll: false });
  }, [selectedOption, searchParams, router]);

  return (
    <ReactSelect
      options={languages}
      isMulti
      defaultValue={defaultValues}
      placeholder={"Select Preferred languages"}
      onChange={setSelectedOption}
      menuPortalTarget={document.body}
    />
  );
}
