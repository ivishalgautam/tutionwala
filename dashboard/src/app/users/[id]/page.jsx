"use client";
import StudentForm from "@/components/forms/student";
import TutorForm from "@/components/forms/tutor";
import UserForm from "@/components/forms/user";
import { endpoints } from "@/utils/endpoints";
import http from "@/utils/http";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import React from "react";
import { toast } from "sonner";

export default function Page({ params: { role, id } }) {
  const router = useRouter();

  const updateMutation = useMutation({
    mutationFn: async (data) => {
      return await http().put(`${endpoints.users.getAll}/${id}`, data);
    },
    onSuccess: (data) => {
      toast.success("Updated");
      router.replace("/users");
    },
    onError: (error) => {
      console.log({ error });
    },
  });

  const handleUpdate = (data) => {
    updateMutation.mutate(data);
  };

  return (
    <div className="rounded-lg bg-white p-8">
      <UserForm handleUpdate={handleUpdate} type={"edit"} userId={id} />
    </div>
  );
}
