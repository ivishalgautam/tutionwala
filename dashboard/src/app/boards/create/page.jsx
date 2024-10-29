"use client";
import { BoardForm } from "@/components/forms/board";
import { createBoard } from "@/server/boards";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import React from "react";
import { toast } from "sonner";

export default function Page() {
  const queryClient = useQueryClient();
  const router = useRouter();

  const createMutation = useMutation(createBoard, {
    onSuccess: () => {
      toast.success("Board added.");
      queryClient.invalidateQueries({ queryKey: ["boards"] });
      router.replace("/boards");
    },
    onError: (error) => {
      toast.error(error.message ?? "Error adding board");
    },
  });
  const handleCreate = async (data) => {
    createMutation.mutate(data);
  };

  return (
    <div className="border-input container mx-auto rounded-lg bg-white p-8">
      {/* <Heading title="Create Board" description="Add board and subjects" /> */}
      <BoardForm handleCreate={handleCreate} type={"create"} />
    </div>
  );
}
