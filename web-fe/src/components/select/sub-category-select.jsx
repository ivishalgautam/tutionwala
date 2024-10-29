import ReactSelect from "react-select/async";
import { useCallback, useEffect, useRef, useState } from "react";
import http from "@/utils/http";
import { endpoints } from "@/utils/endpoints";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

const searchCategory = async (q) => {
  const { data } = await http().get(`${endpoints.subCategories.getAll}?q=${q}`);
  const filteredData = data?.map(({ slug, name }) => ({
    label: name,
    value: slug,
  }));
  return filteredData;
};

export default function SubCategorySelect({ isMulti = false, searchParams }) {
  const [subCatInputVal, setSubCatInputVal] = useState("");
  const [selectedOption, setSelectedOption] = useState(null);
  const [defaultOptions, setDefaultOptions] = useState([]);
  const router = useRouter();
  const debounceTimeoutRef = useRef(null);
  const { data, isLoading, isFetching } = useQuery({
    queryFn: () => searchCategory(subCatInputVal),
    queryKey: [`search-${subCatInputVal}`, subCatInputVal],
    enabled: !!subCatInputVal,
  });

  const handleInputChange = useCallback((inputValue) => {
    return new Promise((resolve) => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }

      debounceTimeoutRef.current = setTimeout(async () => {
        if (!inputValue.trim()) return resolve([]);

        try {
          const formattedInput = inputValue.replace(/\s+/g, "-");
          const options = await searchCategory(formattedInput);
          resolve(options);
        } catch (error) {
          console.error("Error fetching categories:", error);
          resolve([]);
        }
      }, 300);
    });
  }, []);

  useEffect(() => {
    if (!selectedOption) return;
    const newSearchParams = new URLSearchParams(searchParams.toString());
    const valuesToSet = Array.isArray(selectedOption)
      ? selectedOption
          .map(({ value }) => value)
          .join(" ")
          .toString()
      : selectedOption.value;

    if (searchParams.get("category")) {
      newSearchParams.set("category", valuesToSet);
    } else {
      newSearchParams.append("category", valuesToSet);
    }

    if (!valuesToSet) {
      newSearchParams.delete("category");
    }

    router.push(`?${newSearchParams.toString()}`);
  }, [selectedOption, router, searchParams]);

  useEffect(() => {
    const categoryValues = searchParams.get("category");
    if (categoryValues) {
      const categoryArray = categoryValues.split(" ");
      const formattedOptions = categoryArray.map((value) => ({
        label: value.replace(/-/g, " "),
        value,
      }));
      setDefaultOptions(formattedOptions);
      setSelectedOption(formattedOptions);
    }
  }, []);

  return (
    <ReactSelect
      loadOptions={handleInputChange}
      placeholder={"Search Category..."}
      isLoading={isFetching && isLoading}
      onChange={setSelectedOption}
      isMulti={isMulti}
      defaultOptions={defaultOptions}
      value={selectedOption}
      menuPortalTarget={document.body}
    />
  );
}
