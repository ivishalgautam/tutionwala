import React, { useEffect, useState } from "react";
import { H5 } from "../ui/typography";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import http from "@/utils/http";
import { endpoints } from "@/utils/endpoints";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { Plus, Trash, TrashIcon } from "lucide-react";
import { Progress } from "../ui/progress";
import Image from "next/image";
import { Textarea } from "../ui/textarea";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import axios from "axios";
import useLocalStorage from "@/hooks/useLocalStorage";
// import { languages } from "@/data/languages";

const fetchProfile = async (id) => {
  const { data } = await http().get(
    `${endpoints.tutor.getAll}/getByUser/${id}`,
  );
  return data;
};

export default function TutorProfileForm({ user }) {
  const [media, setMedia] = useState({
    profile_picture: "",
    video: "",
  });
  const [progress, setProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
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
  console.log({ tutor });
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
      router.push("/dashboard/profile");
    },
    onError: (error) => {
      toast.error(error?.message ?? "error");
    },
  });

  const handleFileChange = async (event, type) => {
    setIsLoading(true);
    try {
      const selectedFiles = event.target.files[0];
      const formData = new FormData();
      formData.append("file", selectedFiles);
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
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="space-y-4">
        <H5>Personal Information</H5>
        <div className="space-y-4 divide-y *:py-4">
          {/* media */}
          <div className="flex items-start justify-center gap-4">
            {/* profile pic */}
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
