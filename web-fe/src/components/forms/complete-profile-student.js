"use client";
import { languages } from "@/data/languages";
import useLocalStorage from "@/hooks/useLocalStorage";
import { cn } from "@/lib/utils";
import { endpoints } from "@/utils/endpoints";
import http from "@/utils/http";

// components
import { H5, H6 } from "@/components/ui/typography";
import Loading from "@/components/loading";
import Stepper from "@/components/stepper";
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

// third party imports
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";
import { Controller, useForm } from "react-hook-form";

// react imports
import Image from "next/image";
import { useEffect, useState } from "react";

// icons
import { CheckIcon, MoveLeft, MoveRight, Plus, Trash } from "lucide-react";
import { CaretSortIcon } from "@radix-ui/react-icons";
import NextImage from "../next-image";
import { getCurrentCoords } from "@/lib/get-current-coords";

const fetchSubCategory = async (id) => {
  const { data } = await http().get(
    `${endpoints.subCategories.getAll}/getById/${id}`,
  );
  return data;
};

const limit = 6;

const fetchTutors = async (formData) => {
  return await http().post(
    `${endpoints.tutor.getAll}/filter?limit=${limit}`,
    formData,
  );
};

export default function CompleteProfileStudent({
  handleCreate,
  id,
  currStep,
  setCurrStep,
  profileStep,
  setProfileStep,
  subCatSlug,
}) {
  const {
    register,
    watch,
    control,
    setValue,
    formState: { errors },
    handleSubmit,
    trigger,
  } = useForm({
    defaultValues: {
      fields: [],
      boards: [],
      languages: [],
    },
  });
  const [filteredTutors, setFilteredTutors] = useState({ found: 0, data: [] });
  const [totalSteps, setTotalSteps] = useState(0);
  const [coords, setCoords] = useState([0, 0]);

  const [images, setImages] = useState({
    profile_picture: "",
    adhaar: "",
  });
  const { token } = useLocalStorage("token");

  const { data, isLoading } = useQuery({
    queryKey: [`subCategory-${id}`],
    queryFn: () => fetchSubCategory(id),
    enabled: !!id,
  });

  // console.log(data?.fields);
  const tutors = useMutation({
    mutationKey: [`tutors-${id}`],
    mutationFn: (data) => fetchTutors({ ...data, subCatSlug }),
    onSettled: (data) => {
      setFilteredTutors({ found: data.total, data: data.data });
    },
  });

  const boards = data ? data.boards : [];
  const boardNames = boards.map(({ board_name }) => board_name);
  const selectedBoard = watch("selected_board");
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
        { board_name: board, subjects: subject ? [subject] : [] },
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
      languages: formData.languages,
      coords: coords,
    };

    // console.log({ formData });

    handleCreate({
      ...payload,
      student_id: data.student_id,
      curr_step: profileStep,
    });
  };

  useEffect(() => {
    if (!data) return;

    setProfileStep(data.curr_step);

    let totalSteps = data.is_boards
      ? data.fields?.length + 2 + 2
      : data.fields?.length + 2;

    setTotalSteps(totalSteps);
  }, [data]);

  const handleFileChange = async (event, type) => {
    try {
      const selectedFiles = event.target.files[0];
      const formData = new FormData();
      formData.append("file", selectedFiles);
      // console.log("formData=>", formData);
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}${endpoints.files.upload}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        },
      );
      type === "profile_picture"
        ? setImages((prev) => ({ ...prev, profile_picture: response.data[0] }))
        : setImages((prev) => ({ ...prev, adhaar: response.data[0] }));
    } catch (error) {
      console.error("Error uploading image:", error);
    } finally {
    }
  };
  const deleteFile = async (filePath, type) => {
    try {
      const resp = await http().delete(
        `${endpoints.files.getFiles}?file_path=${filePath}`,
      );
      toast.success(resp?.message);

      type === "profile_picture"
        ? setImages((prev) => ({ ...prev, profile_picture: "" }))
        : setImages((prev) => ({ ...prev, adhaar: "" }));
    } catch (error) {
      // console.log(error);
      return toast.error(error?.message ?? "Error deleting image");
    }
  };

  const handlePrev = () => {
    setCurrStep((prev) => prev - 1);
    tutors.mutate(watch());
  };

  const handleNext = async () => {
    if (!(await trigger())) return;

    setCurrStep((prev) => prev + 1);
    tutors.mutate(watch());
  };

  useEffect(() => {
    async function getCoords() {
      const coords = await getCurrentCoords();
      setCoords(coords);
    }

    getCoords();
  }, []);

  if (isLoading) return <Loading />;
  return (
    <div className={"space-y-4 p-8"}>
      <div className="mx-auto max-w-2xl space-y-2 rounded-lg">
        <Stepper currStep={profileStep} role={"student"} />
        <form onSubmit={handleSubmit(onSubmit)} className="">
          {/* form 1 */}
          {profileStep === 1 && (
            <div className="rounded-lg bg-white">
              <div
                className="h-1 rounded-lg bg-primary transition-all"
                style={{ width: `${(currStep * 100) / totalSteps}%` }}
              ></div>
              <div className="space-y-6 p-6">
                <div className="space-y-4 divide-y">
                  {/* language */}
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
                        <div className="">
                          <div className="">
                            <Label className="capitalize">Location</Label>
                            <Input
                              type="text"
                              {...register(`location`, {
                                required: "required*",
                              })}
                              placeholder="Enter location"
                            />
                          </div>
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
                            <Label className="capitalize">
                              {language.label}
                            </Label>
                            <Controller
                              control={control}
                              name="languages"
                              rules={{ required: "required*" }}
                              render={({ field }) => (
                                <Checkbox
                                  checked={field.value?.includes(
                                    language.value,
                                  )}
                                  onCheckedChange={(checked) => {
                                    return checked
                                      ? field.onChange([
                                          ...field.value,
                                          language.value,
                                        ])
                                      : field.onChange(
                                          field.value?.filter(
                                            (value) => value !== language.value,
                                          ),
                                        );
                                  }}
                                />
                              )}
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
                        Which {data?.name} board of education are you looking
                        for?
                      </div>
                      <div className="space-y-3">
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
                      <div className="text-sm font-medium">
                        Which of the following {selectedBoard} subjects fo you
                        need tution for?
                      </div>
                      <div className="space-y-1">
                        {boards
                          .find((item) => item.board_name === selectedBoard)
                          ?.subjects.map((subject, ind) => (
                            <div
                              key={subject}
                              className="text-sm text-gray-700"
                            >
                              <Label className="flex items-center justify-between">
                                <span className="capitalize">{subject}</span>
                                <input
                                  type="checkbox"
                                  value={subject}
                                  className="size-6 accent-primary"
                                  {...register(`selected.${ind}.subjects`)}
                                  onChange={() =>
                                    setBoards(selectedBoard, subject)
                                  }
                                />
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
                            <div className="text-sm font-medium">
                              {field.question}
                            </div>
                            <div>
                              {field.fieldType === "checkbox" && (
                                <div className="space-y-1">
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
                                      className={cn(
                                        "max-w-[200px] bg-white p-0",
                                      )}
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
                  {currStep === totalSteps && <Button>Submit</Button>}
                </div>
              </div>
            </div>
          )}

          {/* form 2 */}
          {profileStep === 2 && (
            <div className="space-y-4 rounded-lg bg-white p-6">
              <H5 className={"text-center"}>Adhaar</H5>
              <div className="space-y-4">
                <div className="flex flex-col items-center justify-center">
                  <Input
                    type="file"
                    placeholder="Select Adhaar Card"
                    {...register("adhaar", {
                      required: "Required*",
                    })}
                    onChange={(e) => handleFileChange(e, "adhaar")}
                    multiple={false}
                    accept="image/png, image/jpeg, image/jpg"
                    className={`max-w-56 bg-primary text-white`}
                  />
                  {errors.adhaar && (
                    <span className="text-sm text-red-500">
                      {errors.adhaar.message}
                    </span>
                  )}
                </div>
                <div className="flex items-center justify-center gap-4 rounded-lg border border-dashed border-gray-300 p-8">
                  {images.adhaar ? (
                    <figure className="relative size-32">
                      <Image
                        src={`${process.env.NEXT_PUBLIC_IMAGE_DOMAIN}/${images.adhaar}`}
                        width={500}
                        height={500}
                        alt="adhaar"
                        className="h-full w-full"
                        multiple={false}
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        onClick={() => deleteFile(images.adhaar, "adhaar")}
                        className="absolute -right-2 -top-2"
                        size="icon"
                      >
                        <Trash size={20} />
                      </Button>
                    </figure>
                  ) : (
                    <div>No file selected</div>
                  )}
                </div>
              </div>
              <div className="text-end">
                <Button>Submit</Button>
              </div>
            </div>
          )}
        </form>
        {filteredTutors?.found > 0 && (
          <div className="flex items-center justify-start gap-2 rounded-lg bg-gray-200 p-4">
            <div className="mr-auto">Matches found</div>
            <div>
              <div className="flex items-center justify-start gap-2 rounded-lg bg-gray-200">
                {filteredTutors?.data?.map((image, ind) => (
                  <div
                    key={image}
                    className={cn("size-20", {
                      relative: filteredTutors.data?.length - 1 === ind,
                    })}
                  >
                    {filteredTutors.data?.length - 1 === ind &&
                      filteredTutors.found > limit && (
                        <div
                          className={cn(
                            "absolute inset-0 flex items-center justify-center rounded bg-black/50 text-white",
                          )}
                        >
                          <Plus size={10} /> {filteredTutors.found - limit}
                        </div>
                      )}
                    <NextImage
                      src={image.profile_picture}
                      width={100}
                      height={100}
                      alt=""
                      className="h-full w-full rounded-lg object-cover object-center"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
