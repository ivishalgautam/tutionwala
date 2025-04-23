import ReactSelect from "react-select/async";
import { useCallback, useEffect, useRef, useState } from "react";
import http from "@/utils/http";
import { endpoints } from "@/utils/endpoints";
import { useQuery } from "@tanstack/react-query";
import { useQueryState } from "nuqs";
import { Button } from "../ui/button";

const searchCategory = async (q) => {
  const { data } = await http().get(`${endpoints.subCategories.getAll}?q=${q}`);

  const uniqueValues = data.filter((value, index, self) => {
    return self.indexOf(value) === index;
  });

  const filteredData = uniqueValues?.map(({ slug, name }) => ({
    label: name,
    value: slug,
  }));
  return filteredData;
};

export default function SubCategorySelect({ isMulti = false }) {
  const [subCatInputVal, setSubCatInputVal] = useState("");
  const [selectedOption, setSelectedOption] = useState(null);
  const [defaultOptions, setDefaultOptions] = useState([]);
  const debounceTimeoutRef = useRef(null);

  // Replace URL manipulation with nuqs
  const [category, setCategory] = useQueryState("category");

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

  // Update URL query param when selection changes
  useEffect(() => {
    if (!selectedOption) return;

    const valuesToSet = Array.isArray(selectedOption)
      ? selectedOption
          .map(({ value }) => value)
          .join(" ")
          .toString()
      : selectedOption.value;

    setCategory(valuesToSet || null);
  }, [selectedOption, setCategory]);

  // Initialize selectedOption from URL on component mount
  useEffect(() => {
    if (category) {
      const categoryArray = category.split(" ");
      const formattedOptions = categoryArray.map((value) => ({
        label: value.replace(/-/g, " "),
        value,
      }));

      setDefaultOptions(formattedOptions);
      setSelectedOption(isMulti ? formattedOptions : formattedOptions[0]);
    }

    if (!category) {
      setSelectedOption(null);
    }
  }, [category, isMulti]);

  // Handle reset button click
  const handleReset = () => {
    setSelectedOption(null);
    setCategory(null);
  };

  return (
    <div className="flex items-center gap-2">
      <div className="flex-grow">
        <ReactSelect
          loadOptions={handleInputChange}
          placeholder={"Search Category..."}
          isLoading={isFetching && isLoading}
          onChange={setSelectedOption}
          isMulti={isMulti}
          defaultOptions={defaultOptions}
          value={selectedOption}
          menuPortalTarget={document.body}
          className="rounded border"
        />
      </div>
      {selectedOption && (
        <Button
          onClick={handleReset}
          type="button"
          aria-label="Reset mode selection"
        >
          Reset
        </Button>
      )}
    </div>
  );
}
