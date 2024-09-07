"use client";
import Section from "@/components/section";
import { endpoints } from "@/utils/endpoints";
import http from "@/utils/http";
import React from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { CategoryForm } from "@/components/forms/Category";

async function updateCategory(data) {
  return http().put(`${endpoints.categories.getAll}/${data.id}`, data);
}

export default function Page({ params: { type, id } }) {
  const queryClient = useQueryClient();
  const router = useRouter();

  const updateMutation = useMutation(updateCategory, {
    onSuccess: () => {
      toast.success("Category updated.");
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      router.push("/categories");
    },
    onError: (error) => {
      if (isObject(error)) {
        toast(error.message);
      } else {
        toast.error(error);
      }
    },
  });

  const handleUpdate = async (data) => {
    updateMutation.mutate({ ...data, id: id });
  };
  return (
    <Section>
      <CategoryForm type={type} categoryId={id} handleUpdate={handleUpdate} />
    </Section>
  );
}
