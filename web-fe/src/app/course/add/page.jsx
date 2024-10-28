"use client";
import CreateCourse from "@/forms/create-course";
import { endpoints } from "@/utils/endpoints";
import http from "@/utils/http";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const createCourse = async (data) => {
  return await http().post(endpoints.tutor.courses, data);
};

export default function Page() {
  const router = useRouter();
  const createMutation = useMutation({
    mutationFn: createCourse,
    onSuccess: (data) => {
      toast.success(data?.message ?? "Added");
      router.push("/dashboard/courses");
    },
    onError: (error) => {
      toast.error(error?.message ?? "Error creating!");
    },
  });

  const handleCreate = (data) => {
    createMutation.mutate(data);
  };

  return (
    <div className="p-8">
      <CreateCourse handleCreate={handleCreate} />
    </div>
  );
}
