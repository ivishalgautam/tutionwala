"use client";
import Loading from "@/components/loading";
import Stepper from "@/components/stepper";
import { Button } from "@/components/ui/button";
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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { H3, H5, H6 } from "@/components/ui/typography";
import useLocalStorage from "@/hooks/useLocalStorage";
import { cn } from "@/lib/utils";
import { endpoints } from "@/utils/endpoints";
import http from "@/utils/http";
import { CaretSortIcon } from "@radix-ui/react-icons";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { CheckIcon, Plus, Trash, TrashIcon } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";
import { Progress } from "../components/ui/progress";
import { RadioGroup, RadioGroupItem } from "../components/ui/radio-group";
import { getCurrentCoords } from "@/lib/get-current-coords";
import { Checkbox } from "../components/ui/checkbox";
import { useRouter } from "next/navigation";
import ShadcnSelect from "../components/ui/shadcn-select";
import { languages as languageOptions } from "@/data/languages";
import { courses } from "@/data/courses";

const fetchSubCategory = async (id) => {
  const { data } = await http().get(
    `${endpoints.subCategories.getAll}/getById/${id}`,
  );
  return data;
};

export default function CompleteProfileTutor({
  handleCreate,
  id,
  currStep,
  setCurrStep,
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
      // step 1
      fields: [],
      boards: [],
      languages: [{ name: "", proficiency: "" }],
      degree: {
        name: "",
        year: "",
        status: "",
      },
      enquiry_radius: "",
      is_demo_class: false,
      preference: "no preference",
      availability: "anyday",
      start_date: "immediately",
      class_conduct_mode: [],
      selectedOnlineTypes: [],
      selectedOfflineTypes: [],
      selectedOfflineLocations: [],
      budgets: [],

      // step 2
      experience: "",
      intro_video: "",
      profile_picture: "",

      // step 3
      adhaar: "",
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

  const [media, setMedia] = useState({
    profile: "",
    adhaar: "",
    video: "",
  });
  const [progress, setProgress] = useState({ adhaar: 0, profile: 0, video: 0 });
  const [isLoading, setIsLoading] = useState({
    adhaar: false,
    profile: false,
    video: false,
  });
  const [coords, setCoords] = useState([0, 0]);
  const { token } = useLocalStorage("token");

  const {
    fields: languages,
    append: appendLang,
    remove: removeLang,
  } = useFieldArray({
    control,
    name: "languages",
  });

  const {
    data,
    isLoading: isSubCatLoading,
    isError,
    error,
    isFetching,
  } = useQuery({
    queryKey: [`subCategory-${id}`],
    queryFn: () => fetchSubCategory(id),
    enabled: !!id,
  });

  const boards = data ? data.boards : [];
  const boardNames = boards.map(({ board_name }) => board_name);
  const selectedBoards = watch("selected_boards") ?? [];
  const router = useRouter();

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

  const onSubmit = async (formData) => {
    const payload =
      currStep === 1
        ? {
            fields: formData.fields,
            boards: formData.boards,
            languages: formData.languages,
            degree: formData.degree,
            class_conduct_mode: formData.class_conduct_mode,
            enquiry_radius: formData.enquiry_radius,
            coords: coords,
            is_demo_class: formData.is_demo_class,
            preference: formData.preference,
            availability: formData.availability,
            start_date: formData.start_date,
            budgets: formData?.budgets ?? [],
          }
        : currStep === 2
          ? {
              experience: formData.experience,
              profile_picture: media.profile,
              intro_video: media.video,
            }
          : currStep === 3
            ? {
                adhaar: media.adhaar,
              }
            : null;

    handleCreate({ ...payload, tutor_id: data.tutor_id, curr_step: currStep });
    if (currStep === 3) {
      router.replace("/");
    }
  };

  const handleFileChange = async (event, type) => {
    setIsLoading((prev) => ({ ...prev, [type]: true }));
    try {
      const file = event.target.files[0];
      // const formData = new FormData();
      // formData.append("file", selectedFiles);
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
          setProgress((prev) => ({ ...prev, [type]: progress }));
        },
      });

      const fileurl = url.split("?")[0];
      if (type === "adhaar") {
        setMedia((prev) => ({ ...prev, adhaar: fileurl }));
        localStorage.setItem("adhaar", fileurl);
      }
      if (type === "profile") {
        setMedia((prev) => ({ ...prev, profile: fileurl }));
        localStorage.setItem("profile", fileurl);
      }
      if (type === "video") {
        setMedia((prev) => ({ ...prev, video: fileurl }));
        localStorage.setItem("video", fileurl);
      }
    } catch (error) {
      console.error("Error uploading image:", error);
    } finally {
      setIsLoading((prev) => ({ ...prev, [type]: false }));
      setProgress((prev) => ({ ...prev, [type]: 0 }));
    }
  };
  const deleteFile = async (filePath, type) => {
    // let key = filePath
    const key = filePath.split(".com/")[1];
    try {
      const resp = await http().delete(
        `${endpoints.files.deleteKey}?key=${key}`,
      );
      toast.success(resp?.message);

      if (type === "adhaar") {
        setMedia((prev) => ({ ...prev, adhaar: "" }));
        localStorage.removeItem("adhaar");
        setValue("adhaar", "");
      }
      if (type === "profile") {
        setMedia((prev) => ({ ...prev, profile: "" }));
        localStorage.removeItem("profile");
        setValue("profile", "");
      }
      if (type === "video") {
        setMedia((prev) => ({ ...prev, video: "" }));
        localStorage.removeItem("video");
        setValue("video", "");
      }
    } catch (error) {
      // console.log(error);
      return toast.error(error?.message ?? "Error deleting image");
    }
  };

  useEffect(() => {
    if (data) {
      setCurrStep(data.curr_step);
      if (data.curr_step !== 1) {
        unregister("languages");
      }
    }
  }, [data, unregister, setCurrStep]);

  useEffect(() => {
    async function getCoords() {
      const coords = await getCurrentCoords();
      setCoords(coords);
    }

    getCoords();
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const adhaar = window.localStorage.getItem("adhaar");
    const profile = window.localStorage.getItem("profile_picture");
    const video = window.localStorage.getItem("video");

    if (adhaar) {
      setValue("adhaar", adhaar);
      setMedia((prev) => ({ ...prev, adhaar: adhaar }));
    }
    if (profile) {
      setValue("profile_picture", profile);
      setMedia((prev) => ({ ...prev, profile_picture: profile }));
    }
    if (video) {
      setValue("intro_video", video);
      setMedia((prev) => ({ ...prev, video: video }));
    }
  }, [setValue]);

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
  if (isFetching && isSubCatLoading) return <Loading />;
  if (isError) return error?.message ?? "error";
  return (
    <div className={"space-y-4 p-8"}>
      <div className="mx-auto max-w-2xl space-y-2 rounded-lg bg-white p-6">
        <Stepper currStep={currStep} />
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* form 1 */}
          {currStep === 1 && (
            <div className="space-y-6">
              <H3 className={"text-center"}>Complete your profile</H3>
              <div className="space-y-4 divide-y *:pt-4">
                {/* language */}
                <div className="space-y-1">
                  <div>
                    <H6>Add languages that you speak.</H6>
                  </div>

                  {/* language */}
                  <div className="space-y-2">
                    {languages.map((language, ind) => (
                      <div
                        key={ind}
                        className="flex items-end justify-start gap-2"
                      >
                        <div className="flex-1">
                          <Label>Language</Label>
                          <div className="relative">
                            <Controller
                              control={control}
                              name={`languages.${ind}.name`}
                              render={({ field }) => (
                                <ShadcnSelect
                                  field={field}
                                  name={`languages.${ind}.name`}
                                  options={languageOptions}
                                  setValue={setValue}
                                  placeholder="Language"
                                  width="w-full"
                                />
                              )}
                            />
                          </div>
                          {errors?.languages?.[ind]?.name && (
                            <span className="text-sm text-red-500">
                              {errors?.languages[ind].name.message}
                            </span>
                          )}
                        </div>
                        <div className="flex-1">
                          <Label>Proficiency</Label>
                          <Controller
                            name={`languages.${ind}.proficiency`}
                            rules={{ required: "required*" }}
                            control={control}
                            render={({ field }) => (
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <SelectTrigger className="w-full">
                                  <SelectValue placeholder="Add proficiency" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="basic">Basic</SelectItem>
                                  <SelectItem value="proficient">
                                    Proficient
                                  </SelectItem>
                                  <SelectItem value="native">Native</SelectItem>
                                </SelectContent>
                              </Select>
                            )}
                          />
                          {errors?.languages?.[ind]?.proficiency && (
                            <span className="text-sm text-red-500">
                              {errors.languages[ind].proficiency.message}
                            </span>
                          )}
                        </div>
                        <Button
                          type="button"
                          size="icon"
                          variant="destructive"
                          onClick={() => removeLang(ind)}
                          disabled={languages.length === 1}
                        >
                          <TrashIcon size={20} />
                        </Button>
                      </div>
                    ))}
                  </div>

                  <div className="text-end">
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => appendLang({ name: "", proficiency: "" })}
                    >
                      <Plus size={15} /> Add more
                    </Button>
                  </div>
                </div>

                {/* most recent degree */}
                <div className="space-y-2">
                  <H6>Most recent degree</H6>
                  <div className="space-y-2">
                    {/* degree name */}
                    <div>
                      <Label>Name</Label>
                      <div>
                        <Controller
                          control={control}
                          name={`degree.name`}
                          render={({ field }) => (
                            <ShadcnSelect
                              field={field}
                              name={`degree.name`}
                              options={courses}
                              setValue={setValue}
                              placeholder="Course"
                              width="w-full"
                            />
                          )}
                        />
                      </div>
                      {errors.degree?.name && (
                        <span className="text-sm text-red-500">
                          {errors.degree?.name.message}
                        </span>
                      )}
                    </div>

                    <div>
                      <Label>Is degree completed?</Label>
                      <Controller
                        control={control}
                        name={`degree.status`}
                        rules={{ required: "required*" }}
                        render={({ field }) => (
                          <Select
                            defaultValue={field.value}
                            onValueChange={field.onChange}
                          >
                            <SelectTrigger className="">
                              <SelectValue placeholder="Select Status" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectGroup>
                                <SelectLabel>Status</SelectLabel>
                                <SelectItem value="yes">Yes</SelectItem>
                                <SelectItem value="pursuing">
                                  Pursuing
                                </SelectItem>
                              </SelectGroup>
                            </SelectContent>
                          </Select>
                        )}
                      />
                      {errors.degree?.status && (
                        <span className="text-sm text-red-500">
                          {errors.degree?.status.message}
                        </span>
                      )}
                    </div>

                    {/* degree completion year */}
                    {watch("degree.status") === "yes" && (
                      <div>
                        <Label>Year of completion</Label>
                        <Input
                          type="number"
                          {...register("degree.year", {
                            required: "required*",
                            max: {
                              value: 2099,
                              message: "Must be less than 2099",
                            },
                            min: {
                              value: 1900,
                              message: "Must be greater than 1900",
                            },
                          })}
                          placeholder="Enter completion year"
                        />
                        {errors.degree?.year && (
                          <span className="text-sm text-red-500">
                            {errors.degree?.year.message}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
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
                                      : field.value.filter(
                                          (val) => val !== mode,
                                        );
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
                          {["tutorPlace", "studentPlace", "other"].map(
                            (mode) => (
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
                                          : field.value.filter(
                                              (val) => val !== mode,
                                            );
                                        field.onChange(newValue);
                                      }}
                                    />
                                    <Label className="capitalize">{mode}</Label>
                                  </div>
                                )}
                              />
                            ),
                          )}
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

                {/* radius */}
                <div className="relative">
                  <Label>Enquiry radius under</Label>
                  <Input
                    type="number"
                    placeholder="Enter radius in km"
                    {...register("enquiry_radius", {
                      required: "required*",
                      valueAsNumber: true,
                      validate: (value) => {
                        if (value > 25) {
                          return "Radius should be under 25 km";
                        }
                      },
                    })}
                  />
                  <span className="absolute right-0 text-xs text-primary">
                    Max 25 km.
                  </span>

                  {errors.enquiry_radius && (
                    <span className="text-sm text-red-500">
                      {errors.enquiry_radius.message}
                    </span>
                  )}
                </div>

                {/* preference */}
                <div className="space-y-1">
                  <Label>Are you looking for Private or Group Classes?</Label>
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

                {/* availability */}
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
                        {["anyday", "weekday", "weekend"].map((ele, key) => (
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
                  {errors.availability && (
                    <span className="text-sm text-red-500">
                      {errors.availability.message}
                    </span>
                  )}
                </div>

                {/* start_date */}
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

                {/* board */}
                {data?.is_boards && (
                  <div>
                    <div className="text-sm font-medium">
                      Which {data?.name} boards do you teach?
                    </div>
                    <div className="space-y-1">
                      {boardNames.map((option) => (
                        <div key={option} className="text-sm text-gray-700">
                          <Label className="flex items-center justify-between">
                            <span className="font-normal uppercase">
                              {option}
                            </span>
                            <Input
                              type="checkbox"
                              value={option}
                              {...register("selected_boards", {
                                required: "required*",
                              })}
                              className="size-6 accent-primary"
                            />
                          </Label>
                        </div>
                      ))}
                      {errors.selected_boards && (
                        <span className="text-sm text-red-500">
                          {errors.selected_boards.message}
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* board subjects */}
                {data?.is_boards && watch("selected_boards")?.length > 0 && (
                  <div className="space-y-4">
                    {selectedBoards &&
                      Array.isArray(selectedBoards) &&
                      selectedBoards?.map((board, ind) => (
                        <div key={ind} className="space-y-2">
                          <div className="text-sm font-medium">
                            Which subjects of {data?.name} in {board} boards do
                            you teach?
                          </div>
                          <div className="space-y-1">
                            {boards
                              .find((item) => item.board_name === board)
                              ?.subjects.map((subject) => (
                                <div
                                  key={subject}
                                  className="text-sm text-gray-700"
                                >
                                  <Label className="flex items-center justify-between">
                                    <span className="capitalize">
                                      {subject}
                                    </span>
                                    <input
                                      type="checkbox"
                                      value={subject}
                                      className="size-6 accent-primary"
                                      {...register(
                                        `selected.${board}.subjects`,
                                        {
                                          required: "required*",
                                        },
                                      )}
                                      onChange={() => setBoards(board, subject)}
                                    />
                                  </Label>
                                </div>
                              ))}
                            {errors.selected?.[board]?.subjects && (
                              <span className="text-sm text-red-500">
                                {errors.selected?.[board]?.subjects?.message}
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                  </div>
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
                                      `selected.${item.fieldName}.options`,
                                      { required: "required*" },
                                    )}
                                    value={option}
                                    className="size-6 accent-primary"
                                    onClick={() =>
                                      setFields(
                                        item.fieldName,
                                        option,
                                        "checkbox",
                                      )
                                    }
                                  />
                                </Label>
                              </div>
                            ))}
                            {errors.selected?.[item.fieldName]?.options && (
                              <span className="text-sm text-red-500">
                                {
                                  errors.selected?.[item.fieldName]?.options
                                    ?.message
                                }
                              </span>
                            )}
                          </div>
                        )}
                        {item.fieldType === "radio" && (
                          <div className="space-y-1">
                            {item.options.map((option) => (
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
                                      `selected.${item.fieldName}.options`,
                                      { required: "required*" },
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
                            {errors.selected?.[item.fieldName]?.options && (
                              <span className="text-sm text-red-500">
                                {
                                  errors.selected?.[item.fieldName]?.options
                                    ?.message
                                }
                              </span>
                            )}
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
                                    <CommandEmpty>
                                      No option found.
                                    </CommandEmpty>
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
                                                    so.fieldName ===
                                                    item.fieldName,
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
          )}

          {/* form 2 */}
          {currStep === 2 && (
            <div className="space-y-4">
              <H5 className={"text-center"}>
                What is your background and experience ?
              </H5>

              <div>
                <Textarea
                  {...register("experience", {
                    required: "Required*",
                  })}
                  placeholder="Enter background and experience"
                  className="h-[220px]"
                />
                {errors.experience && (
                  <span className="text-sm text-red-500">
                    {errors.experience.message}
                  </span>
                )}
              </div>

              <div className="flex items-start justify-center gap-4">
                {/* profile pic */}
                <div className="flex-1 space-y-4">
                  <H5 className={"text-center"}>Profile Picture</H5>
                  {!media.profile && (
                    <div className="flex flex-col items-center justify-center">
                      <Input
                        type="file"
                        placeholder="Select Profile Picture"
                        {...register("profile_picture", {
                          required: "Required*",
                        })}
                        onChange={(e) => handleFileChange(e, "profile")}
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
                      >{`${progress}%`}</Progress>
                    )}
                    {media.profile ? (
                      <figure className="relative aspect-square size-32">
                        <Image
                          src={media.profile}
                          className="h-full w-full"
                          width={200}
                          height={200}
                          alt="profile"
                        ></Image>
                        <Button
                          type="button"
                          variant="destructive"
                          onClick={() => deleteFile(media.profile, "profile")}
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

                {/* intro video */}
                <div className="flex-1 space-y-4">
                  <H5 className={"text-center"}>Intro Video</H5>
                  {!media.video && (
                    <div className="flex flex-col items-center justify-center">
                      <Input
                        type="file"
                        placeholder="Select Intro video"
                        {...register("video")}
                        onChange={(e) => handleFileChange(e, "video")}
                        multiple={false}
                        accept=".mp4, .mkv"
                      />
                      {errors.video && (
                        <span className="text-sm text-red-500">
                          {errors.video.message}
                        </span>
                      )}
                    </div>
                  )}

                  <div className="flex items-center justify-center gap-4 rounded-lg border border-dashed border-gray-300 p-8">
                    {isLoading.video && (
                      <Progress
                        id="file"
                        value={progress.video}
                        max="100"
                      >{`${progress.video}%`}</Progress>
                    )}
                    {media.video ? (
                      <div className="relative w-max">
                        <video
                          src={media.video}
                          autoPlay
                          loop
                          muted
                          className="aspect-video w-44"
                        ></video>
                        <Button
                          type="button"
                          variant="destructive"
                          onClick={() => deleteFile(media.video, "video")}
                          className="absolute -right-2 -top-2"
                          size="icon"
                        >
                          <Trash size={20} />
                        </Button>
                      </div>
                    ) : (
                      <div>No file selected</div>
                    )}
                  </div>
                </div>
              </div>
              <div className="text-end">
                <Button>Submit</Button>
              </div>
            </div>
          )}

          {/* form 3 */}
          {currStep === 3 && (
            <div className="space-y-4 p-6">
              <H5 className={"text-center"}>Adhaar</H5>
              <div className="space-y-4">
                {!media.adhaar && (
                  <div className="flex flex-col items-center justify-center">
                    <Input
                      type="file"
                      placeholder="Select Adhaar Card"
                      {...register("adhaar", {
                        required: "Required*",
                      })}
                      onChange={(e) => handleFileChange(e, "adhaar")}
                      multiple={false}
                      accept="image/png, image/jpeg, image/jpg, image/webp"
                      className={`max-w-56 bg-primary text-white`}
                    />
                    {errors.adhaar && (
                      <span className="text-sm text-red-500">
                        {errors.adhaar.message}
                      </span>
                    )}
                  </div>
                )}

                <div className="flex items-center justify-center gap-4 rounded-lg border border-dashed border-gray-300 p-8">
                  {isLoading.adhaar && (
                    <Progress
                      id="file"
                      value={progress.adhaar}
                      max="100"
                    >{`${progress.adhaar}%`}</Progress>
                  )}
                  {media.adhaar ? (
                    <figure className="relative size-32">
                      <Image
                        src={media.adhaar}
                        width={500}
                        height={500}
                        alt="adhaar"
                        className="h-full w-full"
                        multiple={false}
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        onClick={() => deleteFile(media.adhaar, "adhaar")}
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
      </div>
    </div>
  );
}
