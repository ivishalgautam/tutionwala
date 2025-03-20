"use client";
import CompleteProfileStudent from "@/forms/complete-profile-student";
import { MainContext } from "@/store/context";
import { endpoints } from "@/utils/endpoints";
import http from "@/utils/http";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useContext, useState } from "react";
import { toast } from "sonner";

const fetchSubCategory = async (id) => {
  const { data } = await http().get(
    `${endpoints.subCategories.getAll}/getById/${id}`,
  );
  return data;
};
async function createStudentProfile(data) {
  return http().put(`${endpoints.student.getAll}/${data.student_id}`, data);
}
export default function Page() {
  const [currStep, setCurrStep] = useState(1);
  const [profileStep, setProfileStep] = useState(null);
  const router = useRouter();
  const { user } = useContext(MainContext);
  const id = user?.sub_categories?.[0]?.id;
  const slug = user?.sub_categories?.[0]?.slug;

  const {
    data,
    isLoading: categoryLoading,
    refetch,
  } = useQuery({
    queryKey: ["details"],
    queryFn: () => fetchSubCategory(id),
    enabled: !!id,
  });
  console.log({ data });
  const createMutation = useMutation(createStudentProfile, {
    onSuccess: (data) => {
      toast.success("submitted");
      if (profileStep === 2) {
        router.replace("/dashboard/profile");
      }
    },
    onError: (error) => {
      console.log({ error });
    },
    onSettled: () => {
      refetch();
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
      subCatSlug={slug}
      data={data}
      categoryLoading={categoryLoading}
    />
  );
}
