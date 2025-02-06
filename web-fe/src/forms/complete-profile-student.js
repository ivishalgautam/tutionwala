"use client";
import { languages } from "@/data/languages";
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
import { Controller, useFieldArray, useForm } from "react-hook-form";

// react imports
import Image from "next/image";
import { useEffect, useState } from "react";

// icons
import {
  CheckIcon,
  MoveLeft,
  MoveRight,
  Plus,
  PlusIcon,
  Trash,
} from "lucide-react";
import { CaretSortIcon } from "@radix-ui/react-icons";
import { getCurrentCoords } from "@/lib/get-current-coords";
import { FilterAddress } from "../components/tutors-with-filter";
import { useSearchParams } from "next/navigation";
import { Progress } from "../components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
  data,
  categoryLoading,
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
      addr: "",
      lat: "",
      lng: "",
      fields: [],
      boards: [],
      languages: [],

      academic_details: [
        {
          institution_name: "",
          program: "",
          year: "",
          grades: "",
          status: "", //"current", "previous"
        },
      ], // []
    },
  });

  const {
    fields: academicDetails,
    append,
    remove,
  } = useFieldArray({
    control,
    name: "academic_details",
  });
  const [isLoading, setIsLoading] = useState({ adhaar: false, profile: false });
  const [progress, setProgress] = useState({ adhaar: 0, profile: 0 });
  const [media, setMedia] = useState({
    profile_picture: "",
    adhaar: "",
  });
  const [filteredTutors, setFilteredTutors] = useState({ found: 0, data: [] });
  const [totalSteps, setTotalSteps] = useState(0);
  const [coords, setCoords] = useState([0, 0]);
  const searchParams = useSearchParams();
  const addr = searchParams.get("addr");
  const lat = searchParams.get("lat");
  const lng = searchParams.get("lng");

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
      academic_details: formData.academic_details,
      coords: coords,
    };
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
      ? data.fields?.length + 2 + 5
      : data.fields?.length + 5;

    setTotalSteps(totalSteps);
  }, [data, setProfileStep]);

  const handleFileChange = async (event, type) => {
    setIsLoading((prev) => ({
      ...prev,
      ...(type === "adhaar" ? { adhaar: true } : { profile: true }),
    }));
    try {
      const file = event.target.files[0];
      const fileMetaData = {
        file: {
          type: file.type,
          size: file.size,
          name: file.name,
        },
      };
      const { url } = await http().post(
        endpoints.files.preSignedUrl,
        fileMetaData,
      );

      const resp = await axios.put(url, file, {
        onUploadProgress: (progressEvent) => {
          const progress = parseInt(
            Math.round((progressEvent.loaded * 100) / progressEvent.total),
          );
          setProgress((prev) => ({
            ...prev,
            ...(type === "adhaar"
              ? { adhaar: progress }
              : { profile: progress }),
          }));
        },
      });

      const fileurl = url.split("?")[0];
      if (type === "profile_picture") {
        setMedia((prev) => ({ ...prev, profile_picture: fileurl }));
        localStorage.setItem("profile_picture", fileurl);
      } else {
        setMedia((prev) => ({ ...prev, adhaar: fileurl }));
        localStorage.setItem("adhaar", fileurl);
      }
    } catch (error) {
    } finally {
      setIsLoading((prev) => ({
        ...prev,
        ...(type === "adhaar" ? { adhaar: false } : { profile: false }),
      }));
      setProgress((prev) => ({
        ...prev,
        ...(type === "adhaar" ? { adhaar: 0 } : { profile: 0 }),
      }));
    }
  };

  // const fileMetaData = Array.from(data.file).map((file) => ({
  //   type: file.type,
  //   size: file.size,
  // }));
  const deleteFile = async (filePath, type) => {
    const key = filePath.split(".com/")[1];
    try {
      const resp = await http().delete(
        `${endpoints.files.deleteKey}?key=${key}`,
      );
      toast.success(resp?.message);

      if (type === "profile_picture") {
        setMedia((prev) => ({ ...prev, profile_picture: "" }));
        localStorage.removeItem("profile_picture");
        setValue("profile_picture", "");
      }

      if (type === "adhaar") {
        setMedia((prev) => ({ ...prev, adhaar: "" }));
        localStorage.removeItem("adhaar");
        setValue("adhaar", "");
      }
    } catch (error) {
      // console.log(error);
      return toast.error(error?.message ?? "Error deleting image");
    }
  };

  const handlePrev = () => {
    setCurrStep((prev) => prev - 1);
    tutors.mutate({ ...watch(), lat, lng });
  };

  const handleNext = async () => {
    if (!(await trigger())) return;

    setCurrStep((prev) => prev + 1);
    tutors.mutate({ ...watch(), lat, lng });
  };

  useEffect(() => {
    async function getCoords() {
      const coords = await getCurrentCoords();
      setCoords(coords);
    }

    getCoords();
  }, []);

  useEffect(() => {
    if (addr) {
      setValue("location", addr);
      setValue("lat", lat);
      setValue("lng", lng);
    }
  }, [addr, lat, lng, setValue]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const adhaar = window.localStorage.getItem("adhaar");
    const profile = window.localStorage.getItem("profile_picture");

    if (adhaar) {
      setValue("adhaar", adhaar);
      setMedia((prev) => ({ ...prev, adhaar: adhaar }));
    }
    if (profile) {
      setValue("profile_picture", profile);
      setMedia((prev) => ({ ...prev, profile_picture: profile }));
    }
  }, [setValue]);

  if (categoryLoading) return <Loading />;
  console.log({ errors });
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
                        <div>
                          <Label className="capitalize">Location</Label>
                          <Controller
                            control={control}
                            name="location"
                            rules={{ required: "required*" }}
                            render={({ field }) => (
                              <FilterAddress searchParams={searchParams} />
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

                  {/* preference */}
                  {currStep === 3 && (
                    <div className="space-y-1">
                      <Label>
                        Are you looking for Private or Group Classes?
                      </Label>
                      <Controller
                        control={control}
                        rules={{ required: "required*" }}
                        name="preference"
                        render={({ field }) => (
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="flex items-center justify-start gap-2"
                            value={field.value}
                          >
                            {[
                              "one on one/private tutions",
                              "no preference",
                              "group classes",
                            ].map((ele, key) => (
                              <div
                                className={cn(
                                  "flex cursor-pointer items-center space-x-2 rounded border p-2",
                                  {
                                    "border-primary-200 bg-primary-50":
                                      field.value === ele,
                                  },
                                )}
                                key={ele}
                              >
                                <RadioGroupItem value={ele} id={ele} />
                                <Label htmlFor={ele} className="capitalize">
                                  {ele}
                                </Label>
                              </div>
                            ))}
                          </RadioGroup>
                        )}
                      />
                      {errors.preference && (
                        <span className="text-sm text-red-500">
                          {errors.preference.message}
                        </span>
                      )}
                    </div>
                  )}

                  {/* availability */}
                  {currStep === 4 && (
                    <div className="space-y-1">
                      <Label>
                        What days are you generally available to Classes?
                      </Label>
                      <Controller
                        control={control}
                        rules={{ required: "required*" }}
                        name="availability"
                        render={({ field }) => (
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="flex items-center justify-start gap-2"
                            value={field.value}
                          >
                            {["anyday", "weekday", "weekend"].map(
                              (ele, key) => (
                                <div
                                  className={cn(
                                    "flex cursor-pointer items-center space-x-2 rounded border p-2",
                                    {
                                      "border-primary-200 bg-primary-50":
                                        field.value === ele,
                                    },
                                  )}
                                  key={ele}
                                >
                                  <RadioGroupItem value={ele} id={ele} />
                                  <Label htmlFor={ele} className="capitalize">
                                    {ele}
                                  </Label>
                                </div>
                              ),
                            )}
                          </RadioGroup>
                        )}
                      />
                      {errors.availability && (
                        <span className="text-sm text-red-500">
                          {errors.availability.message}
                        </span>
                      )}
                    </div>
                  )}

                  {/* start_date */}
                  {currStep === 5 && (
                    <div className="space-y-1">
                      <Label>When do you plan to start?</Label>
                      <Controller
                        control={control}
                        rules={{ required: "required*" }}
                        name="start_date"
                        render={({ field }) => (
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="flex items-center justify-start gap-2"
                            value={field.value}
                          >
                            {[
                              "immediately",
                              "not sure, just want to look at options",
                              "within a month",
                            ].map((ele, key) => (
                              <div
                                className={cn(
                                  "flex cursor-pointer items-center space-x-2 rounded border p-2",
                                  {
                                    "border-primary-200 bg-primary-50":
                                      field.value === ele,
                                  },
                                )}
                                key={ele}
                              >
                                <RadioGroupItem value={ele} id={ele} />
                                <Label htmlFor={ele} className="capitalize">
                                  {ele}
                                </Label>
                              </div>
                            ))}
                          </RadioGroup>
                        )}
                      />
                      {errors.start_date && (
                        <span className="text-sm text-red-500">
                          {errors.start_date.message}
                        </span>
                      )}
                    </div>
                  )}

                  {/* boards */}
                  {data?.is_boards && currStep === 6 && (
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
                  {data?.is_boards && currStep === 7 && (
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
                      currStep === (data.is_boards ? 2 + key + 6 : key + 6) && (
                        <div className="space-y-4" key={key}>
                          <div className="mt-3 space-y-4">
                            <div className="text-sm font-medium capitalize">
                              {field.questionForStudent}
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
              <div className="flex-1 space-y-4">
                <H5 className={"text-center"}>Profile Picture</H5>
                {!media.profile_picture && (
                  <div className="flex flex-col items-center justify-center">
                    <Input
                      type="file"
                      placeholder="Select Profile Picture"
                      {...register("profile_picture", {
                        required: "Required*",
                      })}
                      onChange={(e) => handleFileChange(e, "profile_picture")}
                      multiple={false}
                      accept="image/png, image/webp, image/jpg, image/jpeg"
                    />
                    {errors.profile_picture && (
                      <span className="text-sm text-red-500">
                        {errors.profile_picture.message}
                      </span>
                    )}
                  </div>
                )}

                <div className="flex items-center justify-center gap-4 rounded-lg border border-dashed border-gray-300 p-8">
                  {isLoading.profile && (
                    <Progress
                      id="file"
                      value={progress.profile}
                      max="100"
                    >{`${progress.profile}%`}</Progress>
                  )}
                  {media.profile_picture ? (
                    <figure className="relative aspect-square size-32">
                      <Image
                        src={media.profile_picture}
                        className="h-full w-full"
                        width={200}
                        height={200}
                        alt="profile"
                      ></Image>
                      <Button
                        type="button"
                        variant="destructive"
                        onClick={() =>
                          deleteFile(media.profile_picture, "profile_picture")
                        }
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

              <div>
                <H5 className={"text-center"}>Academic details</H5>
                <div className="space-y-8">
                  {academicDetails.map((item, ind) => (
                    <div
                      key={item.id}
                      className="relative grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-4 rounded-lg border p-3"
                    >
                      {academicDetails?.length > 1 && (
                        <Button
                          type="button"
                          size="icon"
                          className="absolute -right-4 -top-4"
                          variant="destructive"
                          onClick={() => remove(ind)}
                        >
                          <Trash size={20} />
                        </Button>
                      )}
                      <div className="col-span-full">
                        <Label>University or Institution Name</Label>
                        <Input
                          type="text"
                          {...register(
                            `academic_details.${ind}.institution_name`,
                            {
                              required: "required*",
                            },
                          )}
                          placeholder="Enter University or Institution Name"
                        />
                        {errors.academic_details?.[ind]?.institution_name && (
                          <span className="text-red-500">
                            {
                              errors.academic_details?.[ind]?.institution_name
                                ?.message
                            }
                          </span>
                        )}
                      </div>
                      <div>
                        <Label>Program</Label>
                        <Input
                          type="text"
                          {...register(`academic_details.${ind}.program`, {
                            required: "required*",
                          })}
                          placeholder="Enter program e.g: Class 9th, Class 10th, BCA, MCA etc."
                        />
                        {errors.academic_details?.[ind]?.program && (
                          <span className="text-red-500">
                            {errors.academic_details?.[ind]?.program?.message}
                          </span>
                        )}
                      </div>
                      <div>
                        <Label>Year</Label>
                        <Input
                          type="number"
                          {...register(`academic_details.${ind}.year`, {
                            required: "required*",
                            valueAsNumber: true,
                          })}
                          placeholder="Enter Year"
                        />
                        {errors.academic_details?.[ind]?.year && (
                          <span className="text-red-500">
                            {errors.academic_details?.[ind]?.year?.message}
                          </span>
                        )}
                      </div>
                      <div>
                        <Label>Grades</Label>
                        <Input
                          type="number"
                          {...register(`academic_details.${ind}.grades`, {
                            required: "required*",
                          })}
                          placeholder="Enter Grades e.g: A+, B+"
                        />
                        {errors.academic_details?.[ind]?.grades && (
                          <span className="text-red-500">
                            {errors.academic_details?.[ind]?.grades?.message}
                          </span>
                        )}
                      </div>
                      <div>
                        <Label>Status</Label>
                        <Controller
                          control={control}
                          name={`academic_details.${ind}.status`}
                          rules={{ required: "required*" }}
                          render={({ field }) => (
                            <Select
                              value={field.value}
                              onValueChange={field.onChange}
                            >
                              <SelectTrigger className="">
                                <SelectValue placeholder="Select status" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="current">Current</SelectItem>
                                <SelectItem value="previous">
                                  Previous
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          )}
                        />
                        {errors.academic_details?.[ind]?.status && (
                          <span className="text-red-500">
                            {errors.academic_details?.[ind]?.status?.message}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-2 text-right">
                  <Button
                    type="button"
                    className="h-6"
                    variant="outline"
                    onClick={() =>
                      append({
                        institution_name: "",
                        program: "",
                        year: "",
                        grades: "",
                        status: "",
                      })
                    }
                  >
                    <PlusIcon size={15} /> Add more
                  </Button>
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
                    <Image
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
