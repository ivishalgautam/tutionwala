import { useEffect, useState } from "react";
import { H5 } from "../components/ui/typography";
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
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import axios from "axios";
import useLocalStorage from "@/hooks/useLocalStorage";
import ShadcnSelect from "../components/ui/shadcn-select";
import { languages as languageOptions } from "@/data/languages";

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
  } = useForm({
    defaultValues: {
      profile_picture: "",
      class_conduct_mode: "",
      experience: "",
      intro_video: "",
      languages: "",
    },
  });

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
    }
  }, [tutor, setValue]);

  const onSubmit = (data) => {
    const payload = {
      profile_picture: media.profile_picture,
      intro_video: media.video,
      class_conduct_mode: data.class_conduct_mode,
      experience: data.experience,
      languages: data.languages,
    };

    updateMutation.mutate(payload);
    router.push("/dashboard/profile");
  };

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

          {/* counduct classes */}
          <div className="space-y-1">
            <Label>How will you conduct class?</Label>
            <Controller
              control={control}
              rules={{ required: "required*" }}
              name="class_conduct_mode"
              render={({ field }) => (
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex items-center justify-start gap-2"
                  value={field.value}
                >
                  {["offline", "online", "nearby", "any"].map((ele, key) => (
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
            {errors.class_conduct_mode && (
              <span className="text-sm text-red-500">
                {errors.class_conduct_mode.message}
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
        </div>
        <div className="text-right">
          <Button>Submit</Button>
        </div>
      </div>
    </form>
  );
}
