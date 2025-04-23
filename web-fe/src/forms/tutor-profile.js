import { useEffect, useState } from "react";
import { H5, H6, Muted } from "../components/ui/typography";
import { Label } from "../components/ui/label";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { useRouter } from "next/navigation";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import http from "@/utils/http";
import { endpoints } from "@/utils/endpoints";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { Plus, Trash, TrashIcon } from "lucide-react";
import { Progress } from "../components/ui/progress";
import Image from "next/image";
import { Textarea } from "../components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "../components/ui/radio-group";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import axios from "axios";
import useLocalStorage from "@/hooks/useLocalStorage";
import ShadcnSelect from "../components/ui/shadcn-select";
import { languages as languageOptions } from "@/data/languages";
import { courses } from "@/data/courses";
import { MAX_WORD, validateWordLimit } from "./complete-profile-tutor";
import Loading from "@/components/loading";

const fetchProfile = async (id) => {
  const { data } = await http().get(
    `${endpoints.tutor.getAll}/getByUser/${id}`,
  );
  return data;
};

export default function TutorProfileForm({ user, setUser }) {
  const [mediaError, setMediaError] = useState({
    video: false,
    profile: false,
  });
  const [media, setMedia] = useState({
    profile_picture: "",
    video: "",
  });
  const [progress, setProgress] = useState({ profile: 0, video: 0 });
  const [isLoading, setIsLoading] = useState({ profile: false, video: false });
  const router = useRouter();
  const [token] = useLocalStorage("token");

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    control,
    watch,
  } = useForm({
    defaultValues: {
      profile_picture: "",
      class_conduct_mode: "",
      experience: "",
      intro_video: "",
      languages: "",
    },
  });
  const degree = watch("degree");
  const [, rerender] = useState(false);
  const {
    data: tutor,
    isLoading: isTutorLoading,
    isError,
    error,
  } = useQuery({
    queryKey: [`tutor-${user.id}`],
    queryFn: () => fetchProfile(user.id),
    enabled: !!user.id,
  });
  const {
    fields: languages,
    append: appendLang,
    remove: removeLang,
  } = useFieldArray({
    control,
    name: "languages",
  });

  const updateMutation = useMutation({
    mutationFn: async (data) => {
      return await http().put(`${endpoints.tutor.getAll}/${tutor.id}`, data);
    },
    onSuccess: (data) => {
      toast.success(data?.message ?? "Updated successfully.");
    },
    onError: (error) => {
      toast.error(error?.message ?? "error");
    },
  });

  const handleFileChange = async (event, type) => {
    setIsLoading((prev) => ({
      ...prev,
      ...(type === "video" ? { video: true } : { profile: true }),
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
            ...(type === "video" ? { video: progress } : { profile: progress }),
          }));
        },
      });

      const fileurl = url.split("?")[0];

      if (type === "profile_picture") {
        setMedia((prev) => ({ ...prev, profile_picture: fileurl }));
        localStorage.setItem("profile_picture", fileurl);
        updateMutation.mutate({ profile_picture: fileurl });
        setUser({ ...user, profile_picture: fileurl });
      } else {
        setMedia((prev) => ({ ...prev, video: fileurl }));
        localStorage.setItem("video", fileurl);
        updateMutation.mutate({ intro_video: fileurl });
        setUser({ ...user, video: fileurl });
      }
    } catch (error) {
      console.error("Error uploading image: ", error);
    } finally {
      setIsLoading((prev) => ({
        ...prev,
        ...(type === "video" ? { video: false } : { profile: false }),
      }));
      setProgress((prev) => ({
        ...prev,
        ...(type === "video" ? { video: 0 } : { profile: 0 }),
      }));
    }
  };

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
        setUser({ ...user, profile_picture: "" });
        updateMutation.mutate({ profile_picture: "" });
      }

      if (type === "video") {
        setMedia((prev) => ({ ...prev, video: "" }));
        localStorage.removeItem("video");
        setValue("video", "");
        setUser({ ...user, video: "" });
        updateMutation.mutate({ intro_video: "" });
      }
    } catch (error) {
      // console.log(error);
      return toast.error(error?.message ?? "Error deleting image");
    }
  };

  useEffect(() => {
    if (tutor) {
      setMedia((prev) => ({
        ...prev,
        video: tutor.intro_video,
        profile_picture: tutor.profile_picture,
      }));
      setValue("class_conduct_mode", tutor.class_conduct_mode);
      setValue("experience", tutor.experience);
      setValue("languages", tutor.languages);
      setValue("preference", tutor.preference);
      setValue("start_date", tutor.start_date);
      setValue("type", tutor.type);
      setValue("availability", tutor.availability);
      setValue("enquiry_radius", tutor.enquiry_radius);
      setValue("degree", tutor.degree);
      rerender(true);
    }
  }, [tutor, setValue]);
  console.log({ tutor });
  const onSubmit = (data) => {
    const payload = {
      profile_picture: media.profile_picture,
      intro_video: media.video,
      class_conduct_mode: data.class_conduct_mode,
      experience: data.experience,
      languages: data.languages,
      preference: data.preference,
      start_date: data.start_date,
      type: data.type,
      availability: data.availability,
      enquiry_radius: data.enquiry_radius,
      degree: data.degree,
    };

    updateMutation.mutate(payload);
    router.push("/dashboard/profile");
  };
  const experience = watch("experience", "");

  if (isTutorLoading) return <Loading />;

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="space-y-4">
        <H5>Personal Information</H5>
        <div className="space-y-4 divide-y *:py-4">
          {/* media */}
          <div className="space-y-4">
            {/* profile pic */}
            <div className="space-y-4">
              <H5>Profile Picture</H5>
              {!media.profile_picture && (
                <div className="flex flex-col items-start justify-center">
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
                  <Muted className={"text-xs"}>
                    PNG, JPG, WEBP (max. 2MB), Size: 1:1
                  </Muted>
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
                      className="h-full w-full rounded-md"
                      width={200}
                      height={200}
                      alt="profile"
                      onError={(err) => {
                        setMediaError((prev) => ({ ...prev, profile: true }));
                        setMedia((prev) => ({ ...prev, profile: "" }));
                      }}
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
            <div className="space-y-4">
              <H5>Intro Video</H5>
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
                {!mediaError.video && media.video ? (
                  <div className="relative w-max">
                    <video
                      src={media.video}
                      loop
                      muted
                      controls
                      className="aspect-video w-96 rounded-md"
                      onError={(error) => {
                        setMediaError((prev) => ({ ...prev, video: true }));
                        setMedia((prev) => ({ ...prev, video: "" }));
                      }}
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

          {/* experience */}
          <div className="">
            <Label>Experience</Label>
            <div>
              <p className="mt-1 text-end text-sm text-gray-500">
                Word Count: {experience?.trim().split(/\s+/).length} /{" "}
                {MAX_WORD}
              </p>
              <Textarea
                {...register("experience", {
                  required: "Required*",
                  validate: validateWordLimit,
                })}
                placeholder="Enter background and experience"
                className="h-[220px]"
              />
            </div>
            {errors.experience && (
              <span className="text-sm text-red-500">
                {errors.experience.message}
              </span>
            )}
          </div>

          {/* languages */}
          <div>
            <Label>Languages</Label>
            {languages.map((language, ind) => (
              <div key={ind} className="flex items-end justify-start gap-2">
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
                          <SelectItem value="proficient">Proficient</SelectItem>
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

              {degree?.name !== "other" && (
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
                            <SelectItem value="pursuing">Pursuing</SelectItem>
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
              )}

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

              {/* other */}
              {degree?.name === "other" && (
                <div>
                  <Label>Other</Label>
                  <Input
                    type="text"
                    {...register("degree.other", {
                      required: "required*",
                    })}
                    placeholder="Enter other"
                  />
                  {errors.degree?.other && (
                    <span className="text-sm text-red-500">
                      {errors.degree?.other.message}
                    </span>
                  )}
                </div>
              )}
            </div>
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
            <Label>Are you providing for Private or Group Classes?</Label>
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
            <Label>What days are you generally available to Classes?</Label>
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
        </div>
        <div className="text-right">
          <Button>Submit</Button>
        </div>
      </div>
    </form>
  );
}
