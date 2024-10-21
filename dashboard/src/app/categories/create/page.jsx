"use client";
import { CategoryForm } from "@/components/forms/Category";
import Section from "@/components/section";
import { endpoints } from "@/utils/endpoints";
import http from "@/utils/http";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

async function postCategory(data) {
  return http().post(endpoints.categories.getAll, data);
}

export default function Page() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const createMutation = useMutation(postCategory, {
    onSuccess: () => {
      toast.success("New category added.");
      queryClient.invalidateQueries("categories");
      router.replace("/categories");
    },
    onError: (error) => {
      toast.error(error.message ?? "Error creating category1");
    },
  });

  const handleCreate = async (data) => {
    createMutation.mutate(data);
  };
  return (
    <Section>
      <CategoryForm type={"create"} handleCreate={handleCreate} />
    </Section>
  );
}
