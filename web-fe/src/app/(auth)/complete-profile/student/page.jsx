"use client";
import CompleteProfileStudent from "@/components/forms/complete-profile-student";
import { MainContext } from "@/store/context";
import { endpoints } from "@/utils/endpoints";
import http from "@/utils/http";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useContext, useState } from "react";
import { toast } from "sonner";

async function createStudentProfile(data) {
  return http().put(`${endpoints.student.getAll}/${data.student_id}`, data);
}
export default function Page() {
  const [currStep, setCurrStep] = useState(1);
  const [profileStep, setProfileStep] = useState(null);
  const queryClient = useQueryClient();
  const router = useRouter();
  const { user } = useContext(MainContext);
  const id = user?.sub_categories?.[0]?.id;

  const createMutation = useMutation(createStudentProfile, {
    onSuccess: (data) => {
      toast.success("submitted");
      queryClient.invalidateQueries([`subCategory-${id}`]);
      console.log({ profileStep });
      if (profileStep === 2) {
        router.replace("/");
      }
    },
    onError: (error) => {
      console.log({ error });
    },
  });
  const handleCreate = (data) => {
    createMutation.mutate(data);
  };

  return (
    <CompleteProfileStudent
      handleCreate={handleCreate}
      id={id}
      currStep={currStep}
      setCurrStep={setCurrStep}
      profileStep={profileStep}
      setProfileStep={setProfileStep}
    />
  );
}
