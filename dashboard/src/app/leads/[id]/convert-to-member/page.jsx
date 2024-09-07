"use client";
import CreateMemberForm from "@/components/forms/create-member";
import { endpoints } from "@/utils/endpoints";
import http from "@/utils/http";
import {
  QueryClient,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import React from "react";
import { toast } from "sonner";

async function createMember(data) {
  return http().post(
    `${endpoints.leads.getAll}/convertToCustomer/${data.lead_id}`,
    data,
  );
}

export default function Page({ params: { id } }) {
  const router = useRouter();
  const queryCLient = useQueryClient();
  const createMutation = useMutation(createMember, {
    onSuccess: (data) => {
      toast.success(data.message ?? "member created.");
      queryCLient.invalidateQueries({ queryKey: ["users"] });
      router.replace("/users");
    },
    onError: (error) => {
      console.log({ error });
      toast.error(error.message ?? "Failed to create member!");
    },
  });

  async function handleCreate(data) {
    createMutation.mutate(data);
  }

  return (
    <div>
      <CreateMemberForm
        type={"create"}
        leadId={id}
        handleCreate={handleCreate}
      />
    </div>
  );
}
