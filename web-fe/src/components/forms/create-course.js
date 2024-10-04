"use client";
import React from "react";
import { Button } from "../ui/button";
import { H3, H6 } from "../ui/typography";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Controller, useForm } from "react-hook-form";
import { CheckIcon, Plus } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { CaretSortIcon } from "@radix-ui/react-icons";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../ui/command";
import { useQuery } from "@tanstack/react-query";
import SubCategorySelect from "../select/sub-category-select";
import { useSearchParams } from "next/navigation";
import http from "@/utils/http";
import { endpoints } from "@/utils/endpoints";
import { cn } from "@/lib/utils";
import { Checkbox } from "../ui/checkbox";

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
    },
  });

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
    };

    handleCreate({ ...payload });
  };

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
