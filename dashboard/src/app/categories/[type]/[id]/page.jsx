"use client";
import Section from "@/components/section";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { CategoryForm } from "@/components/forms/Category";
import { updateCategory } from "@/server/category";

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
      toast(error?.message ?? "Something went wrong!");
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
