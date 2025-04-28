import { H5, Muted } from "../components/ui/typography";
import { Label } from "../components/ui/label";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { useForm } from "react-hook-form";
import http from "@/utils/http";
import { endpoints } from "@/utils/endpoints";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useEffect, useState } from "react";
import { Trash } from "lucide-react";
import Image from "next/image";
import { Progress } from "@/components/ui/progress";
import axios from "axios";

const updateProfile = async (data) => {
  return await http().put(`${endpoints.users.getAll}/${data.id}`, data);
};

const deleteProfile = async () => {
  return await http().delete(`${endpoints.users.getAll}/delete-account`);
};

const fetchProfile = async (id) => {
  const { data } = await http().get(
    `${endpoints.student.getAll}/getByUser/${id}`,
  );
  return data;
};

export default function PersonalInfoForm({ user, setUser }) {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const [media, setMedia] = useState({
    profile_picture: "",
  });
  const [progress, setProgress] = useState({ profile: 0 });
  const [isLoading, setIsLoading] = useState({ profile: false });

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    defaultValues: {
      id: user?.id,
      fullname: user?.fullname ?? "",
      father_name: user?.father_name ?? "",
      email: user?.email ?? "",
      profile_picture: user?.profile_picture ?? "",
      dob: user?.dob ?? null,
    },
  });

  const {
    data: student,
    isLoading: isStudentLoading,
    isError,
    error,
  } = useQuery({
    queryKey: [`student-${user?.id}`],
    queryFn: () => fetchProfile(user.id),
    enabled: !!user?.id && user?.role === "student",
  });

  const updateMutation = useMutation({
    mutationFn: updateProfile,
    onSuccess: (data) => {
      toast.success(data?.message ?? "Updated successfully.");
      // router.push("/dashboard/profile");
    },
    onError: (error) => {
      toast.error(error?.message ?? "error");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteProfile,
    onSuccess: (data) => {
      setUser();
      toast.success(data?.message ?? "Account deleted successfully.");
      router.replace("/");
      localStorage.clear();
    },
    onError: (error) =>
      toast.error(error?.response?.data?.message ?? error?.message ?? "error"),
  });

  const handleFileChange = async (event, type) => {
    setIsLoading((prev) => ({ ...prev, profile: true }));
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
            profile: progress,
          }));
        },
      });

      const fileurl = url.split("?")[0];

      if (type === "profile_picture") {
        setUser({ ...user, profile_picture: fileurl });
        setMedia({ profile_picture: fileurl });
        localStorage.setItem("profile_picture", fileurl);
        updateMutation.mutate({ id: user.id, profile_picture: fileurl });
      }
    } catch (error) {
      console.error("Error uploading image: ", error);
    } finally {
      setIsLoading({ profile: false });
      setProgress({ profile: 0 });
    }
  };

  const deleteFile = async (filePath, type) => {
    const key = filePath.split(".com/")[1];
    try {
      const resp = await http().delete(
        `${endpoints.files.deleteKey}?key=${key}`,
      );
      // toast.success(resp?.message);

      if (type === "profile_picture") {
        setMedia((prev) => ({ ...prev, profile_picture: "" }));
        localStorage.removeItem("profile_picture");
        setValue("profile_picture", "");
        setUser({ ...user, profile_picture: "" });
        updateMutation.mutate({ id: user.id, profile_picture: "" });
      }
    } catch (error) {
      return toast.error(error?.message ?? "Error deleting image");
    }
  };

  useEffect(() => {
    if (user && user.role === "student" && student)
      setMedia((prev) => ({
        ...prev,
        profile_picture: user.profile_picture,
      }));
  }, [user, student]);

  const onSubmit = (data) => {
    const payload = {
      id: data.id,
      dob: data.dob,
      email: data.email,
      father_name: data.father_name,
      fullname: data.fullname,
    };
    updateMutation.mutate(payload);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="space-y-4">
        <H5>Personal Information</H5>
        <div className="grid grid-cols-2 gap-2">
          {user?.role === "student" && (
            <div className="col-span-2 space-y-4">
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
                        setMediaError({ profile: true });
                        setMedia({ profile: "" });
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
          )}

          <div>
            <Label>Fullname</Label>
            <Input
              type="text"
              {...register("fullname", { required: "required*" })}
              placeholder={"Enter Fullname"}
              disabled
            />
            {errors.fullname && (
              <span className="text-red-500">{errors.fullname.message}</span>
            )}
          </div>

          <div>
            <Label>Email</Label>
            <Input
              type="text"
              {...register("email", { required: "required*" })}
              placeholder={"Enter Email"}
              disabled
            />
            {errors.email && (
              <span className="text-red-500">{errors.email.message}</span>
            )}
          </div>

          <div>
            <Label>Father name</Label>
            <Input
              type="text"
              {...register("father_name", { required: "required*" })}
              placeholder={"Enter father name"}
            />
            {errors.father_name && (
              <span className="text-red-500">{errors.father_name.message}</span>
            )}
          </div>
          <div>
            <Label>DOB</Label>
            <Input
              type="date"
              {...register("dob")}
              placeholder={"Select DOB"}
            />
          </div>
        </div>
        <div className="flex items-center justify-between">
          <Button
            type="button"
            variant="destructive"
            onClick={() => setOpen(true)}
          >
            Delete Account
          </Button>
          <Button>Submit</Button>
        </div>
      </div>

      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              account and remove your data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-500 text-white hover:bg-red-500/80 hover:text-white"
              onClick={() => deleteMutation.mutate()}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </form>
  );
}
