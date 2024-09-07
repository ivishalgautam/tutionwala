"use client";
import Section from "@/components/section";
import React from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import http from "@/utils/http";
import { endpoints } from "@/utils/endpoints";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { SubCategoryForm } from "@/components/forms/sub-category";

async function updateSubCategory(data) {
  return http().put(`${endpoints.subCategories.getAll}/${data.id}`, data);
}
export default function Page({ params: { type, id } }) {
  const queryClient = useQueryClient();
  const router = useRouter();

  const updateMutation = useMutation(updateSubCategory, {
    onSuccess: () => {
      toast.success("Sub category updated.");
      queryClient.invalidateQueries({ queryKey: ["sub-categories"] });
      router.push("/sub-categories");
    },
    onError: (error) => {
      toast(error.message ?? "Error updating.");
    },
  });
  const handleUpdate = async (data) => {
    updateMutation.mutate({ ...data, id: id });
  };
  return (
    <Section className={"bg-transparent p-4"}>
      <SubCategoryForm
        type={type}
        subCategoryId={id}
        handleUpdate={handleUpdate}
      />
    </Section>
  );
}
