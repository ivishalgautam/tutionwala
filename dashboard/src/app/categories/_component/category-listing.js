"use client";
import React from "react";
import { DataTable } from "@/components/ui/table/data-table";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import http from "@/utils/http";
import { endpoints } from "@/utils/endpoints";
import { toast } from "sonner";
import { useRouter, useSearchParams } from "next/navigation";
import { serialize } from "@/lib/searchparams";
import { columns } from "../columns";
import { DataTableSkeleton } from "@/components/ui/table/data-table-skeleton";

async function deleteCategory(data) {
  return http().delete(`${endpoints.categories.getAll}/${data.id}`);
}

async function fetchCategories(params) {
  return await http().get(`${endpoints.categories.getAll}?${params}`);
}

export default function CategoryListing() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const searchParams = useSearchParams();
  const searchParamStr = searchParams.toString();
  const key = serialize({ ...searchParams });

  function openModal() {
    setIsModal(true);
  }
  function closeModal() {
    setIsModal(false);
  }

  const { data, isLoading, isFetching, isError, error } = useQuery({
    queryFn: () => fetchCategories(searchParamStr),
    queryKey: ["categories", searchParamStr],
  });
  const deleteMutation = useMutation(deleteCategory, {
    onSuccess: () => {
      toast.success("Category deleted.");
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      closeModal();
    },
    onError: (error) => {
      toast.error(error?.message ?? "error deleting!");
    },
  });

  const handleDelete = async (id) => {
    deleteMutation.mutate({ id: id });
  };

  const handleNavigate = (href) => {
    router.push(href);
  };

  if (isLoading) {
    return "loading...";
  }

  if (isLoading || isFetching)
    return <DataTableSkeleton columnCount={4} rowCount={10} />;

  if (isError) return error?.message ?? "error";

  return (
    <div className="border-input rounded-lg">
      <DataTable
        columns={columns(handleDelete, handleNavigate)}
        data={data.data.map((category) => category)}
        totalItems={data.total}
      />
    </div>
  );
}
