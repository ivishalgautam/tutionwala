"use client";
import { Button } from "../components/ui/button";
import { H3 } from "../components/ui/typography";
import { Label } from "../components/ui/label";
import { Input } from "../components/ui/input";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { CheckIcon } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../components/ui/popover";
import { CaretSortIcon } from "@radix-ui/react-icons";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../components/ui/command";
import { useQuery } from "@tanstack/react-query";
import SubCategorySelect from "../components/select/sub-category-select";
import { useSearchParams } from "next/navigation";
import http from "@/utils/http";
import { endpoints } from "@/utils/endpoints";
import { cn } from "@/lib/utils";
import { Checkbox } from "../components/ui/checkbox";
import { useCallback, useEffect, useState } from "react";

const fetchSubCategory = async (slug) => {
  const { data } = await http().get(
    `${endpoints.subCategories.getAll}/${slug}`,
  );
  return data;
};

const fetchTutorCourse = async (data) => {
  const resp = await http().post(
    `${endpoints.tutor.getAll}/get-tutor-course-by-tutor-and-course-id`,
    data,
  );
  return resp.data;
};

export default function CreateCourse({
  handleCreate,
  type = "create",
  updateMutation,
}) {
  const {
    register,
    watch,
    control,
    setValue,
    formState: { errors },
    handleSubmit,
    unregister,
  } = useForm({
    defaultValues: {
      is_demo_class: false,
      fields: [],
      boards: [],
      class_conduct_mode: [],
      selectedOnlineTypes: [],
      selectedOfflineTypes: [],
      selectedOfflineLocations: [],
      budgets: [],
    },
  });
  const {
    fields: budgets,
    append,
    remove,
  } = useFieldArray({
    control,
    name: "budgets",
  });
  const selectedModes = watch("class_conduct_mode", []);
  const selectedOnlineTypes = watch("selectedOnlineTypes", []);
  const selectedOfflineTypes = watch("selectedOfflineTypes", []);
  const selectedOfflineLocations = watch("selectedOfflineLocations", []);

  // console.log({
  //   selectedModes,
  //   selectedOnlineTypes,
  //   selectedOfflineTypes,
  //   selectedOfflineLocations,
  // });

  const searchParams = useSearchParams();
  const categorySlug = searchParams.get("category");
  const { data, isLoading: isSubCatLoading } = useQuery({
    queryKey: [`subCategory-${categorySlug}`, categorySlug],
    queryFn: () => fetchSubCategory(categorySlug),
    enabled: !!categorySlug,
  });

  const { data: tutorCourse, isLoading: isTutorCourseLoading } = useQuery({
    queryKey: [`tutor-course-${categorySlug}`, categorySlug],
    queryFn: () => fetchTutorCourse({ sub_category_slug: categorySlug }),
    enabled: !!categorySlug,
  });

  // console.log(data?.fields, tutorCourse?.fields);

  const boards = data ? data.boards : [];
  const boardNames = boards.map(({ board_name }) => board_name);
  const selectedBoards = watch("selected_boards") ?? [];
  const setBoards = useCallback(
    (board, subject) => {
      const prevBoards = watch("boards") ?? [];

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

        const filtered = updatedBoards.filter((b) => b.subjects.length);
        setValue("boards", filtered);
      } else {
        setValue("boards", [
          ...prevBoards,
          { board_name: board, subjects: [subject] },
        ]);
      }
    },
    [setValue, watch],
  );

  const setFields = (fieldName, option, type) => {
    const prevFields = watch("fields") ?? [];
    const existingField = prevFields?.find(
      (item) => item.fieldName === fieldName,
    );

    if (existingField) {
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
        { fieldName: fieldName, options: [option], type },
      ]);
    }
  };

  const onSubmit = (formData) => {
    const payload = {
      fields: formData.fields,
      boards: formData.boards,
      sub_category_slug: categorySlug,
      is_demo_class: formData.is_demo_class,
      budgets: formData?.budgets ?? [],
    };
    if (type === "create") {
      handleCreate({ ...payload });
    }

    if (type === "edit") {
      updateMutation.mutate({ id: tutorCourse.id, data: payload });
    }
  };

  useEffect(() => {
    // Get the current budget values
    const existingBudgets = watch("budgets") || [];

    let newBudgets = [];

    if (selectedModes.includes("online") && selectedOnlineTypes.length > 0) {
      selectedOnlineTypes.forEach((type) => {
        ["per_hour", "per_month", "per_course"].forEach((costing) => {
          const existingEntry = existingBudgets.find(
            (b) =>
              b.mode === "online" && b.type === type && b.costing === costing,
          );

          newBudgets.push(
            existingEntry || {
              mode: "online",
              type,
              location: null,
              budget: "",
              costing,
            },
          );
        });
      });
    }

    if (
      selectedModes.includes("offline") &&
      selectedOfflineTypes.length > 0 &&
      selectedOfflineLocations?.length > 0
    ) {
      selectedOfflineTypes.forEach((type) => {
        selectedOfflineLocations.forEach((location) => {
          ["per_hour", "per_month", "per_course"].forEach((costing) => {
            const existingEntry = existingBudgets.find(
              (b) =>
                b.mode === "offline" &&
                b.type === type &&
                b.location === location &&
                b.costing === costing,
            );

            newBudgets.push(
              existingEntry || {
                mode: "offline",
                type,
                location,
                budget: "",
                costing,
              },
            );
          });
        });
      });
    }

    // Only update if there are changes to prevent unnecessary re-renders
    if (JSON.stringify(existingBudgets) !== JSON.stringify(newBudgets)) {
      setValue("budgets", newBudgets);
    }
  }, [
    selectedModes,
    selectedOnlineTypes,
    selectedOfflineTypes,
    selectedOfflineLocations,
    watch,
    setValue,
  ]);

  const getUniqueValues = useCallback(
    (key, mode) =>
      Array.from(
        new Set(
          tutorCourse.budgets.filter((b) => b.mode === mode).map((b) => b[key]),
        ),
      ),
    [tutorCourse?.budgets],
  );

  useEffect(() => {
    if (tutorCourse) {
      // console.log(tutorCourse);
      setValue("is_demo_class", tutorCourse.is_demo_class);
      if (tutorCourse.budgets.length) {
        const modeTypesSet = Array.from(
          new Set(tutorCourse.budgets.map(({ mode }) => mode)),
        );

        const selectedOnlineTypes = getUniqueValues("type", "online");
        setValue("selectedOnlineTypes", selectedOnlineTypes);
        selectedOnlineTypes.forEach((type) => {
          append({
            mode: "online",
            type,
            location: null,
            budget: "",
            costing: "",
          });
        });

        const selectedOfflineTypes = getUniqueValues("type", "offline");
        setValue("selectedOfflineTypes", selectedOfflineTypes);
        selectedOfflineLocations.forEach((location) => {
          append({
            mode: "offline",
            type,
            location,
            budget: "",
            costing: "",
          });
        });

        setValue(
          "selectedOfflineLocations",
          getUniqueValues("location", "offline"),
        );
        setValue("class_conduct_mode", modeTypesSet);
        setValue("budgets", tutorCourse.budgets);
      }
      //

      if (tutorCourse.fields.length) {
        setValue("fields", tutorCourse.fields);
        tutorCourse.fields.forEach(({ fieldName, options }) => {
          setValue(
            `selected.${fieldName}.options`,
            data.fields.find((f) => f.fieldName === fieldName)?.fieldType ===
              "radio"
              ? options[0]
              : options,
          );
        });
      }

      if (tutorCourse.is_boards) {
        setValue(
          "selected_boards",
          tutorCourse.boards.map(({ board_name }) => board_name),
        );
        setValue("boards", tutorCourse.boards);

        tutorCourse.boards.forEach(({ board_name, subjects }) => {
          setValue(`selected.${board_name}.subjects`, subjects);
        });
      }
    }
  }, [tutorCourse, setValue, setBoards, watch, getUniqueValues]);
  // console.log(watch("selected"));
  return (
    <div className="rounded-lg bg-white p-8">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="divide-y *:pt-4">
          <H3 className={"text-center"}>Add course</H3>

          {type === "create" && (
            <div className="grid grid-cols-1 pb-4 md:grid-cols-2 lg:grid-cols-3">
              <div>
                <Label>Select course</Label>
                <SubCategorySelect searchParams={searchParams} />
              </div>
            </div>
          )}

          <div className="space-y-4 divide-y">
            {/* demo class */}
            <div>
              <Label>Is demo classes available?</Label>
              <Controller
                name="is_demo_class"
                control={control}
                render={({ field }) => (
                  <div className="flex flex-row items-center space-x-3 space-y-0 p-2">
                    <div>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </div>
                    <div className="space-y-1 leading-none">
                      <Label>Yes, I provide demo classes.</Label>
                    </div>
                  </div>
                )}
              />
            </div>

            {/* counduct classes */}
            <div className="space-y-1">
              <Label>How will you conduct class?</Label>
              <div className="flex items-center justify-start gap-2">
                {["offline", "online"].map((mode) => (
                  <Controller
                    key={mode}
                    control={control}
                    rules={{ required: "required*" }}
                    name="class_conduct_mode"
                    render={({ field }) => (
                      <div className="flex items-center gap-1">
                        <Checkbox
                          checked={field.value?.includes(mode)}
                          onCheckedChange={(checked) => {
                            const newValue = checked
                              ? [...field.value, mode]
                              : field.value.filter((val) => val !== mode);
                            field.onChange(newValue);
                          }}
                        />
                        <Label className="capitalize">{mode}</Label>
                      </div>
                    )}
                  />
                ))}
              </div>
              {errors.class_conduct_mode && (
                <span className="text-sm text-red-500">
                  {errors.class_conduct_mode.message}
                </span>
              )}
            </div>

            {/* Online Section */}
            {selectedModes.includes("online") && (
              <div>
                <h3>Online</h3>

                {/* online Session Types */}
                <div className="flex items-center justify-start gap-2">
                  {["oneToOne", "group"].map((mode) => (
                    <Controller
                      key={mode}
                      control={control}
                      rules={{ required: "required*" }}
                      name="selectedOnlineTypes"
                      render={({ field }) => (
                        <div className="flex items-center gap-1">
                          <Checkbox
                            checked={field.value?.includes(mode)}
                            onCheckedChange={(checked) => {
                              const newValue = checked
                                ? [...field.value, mode]
                                : field.value.filter((val) => val !== mode);
                              field.onChange(newValue);
                            }}
                          />
                          <Label className="capitalize">{mode}</Label>
                        </div>
                      )}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Offline Section */}
            {selectedModes.includes("offline") && (
              <div className="space-y-2">
                <h3>Offline</h3>
                {/* Offline Session Types */}
                <div className="">
                  <Label>Offline Type:</Label>
                  <div className="flex items-center justify-start gap-2">
                    {["oneToOne", "group"].map((mode) => (
                      <Controller
                        key={mode}
                        control={control}
                        rules={{ required: "required*" }}
                        name="selectedOfflineTypes"
                        render={({ field }) => (
                          <div className="flex items-center gap-1">
                            <Checkbox
                              checked={field.value?.includes(mode)}
                              onCheckedChange={(checked) => {
                                const newValue = checked
                                  ? [...field.value, mode]
                                  : field.value.filter((val) => val !== mode);
                                field.onChange(newValue);
                              }}
                            />
                            <Label className="capitalize">{mode}</Label>
                          </div>
                        )}
                      />
                    ))}
                  </div>
                </div>

                {/* Offline Location */}
                {selectedOfflineTypes.length > 0 && (
                  <div>
                    <Label>Location:</Label>
                    <div className="flex items-center justify-start gap-2">
                      {["tutorPlace", "studentPlace", "other"].map((mode) => (
                        <Controller
                          key={mode}
                          control={control}
                          rules={{ required: "required*" }}
                          name="selectedOfflineLocations"
                          render={({ field }) => (
                            <div className="flex items-center gap-1">
                              <Checkbox
                                checked={field.value?.includes(mode)}
                                onCheckedChange={(checked) => {
                                  const newValue = checked
                                    ? [...field.value, mode]
                                    : field.value.filter((val) => val !== mode);
                                  field.onChange(newValue);
                                }}
                              />
                              <Label className="capitalize">{mode}</Label>
                            </div>
                          )}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Dynamic Budgets */}
            {budgets.length > 0 && (
              <div>
                <h4>Budgets:</h4>
                <div className="grid grid-cols-3 gap-4">
                  {budgets.map((field, index) => (
                    <div key={field.id}>
                      <p className="text-sm">
                        Mode: <strong>{field.mode}</strong>, Type:{" "}
                        <strong>{field.type}</strong>, Costing:{" "}
                        <strong>{field?.costing?.split("_").join(" ")}</strong>
                        {field.location && (
                          <>
                            {" "}
                            Location: <strong>{field.location}</strong>
                          </>
                        )}
                      </p>
                      <div>
                        <Input
                          type="number"
                          {...register(`budgets.${index}.budget`, {
                            min: 0,
                            valueAsNumber: true,
                            required: "required*",
                          })}
                          placeholder={`Enter budget for Mode: ${field.mode}, Type: ${field.type}, Costing: ${field?.costing?.split("_").join(" ")}
                     `}
                        />
                        {errors?.budgets?.[index]?.budget && (
                          <span className="text-red-500">
                            {errors?.budgets?.[index]?.budget?.message}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {data?.is_boards && (
              <div>
                <div className="text-sm font-medium">
                  Which {data?.name} boards do you teach?
                </div>
                <div className="space-y-1">
                  {boardNames.map((option) => (
                    <div key={option} className="text-sm text-gray-700">
                      <Label className="flex items-center justify-between">
                        <span className="font-normal uppercase">{option}</span>
                        <Input
                          type="checkbox"
                          value={option}
                          {...register("selected_boards")}
                          className="size-6 accent-primary"
                        />
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* board subjects */}
            {selectedBoards &&
            Array.isArray(selectedBoards) &&
            selectedBoards.length ? (
              <div className="space-y-4 divide-y *:pt-4">
                {selectedBoards?.map((board, ind) => (
                  <div key={ind} className="space-y-2">
                    <div className="text-sm font-medium">
                      Which subjects of {data?.name} in {board} boards do you
                      teach?
                    </div>
                    <div className="space-y-1">
                      {boards
                        .find((item) => item.board_name === board)
                        ?.subjects.map((subject) => (
                          <div key={subject} className="text-sm text-gray-700">
                            <Label className="flex items-center justify-between">
                              <span className="capitalize">{subject}</span>
                              <input
                                type="checkbox"
                                value={subject}
                                className="size-6 accent-primary"
                                {...register(`selected.${board}.subjects`)}
                                onChange={() => setBoards(board, subject)}
                              />
                            </Label>
                          </div>
                        ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <></>
            )}

            {/* custom fields */}
            <div className="space-y-4 divide-y *:pt-4">
              {data?.fields.map((item, ind) => (
                <div key={ind} className="mt-3 space-y-4">
                  <div className="text-sm font-medium capitalize">
                    {item.questionForTutor}
                  </div>
                  <div>
                    {item.fieldType === "checkbox" && (
                      <div className="space-y-1">
                        {item.options.map((option) => (
                          <div key={option} className="text-sm text-gray-700">
                            <Label className="flex items-center justify-between">
                              <span className="font-normal capitalize">
                                {option}
                              </span>
                              <Input
                                type="checkbox"
                                {...register(
                                  `selected.${item.fieldName}.options`,
                                )}
                                value={option}
                                className="size-6 accent-primary"
                                onClick={() =>
                                  setFields(item.fieldName, option, "checkbox")
                                }
                              />
                            </Label>
                          </div>
                        ))}
                      </div>
                    )}
                    {item.fieldType === "radio" && (
                      <div className="space-y-1">
                        {item.options.map((option) => {
                          return (
                            <div key={option} className="text-sm text-gray-700">
                              <Label className="flex items-center justify-between">
                                <span className="font-normal capitalize">
                                  {option}
                                </span>
                                <Input
                                  type="radio"
                                  {...register(
                                    `selected.${item.fieldName}.options`,
                                  )}
                                  value={option}
                                  className="size-6 accent-primary"
                                  onClick={() =>
                                    setFields(item.fieldName, option, "radio")
                                  }
                                />
                              </Label>
                            </div>
                          );
                        })}
                      </div>
                    )}
                    {item.fieldType === "dropdown" && (
                      <div>
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
                                (so) => so.fieldName === item.fieldName,
                              )?.options[0] ?? "Select option"}
                              <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent
                            className={cn("max-w-[200px] bg-white p-0")}
                          >
                            <Command>
                              {item.options?.length > 5 && (
                                <CommandInput
                                  placeholder={`Search`}
                                  className="h-9"
                                />
                              )}
                              <CommandList>
                                <CommandEmpty>No option found.</CommandEmpty>
                                <CommandGroup>
                                  {item.options?.map((opt) => (
                                    <CommandItem
                                      value={opt}
                                      key={opt}
                                      onSelect={() => {
                                        setFields(
                                          item.fieldName,
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
                                                so.fieldName === item.fieldName,
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
                        {/* {item.options.map((option) => (
                          <div key={option} className="text-sm text-gray-700">
                            <Label className="flex items-center justify-between">
                              <span className="capitalize">{option}</span>
                              <Input
                                type="radio"
                                value={option}
                                className="size-6 accent-primary"
                              />
                            </Label>
                          </div>
                        ))} */}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="text-end">
            <Button>Submit</Button>
          </div>
        </div>
      </form>
    </div>
  );
}
