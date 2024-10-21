"use client";
import CompleteProfileTutor from "@/components/forms/complete-profile-tutor";
import { MainContext } from "@/store/context";
import { endpoints } from "@/utils/endpoints";
import http from "@/utils/http";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useContext, useState } from "react";
import { toast } from "sonner";

async function createTutorProfile(data) {
  return http().put(`${endpoints.tutor.getAll}/${data.tutor_id}`, data);
}

export default function Page() {
  const [currStep, setCurrStep] = useState(null);
  const router = useRouter();
  const { user } = useContext(MainContext);
  const id = user?.sub_categories?.[0]?.id;

  const queryClient = useQueryClient();

  const createMutation = useMutation(createTutorProfile, {
    onSuccess: (data) => {
      toast.success("submitted");
      queryClient.invalidateQueries([`subCategory-${id}`]);
    },
    onError: (error) => {
      console.log({ error });
    },
  });

  const handleCreate = (data) => {
    createMutation.mutate(data);
  };

  return (
    <CompleteProfileTutor
      handleCreate={handleCreate}
      id={id}
      currStep={currStep}
      setCurrStep={setCurrStep}
    />
  );
}
