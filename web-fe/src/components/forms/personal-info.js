import { H5 } from "../ui/typography";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useForm } from "react-hook-form";
import http from "@/utils/http";
import { endpoints } from "@/utils/endpoints";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const updateProfile = async (data) => {
  return await http().put(`${endpoints.users.getAll}/${data.id}`, data);
};

export default function PersonalInfoForm({ user, setUser }) {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      id: user?.id,
      fullname: user?.fullname ?? "",
      email: user?.email ?? "",
    },
  });

  const updateMutation = useMutation({
    mutationKey: [`update-user-${user?.id}`],
    mutationFn: updateProfile,
    onSuccess: (data) => {
      toast.success(data?.message ?? "Updated successfully.");
      router.push("/dashboard/profile");
    },
    onError: (error) => {
      toast.error(error?.message ?? "error");
    },
    onMutate: (data) => {
      setUser({ ...user, fullname: data.fullname });
    },
  });

  const onSubmit = (data) => {
    updateMutation.mutate(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="space-y-4">
        <H5>Personal Information</H5>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <Label>Fullname</Label>
            <Input
              type="text"
              {...register("fullname", { required: "required*" })}
              placeholder={"Enter Fullname"}
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
        </div>
        <div className="text-right">
          <Button>Submit</Button>
        </div>
      </div>
    </form>
  );
}
