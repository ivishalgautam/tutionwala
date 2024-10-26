"use client";
import { BoardForm } from "@/components/forms/board";
import { Heading } from "@/components/ui/heading";
import { endpoints } from "@/utils/endpoints";
import http from "@/utils/http";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import React from "react";
import { toast } from "sonner";

async function createBoard(data) {
  return http().post(`${endpoints.boards.getAll}`, data);
}

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
