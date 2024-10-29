"use client";
import Section from "@/components/section";
import React from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { SubCategoryForm } from "@/components/forms/sub-category";
import { useRouter } from "next/navigation";
import { createSubCategory } from "@/server/sub-category";

export default function Page() {
  const queryClient = useQueryClient();
  const router = useRouter();

  const createMutation = useMutation(createSubCategory, {
    onSuccess: (data) => {
      toast.success("New sub category added.");
      queryClient.invalidateQueries(["sub-categories"]);
      router.replace("/sub-categories");
    },
    onError: (error) => {
      toast.error(error.message ?? "Error creating sub category");
    },
  });

  const handleCreate = async (data) => {
    createMutation.mutate(data);
  };

  return (
    <Section className={"bg-transparent"}>
      <SubCategoryForm type={"create"} handleCreate={handleCreate} />
    </Section>
  );
}
