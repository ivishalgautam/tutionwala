"use client";

import { useQueryState } from "nuqs";
import ReactSelect from "react-select";
import http from "@/utils/http";
import { endpoints } from "@/utils/endpoints";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { Button } from "../ui/button";

const fetchSubjects = async () => {
  const { data } = await http().get(`${endpoints.subjects.getAll}`);
  return (
    data?.map((value) => ({
      value: value.name.split(" ").join("-"),
      label: value.name,
    })) ?? []
  );
};
export default function SubjectSelect({ boards = [], styles }) {
  const [subject, setSubject] = useQueryState("subject");
  const subjects = useMemo(() => {
    const data = boards
      .flatMap((brd) => brd.subjects.map((sub) => String(sub).toLowerCase()))
      .filter((value, index, self) => {
        return self.indexOf(value) === index;
      });

    return data.map((sub) => ({
      value: sub.split(" ").join("-"),
      label: sub,
    }));
  }, [boards]);

  // const {
  //   data: subjects,
  //   isLoading,
  //   isFetching,
  // } = useQuery({
  //   queryFn: fetchSubjects,
  //   queryKey: [`subject`],
  // });
  const selectedOptions = useMemo(
    () =>
      subject
        ?.split(" ")
        .map((value) => subjects?.find((sub) => sub.value === value))
        .filter(Boolean) ?? [],
    [subjects, subject],
  );

  const handleChange = (selected) => {
    if (!selected || selected.length === 0) {
      setSubject(null);
    } else {
      const valueString = selected.map((opt) => opt.value).join(" ");
      setSubject(valueString);
    }
  };

  // Handle reset button click
  const handleReset = () => {
    setSubject(null);
  };

  return (
    <div className="flex items-center gap-2">
      <div className="flex-grow">
        <ReactSelect
          options={subjects}
          isMulti
          value={selectedOptions}
          placeholder="Select Preferred Subjects"
          onChange={handleChange}
          menuPortalTarget={
            typeof window !== "undefined" ? document.body : null
          }
          styles={styles}
        />
      </div>
      {selectedOptions.length > 0 && (
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
