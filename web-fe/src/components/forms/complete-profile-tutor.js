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
  SelectItem,
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
import { Progress } from "../ui/progress";

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
    defaultValues:
      currStep === 1
        ? {
            fields: [],
            boards: [],
            languages: [{ name: "", proficiency: "" }],
          }
        : currStep === 2
          ? {
              experience: "",
              intro_video: "",
            }
          : currStep === 3
            ? {
                profile_picture: "",
                adhaar: "",
              }
            : null,
  });
  const [media, setMedia] = useState({
    profile_picture: "",
    adhaar: "",
    video: "",
  });
  const [progress, setProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
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
    console.log({ formData });
    const payload =
      currStep === 1
        ? {
            fields: formData.fields,
            boards: formData.boards,
            languages: formData.languages,
          }
        : currStep === 2
          ? {
              experience: formData.experience,
              profile_picture: media.profile_picture,
              intro_video: media.video,
            }
          : currStep === 3
            ? {
                adhaar: media.adhaar,
              }
            : null;

    handleCreate({ ...payload, tutor_id: data.tutor_id, curr_step: currStep });
  };

  const handleFileChange = async (event, type) => {
    setIsLoading(true);
    try {
      const selectedFiles = event.target.files[0];
      const formData = new FormData();
      formData.append("file", selectedFiles);
      console.log("formData=>", formData);
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}${endpoints.files.upload}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
          onUploadProgress: (progressEvent) => {
            const progress = parseInt(
              Math.round((progressEvent.loaded * 100) / progressEvent.total),
            );
            setProgress(progress);
          },
        },
      );

      const file = response.data[0];
      if (type === "adhaar") {
        setMedia((prev) => ({ ...prev, adhaar: file }));
        localStorage.setItem("adhaar", file);
      }
      if (type === "profile_picture") {
        setMedia((prev) => ({ ...prev, profile_picture: file }));
        localStorage.setItem("profile_picture", file);
      }
      if (type === "video") {
        setMedia((prev) => ({ ...prev, video: file }));
        localStorage.setItem("video", file);
      }
    } catch (error) {
      console.error("Error uploading image:", error);
    } finally {
      setIsLoading(false);
      setProgress(0);
    }
  };
  const deleteFile = async (filePath, type) => {
    try {
      const resp = await http().delete(
        `${endpoints.files.getFiles}?file_path=${filePath}`,
      );
      toast.success(resp?.message);

      if (type === "adhaar") {
        setMedia((prev) => ({ ...prev, adhaar: "" }));
        localStorage.removeItem("adhaar");
        setValue("adhaar", "");
      }
      if (type === "profile_picture") {
        setMedia((prev) => ({ ...prev, profile_picture: "" }));
        localStorage.removeItem("profile_picture");
        setValue("profile_picture", "");
      }
      if (type === "video") {
        setMedia((prev) => ({ ...prev, video: "" }));
        localStorage.removeItem("video");
        setValue("video", "");
      }
    } catch (error) {
      console.log(error);
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
  }, [data, unregister]);
  console.log(watch());

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
              <div className="space-y-4 divide-y">
                {/* language */}
                <div className="space-y-1">
                  <div>
                    <H6>Add languages that you speak.</H6>
                  </div>
                  <div>
                    {languages.map((language, ind) => (
                      <div
                        key={ind}
                        className="flex items-end justify-start gap-2"
                      >
                        <div className="flex-1">
                          <Label>Language</Label>
                          <Input
                            type="text"
                            {...register(`languages.${ind}.name`, {
                              required: "required*",
                            })}
                            placeholder="Eg: Hindi, English"
                          />
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
                          onClick={() => removeLang()}
                        >
                          <TrashIcon />
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

                {/* custom fields */}
                <div className="space-y-4">
                  {data.fields.map((item, ind) => (
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

                  <div className="flex items-center justify-center gap-4 rounded-lg border border-dashed border-gray-300 p-8">
                    {media.profile_picture ? (
                      <figure className="relative aspect-square size-32">
                        <Image
                          src={`${process.env.NEXT_PUBLIC_IMAGE_DOMAIN}/${media.profile_picture}`}
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

                {/* intro video */}
                <div className="flex-1 space-y-4">
                  <H5 className={"text-center"}>Intro Video</H5>
                  <div className="flex flex-col items-center justify-center">
                    <Input
                      type="file"
                      placeholder="Select Intro video"
                      {...register("video", {
                        required: "Required*",
                      })}
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

                  <div className="flex items-center justify-center gap-4 rounded-lg border border-dashed border-gray-300 p-8">
                    {isLoading && (
                      <Progress
                        id="file"
                        value={progress}
                        max="100"
                      >{`${progress}%`}</Progress>
                    )}
                    {media.video ? (
                      <div className="relative w-max">
                        <video
                          src={`${process.env.NEXT_PUBLIC_IMAGE_DOMAIN}/${media.video}`}
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
                  {media.adhaar ? (
                    <figure className="relative size-32">
                      <Image
                        src={`${process.env.NEXT_PUBLIC_IMAGE_DOMAIN}/${media.adhaar}`}
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
