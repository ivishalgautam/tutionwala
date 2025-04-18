"use client";
import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useRouter, useSearchParams } from "next/navigation";

import { DataTable } from "@/components/ui/table/data-table";
import React from "react";
import { columns } from "../columns";
import { DataTableSkeleton } from "@/components/ui/table/data-table-skeleton";
import http from "@/utils/http";
import { endpoints } from "@/utils/endpoints";

async function fetchMyStudents(searchParamsStr = "") {
  const { data } = await http().get(
    `${endpoints.myStudents.getAll}?${searchParamsStr}`,
  );
  return data;
}

async function deleteStudent(id) {
  return await http().delete(`${endpoints.myStudents.getAll}/${id}`);
}

export default function Listing() {
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();
  const searchParamsStr = searchParams.toString();
  const router = useRouter();

  const { data, isLoading, isError, error, isFetching } = useQuery({
    queryFn: () => fetchMyStudents(searchParamsStr),
    queryKey: ["my-students", searchParamsStr],
  });
  const deleteMutation = useMutation({
    mutationFn: ({ id }) => deleteStudent(id),
    onSuccess: () => {
      toast.success("Deleted.");
      queryClient.invalidateQueries(["my-students", searchParamsStr]);
    },
    onError: (error) => {
      toast.error(error?.message ?? "error deleting!");
    },
  });

  const handleDelete = async (data) => {
    const confirmation = confirm("Are you sure?");
    if (confirmation) {
      deleteMutation.mutate(data);
    }
  };

  useEffect(() => {
    if (!searchParamsStr) {
      const params = new URLSearchParams();
      params.set("page", 1);
      params.set("limit", 10);
      router.replace(`?${params.toString()}`);
    }
  }, [searchParamsStr, router]);

  if (isLoading || isFetching)
    return <DataTableSkeleton columnCount={6} rowCount={10} />;

  if (isError) return error?.message ?? "error";

  return (
    <div className="w-full rounded-lg border-input">
      <DataTable
        columns={columns(handleDelete)}
        data={data.data}
        totalItems={data.total}
      />
    </div>
  );
}
