"use client";
import React, { useEffect } from "react";
import { DataTable } from "@/components/ui/table/data-table";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useRouter, useSearchParams } from "next/navigation";
import { columns } from "../columns";
import { DataTableSkeleton } from "@/components/ui/table/data-table-skeleton";
import { deleteCategory, fetchCategories } from "@/server/category";

export default function CategoryListing() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const searchParams = useSearchParams();
  const searchParamStr = searchParams.toString();

  const { data, isLoading, isFetching, isError, error } = useQuery({
    queryFn: () => fetchCategories(searchParamStr),
    queryKey: ["categories", searchParamStr],
    enabled: !!searchParamStr,
  });

  const deleteMutation = useMutation(deleteCategory, {
    onSuccess: () => {
      toast.success("Category deleted.");
      queryClient.invalidateQueries({ queryKey: ["categories"] });
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

  useEffect(() => {
    if (!searchParamStr) {
      const params = new URLSearchParams();
      params.set("page", 1);
      params.set("limit", 10);
      router.replace(`?${params.toString()}`);
    }
  }, [searchParamStr, router]);

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
