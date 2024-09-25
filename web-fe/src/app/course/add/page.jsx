"use client";
import CreateCourse from "@/components/forms/create-course";
import { endpoints } from "@/utils/endpoints";
import http from "@/utils/http";
import { useMutation } from "@tanstack/react-query";
import React from "react";
import { toast } from "sonner";

const createCourse = async (data) => {
  return await http().post(endpoints.tutor.courses, data);
};

export default function Page() {
  const createMutation = useMutation({
    mutationFn: createCourse,
    onSuccess: (data) => {
      toast.success(data?.message ?? "Added");
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
