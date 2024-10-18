"use client";
import Loading from "@/components/loading";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { H6 } from "@/components/ui/typography";
import { languages } from "@/data/languages";
import { cn } from "@/lib/utils";
import { endpoints } from "@/utils/endpoints";
import http from "@/utils/http";
import { CaretSortIcon } from "@radix-ui/react-icons";
import { useMutation, useQuery } from "@tanstack/react-query";
import { CheckIcon, MoveLeft, MoveRight, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";

import Tutors from "@/components/tutors";
import NextImage from "@/components/next-image";
import "@smastrom/react-rating/style.css";
import useMapLoader from "@/hooks/useMapLoader";
import { useAutocomplete } from "@/hooks/useAutoComplete";
import Image from "next/image";

const fetchSubCategory = async (id) => {
  const { data } = await http().get(`${endpoints.subCategories.getAll}/${id}`);
  return data;
};

const limit = 6;
const fetchTutors = async (formData, limit) => {
  return await http().post(
    `${endpoints.tutor.getAll}/filter${limit ? `?limit=${limit}` : ""}`,
    formData,
  );
};

export default function Page({ params: { subCatSlug } }) {
  const { isLoaded } = useMapLoader();
  const { inputRef, selectedPlace } = useAutocomplete(isLoaded);

  const storedFilteration =
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem(subCatSlug))
      : {};
  const {
    register,
    watch,
    control,
    setValue,
    formState: { errors },
    handleSubmit,
    trigger,
  } = useForm({
    defaultValues: storedFilteration ?? {
      fields: [],
      boards: [],
      languages: [],
      location: "",
      selected_subjects: [],
    },
  });
  const watchFields = watch();
  const [filteredTutors, setFilteredTutors] = useState([]);
  const [totalSteps, setTotalSteps] = useState(0);
  const [isFilterationComplete, setIsFilterationComplete] = useState(false);
  const [currStep, setCurrStep] = useState(storedFilteration?.currStep ?? 1);

  const { data, isLoading } = useQuery({
    queryKey: [`subCategory-${subCatSlug}`],
    queryFn: () => fetchSubCategory(subCatSlug),
    enabled: !!subCatSlug,
  });

  const tutors = useMutation({
    mutationKey: [`tutors-${subCatSlug}`],
    mutationFn: (data) =>
      fetchTutors(data, isFilterationComplete ? null : limit),
    onSettled: (data) => {
      setFilteredTutors(data);
    },
  });

  const boards = data ? data.boards : [];
  const boardNames = boards.map(({ board_name }) => board_name);
  const selectedBoard = watch("selected_board");

  const setBoards = (board, subject) => {
    const prevBoards = watch("boards");

    const existingBoard = prevBoards.find(
      ({ board_name }) => board_name === board,
    );

    if (existingBoard) {
      const updatedBoards = prevBoards.map((b) =>
        b.board_name === board
          ? {
              ...b,
              subjects: b.subjects.includes(subject)
                ? b.subjects.filter((s) => s !== subject)
                : [...b.subjects, subject],
            }
          : b,
      );
      setValue("boards", updatedBoards);
    } else {
      setValue("boards", [
        ...prevBoards,
        { board_name: board, subjects: [subject] },
      ]);
    }
  };

  const setFields = (fieldName, option, type) => {
    const prevFields = watch("fields") ?? [];

    const existingBoard = prevFields?.find(
      (item) => item.fieldName === fieldName,
    );

    if (existingBoard) {
      const updatedFields = prevFields?.map((f) =>
        f.fieldName === fieldName
          ? {
              ...f,
              options:
                type === "radio" || type === "dropdown"
                  ? [option]
                  : f.options.includes(option)
                    ? f.options.filter((s) => s !== option)
                    : [...f.options, option],
            }
          : f,
      );
      setValue("fields", updatedFields);
    } else {
      setValue("fields", [
        ...prevFields,
        { fieldName: fieldName, options: [option] },
      ]);
    }
  };

  const onSubmit = (formData) => {
    console.log({ formData });
    setIsFilterationComplete(true);
    tutors.mutate({ ...formData, subCatSlug });
  };

  useEffect(() => {
    if (!data) return;

    let totalSteps = data.is_boards
      ? data.fields?.length + 2 + 2
      : data.fields?.length + 2;

    setTotalSteps(totalSteps);
  }, [data]);

  const handlePrev = () => {
    setCurrStep((prev) => prev - 1);
    localStorage.setItem(subCatSlug, JSON.stringify(watchFields));

    tutors.mutate({ ...watchFields, subCatSlug });
  };

  const handleNext = async () => {
    if (!(await trigger())) return;
    setCurrStep((prev) => prev + 1);
    localStorage.setItem(subCatSlug, JSON.stringify({ ...watchFields }));
    tutors.mutate({
      ...watchFields,
      subCatSlug,
      boards:
        data?.is_boards && currStep >= 4
          ? [
              {
                board_name: selectedBoard,
                subjects: [...watch("selected_subjects")],
              },
            ]
          : [],
    });
  };

  useEffect(() => {
    localStorage.setItem(
      subCatSlug,
      JSON.stringify({ ...watchFields, subCatSlug: subCatSlug }),
    );
    return () => {
      localStorage.removeItem(subCatSlug);
    };
  }, [watchFields, subCatSlug, currStep]);

  useEffect(() => {
    if (subCatSlug) {
      tutors.mutate({ ...watchFields, subCatSlug });
    }
  }, []);

  useEffect(() => {
    if (isFilterationComplete) {
      tutors.mutate({ ...storedFilteration, subCatSlug });
    }
  }, [isFilterationComplete]);

  useEffect(() => {
    if (watch("selected_board")) {
      setValue("selected_subjects", []);
    }
  }, [watch("selected_board")]);

  useEffect(() => {
    if (selectedPlace) {
      const { address, location } = selectedPlace;
      const { lat, lng } = location;
      setValue("location", address);
      setValue("lat", lat());
      setValue("lng", lng());
    }
  }, [selectedPlace]);

  if (isLoading) return <Loading />;

  return (
    <div className={"space-y-4 p-8"}>
      <div className="mx-auto max-w-2xl space-y-2 rounded-lg bg-white">
        {/* <Stepper currStep={currStep} /> */}
        {!isFilterationComplete ? (
          <form onSubmit={handleSubmit(onSubmit)} className="p-6">
            <div className="space-y-6">
              {/* <H3 className={"text-center"}>Complete your profile</H3> */}
              <div className="space-y-4 divide-y">
                {/* location */}
                {currStep === 1 && (
                  <div className="space-y-1">
                    <div>
                      <H6>Enter your location.</H6>
                    </div>
                    <div className="space-y-3">
                      {errors?.location && (
                        <span className="text-sm text-red-500">
                          {errors?.location.message}
                        </span>
                      )}
                      <div>
                        <Label className="text-sm">Location</Label>
                        <Controller
                          control={control}
                          name="location"
                          rules={{ required: "required*" }}
                          render={({ field: { onChange, value } }) => (
                            <Input ref={inputRef} />
                          )}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* language */}
                {currStep === 2 && (
                  <div className="space-y-1">
                    <div>
                      <H6>Select language.</H6>
                    </div>
                    <div className="space-y-3">
                      {errors?.languages && (
                        <span className="text-sm text-red-500">
                          {errors?.languages.message}
                        </span>
                      )}
                      {languages.map((language, ind) => (
                        <div
                          key={ind}
                          className="flex items-center justify-between"
                        >
                          <Label className="capitalize">{language.label}</Label>
                          <Controller
                            control={control}
                            name="languages"
                            rules={{ required: "required*" }}
                            render={({ field }) => {
                              return (
                                <Checkbox
                                  checked={field.value?.includes(
                                    language.value,
                                  )}
                                  onCheckedChange={(checked) => {
                                    return checked
                                      ? field.onChange([
                                          ...field?.value,
                                          language.value,
                                        ])
                                      : field.onChange(
                                          field.value?.filter(
                                            (value) => value !== language.value,
                                          ),
                                        );
                                  }}
                                />
                              );
                            }}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* boards */}
                {data?.is_boards && currStep === 3 && (
                  <div>
                    <div className="text-sm font-medium">
                      Which {data?.name} board of education are you looking for?
                    </div>
                    <div className="space-y-1">
                      {errors?.selected_board && (
                        <span className="text-sm text-red-500">
                          {errors?.selected_board.message}
                        </span>
                      )}
                      {boardNames.map((option) => (
                        <div key={option} className="text-sm text-gray-700">
                          <Label className="flex items-center justify-between">
                            <span className="font-normal uppercase">
                              {option}
                            </span>
                            <Input
                              type="radio"
                              value={option}
                              {...register("selected_board", {
                                required: "required*",
                              })}
                              className="size-6 accent-primary"
                            />
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* board subjects */}
                {data?.is_boards && currStep === 4 && (
                  <div className="space-y-2">
                    <div className="text-sm">
                      Which of the following{" "}
                      <span className="font-bold uppercase">
                        {selectedBoard}
                      </span>{" "}
                      subjects fo you need tution for?
                    </div>
                    <div className="space-y-1">
                      {/* {errors?.selected_subjects && (
                        <span className="text-sm text-red-500">
                          {errors?.selected_subjects.message}
                        </span>
                      )} */}
                      {boards
                        .find((item) => item.board_name === selectedBoard)
                        ?.subjects.map((subject, ind) => (
                          <div key={subject} className="text-sm text-gray-700">
                            <Label className="flex items-center justify-between">
                              <span className="capitalize">{subject}</span>
                              <Controller
                                control={control}
                                name="selected_subjects"
                                rules={{ required: "required*" }}
                                render={({ field }) => (
                                  <Checkbox
                                    checked={field.value?.includes(subject)}
                                    onCheckedChange={(checked) => {
                                      return checked
                                        ? field.onChange([
                                            ...field.value,
                                            subject,
                                          ])
                                        : field.onChange(
                                            field.value?.filter(
                                              (value) => value !== subject,
                                            ),
                                          );
                                    }}
                                  />
                                )}
                              />
                              {/* <input
                                type="checkbox"
                                value={subject}
                                className="size-6 accent-primary"
                                {...register(
                                  `selected_subjects.${ind}.subjects`,
                                )}
                                onChange={() =>
                                  setBoards(selectedBoard, subject)
                                }
                              /> */}
                            </Label>
                          </div>
                        ))}
                    </div>
                  </div>
                )}

                {/* custom fields */}
                {data?.fields.map(
                  (field, key) =>
                    currStep === (data.is_boards ? 2 + key + 3 : key + 3) && (
                      <div className="space-y-4" key={key}>
                        <div className="mt-3 space-y-4">
                          <div className="text-sm font-medium capitalize">
                            {field.questionForStudent}
                          </div>
                          <div>
                            {field.fieldType === "checkbox" && (
                              <div className="space-y-1">
                                {errors?.selected?.[field.fieldName]
                                  ?.options && (
                                  <span className="text-sm text-red-500">
                                    {
                                      errors?.selected?.[field.fieldName]
                                        ?.options.message
                                    }
                                  </span>
                                )}
                                {field.options.map((option) => (
                                  <div
                                    key={option}
                                    className="text-sm text-gray-700"
                                  >
                                    <Label className="flex items-center justify-between">
                                      <span className="font-normal capitalize">
                                        {option}
                                      </span>
                                      <Input
                                        type="checkbox"
                                        {...register(
                                          `selected.${field.fieldName}.options`,
                                          { required: "required*" },
                                        )}
                                        value={option}
                                        className="size-6 accent-primary"
                                        onClick={() =>
                                          setFields(
                                            field.fieldName,
                                            option,
                                            "checkbox",
                                          )
                                        }
                                      />
                                    </Label>
                                  </div>
                                ))}
                              </div>
                            )}

                            {field.fieldType === "radio" && (
                              <div className="space-y-1">
                                {errors?.selected?.[field.fieldName]
                                  ?.options && (
                                  <span className="text-sm text-red-500">
                                    {
                                      errors?.selected?.[field.fieldName]
                                        ?.options.message
                                    }
                                  </span>
                                )}
                                {field.options.map((option) => (
                                  <div
                                    key={option}
                                    className="text-sm text-gray-700"
                                  >
                                    <Label className="flex items-center justify-between">
                                      <span className="font-normal capitalize">
                                        {option}
                                      </span>
                                      <Input
                                        type="radio"
                                        {...register(
                                          `selected.${field.fieldName}.options`,
                                          { required: "required*" },
                                        )}
                                        value={option}
                                        className="size-6 accent-primary"
                                        onClick={() =>
                                          setFields(
                                            field.fieldName,
                                            option,
                                            "radio",
                                          )
                                        }
                                      />
                                    </Label>
                                  </div>
                                ))}
                              </div>
                            )}
                            {field.fieldType === "dropdown" && (
                              <div>
                                {errors?.selected?.[field.fieldName]
                                  ?.options && (
                                  <span className="text-sm text-red-500">
                                    {
                                      errors?.selected?.[field.fieldName]
                                        ?.options.message
                                    }
                                  </span>
                                )}
                                <Popover>
                                  <PopoverTrigger asChild>
                                    <Button
                                      variant="outline"
                                      role="combobox"
                                      className={cn(
                                        "w-full justify-between",
                                        // !field.value && "text-muted-foreground",
                                      )}
                                    >
                                      {watch("fields")?.find(
                                        (so) =>
                                          so.fieldName === field.fieldName,
                                      )?.options[0] ?? "Select option"}
                                      <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                    </Button>
                                  </PopoverTrigger>
                                  <PopoverContent
                                    className={cn("max-w-[200px] bg-white p-0")}
                                  >
                                    <Command>
                                      {field.options?.length > 5 && (
                                        <CommandInput
                                          placeholder={`Search`}
                                          className="h-9"
                                        />
                                      )}
                                      <CommandList>
                                        <CommandEmpty>
                                          No option found.
                                        </CommandEmpty>
                                        <CommandGroup>
                                          {field.options?.map((opt) => (
                                            <CommandItem
                                              value={opt}
                                              key={opt}
                                              onSelect={() => {
                                                setFields(
                                                  field.fieldName,
                                                  opt,
                                                  "dropdown",
                                                );
                                              }}
                                            >
                                              {opt}
                                              <CheckIcon
                                                className={cn(
                                                  "ml-auto h-4 w-4",
                                                  watch("fields")
                                                    ?.find(
                                                      (so) =>
                                                        so.fieldName ===
                                                        field.fieldName,
                                                    )
                                                    ?.options.includes(opt)
                                                    ? "opacity-100"
                                                    : "opacity-0",
                                                )}
                                              />
                                            </CommandItem>
                                          ))}
                                        </CommandGroup>
                                      </CommandList>
                                    </Command>
                                  </PopoverContent>
                                </Popover>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ),
                )}
              </div>

              <div className="flex items-center justify-between">
                <Button
                  type="button"
                  onClick={handlePrev}
                  disabled={currStep === 1}
                >
                  <MoveLeft /> &nbsp; Prev
                </Button>
                {currStep < totalSteps && (
                  <Button
                    type="button"
                    onClick={handleNext}
                    disabled={currStep === totalSteps}
                  >
                    Next &nbsp; <MoveRight />
                  </Button>
                )}
                {currStep === totalSteps && <Button>Sumit</Button>}
              </div>
            </div>

            {filteredTutors?.data?.length > 0 && (
              <div className="mt-6 flex items-center justify-start gap-2 border-t pt-4">
                <div className="mr-auto">Matches found</div>
                {filteredTutors?.data?.map((item, ind) => (
                  <div
                    key={item.id}
                    className={cn("size-20", {
                      relative: filteredTutors.data?.length - 1 === ind,
                    })}
                  >
                    {filteredTutors.data?.length - 1 === ind &&
                      filteredTutors.total > limit && (
                        <div
                          className={cn(
                            "absolute inset-0 flex items-center justify-center rounded bg-black/50 text-white",
                          )}
                        >
                          <Plus size={10} /> {filteredTutors.total - limit}
                        </div>
                      )}
                    <Image
                      src={item.profile_picture}
                      width={100}
                      height={100}
                      alt=""
                      className="h-full w-full rounded-lg object-cover object-center"
                    />
                  </div>
                ))}
              </div>
            )}
          </form>
        ) : (
          <div className="p-4">
            <Tutors tutors={filteredTutors.data} isLoading={tutors.isLoading} />
          </div>
        )}
      </div>
    </div>
  );
}
