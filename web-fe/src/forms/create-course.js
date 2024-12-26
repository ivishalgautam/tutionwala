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
import { useEffect } from "react";

const fetchSubCategory = async (slug) => {
  const { data } = await http().get(
    `${endpoints.subCategories.getAll}/${slug}`,
  );
  return data;
};

export default function CreateCourse({ handleCreate }) {
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
  const selectedModes = watch("class_conduct_mode");
  const selectedOnlineTypes = watch("selectedOnlineTypes");
  const selectedOfflineTypes = watch("selectedOfflineTypes");
  const selectedOfflineLocations = watch("selectedOfflineLocations");

  const searchParams = useSearchParams();
  const categorySlug = searchParams.get("category");
  const { data, isLoading: isSubCatLoading } = useQuery({
    queryKey: [`subCategory-${categorySlug}`, categorySlug],
    queryFn: () => fetchSubCategory(categorySlug),
    enabled: !!categorySlug,
  });

  const boards = data ? data.boards : [];
  const boardNames = boards.map(({ board_name }) => board_name);
  const selectedBoards = watch("selected_boards") ?? [];
  const setBoards = (board, subject) => {
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
    const payload = {
      fields: formData.fields,
      boards: formData.boards,
      sub_category_slug: categorySlug,
      is_demo_class: formData.is_demo_class,
      budgets: formData?.budgets ?? [],
    };

    handleCreate({ ...payload });
  };

  useEffect(() => {
    // Clear budgets when modes, session types, or categories change
    remove();

    if (selectedModes.includes("online") && selectedOnlineTypes.length > 0) {
      selectedOnlineTypes.forEach((type) => {
        append({
          mode: "online",
          type,
          location: null, // No categories for online
          budget: "",
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
          append({
            mode: "offline",
            type,
            location,
            budget: "",
          });
        });
      });
    }
  }, [
    selectedModes,
    selectedOnlineTypes,
    selectedOfflineTypes,
    selectedOfflineLocations,
    append,
    remove,
  ]);

  return (
    <div className="rounded-lg bg-white p-8">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="divide-y *:pt-4">
          <H3 className={"text-center"}>Add course</H3>

          <div className="grid grid-cols-1 pb-4 md:grid-cols-2 lg:grid-cols-3">
            <div>
              <Label>Select course</Label>
              <SubCategorySelect searchParams={searchParams} />
            </div>
          </div>

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
                {budgets.map((field, index) => (
                  <div key={field.id}>
                    <p>
                      Mode: <strong>{field.mode}</strong>, Type:{" "}
                      <strong>{field.type}</strong>,
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
                        placeholder="Enter budget"
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
                        {item.options.map((option) => (
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
                        ))}
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
