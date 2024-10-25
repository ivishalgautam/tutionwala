"use client";
import Title from "@/components/Title";
import { columns } from "./columns";
import { buttonVariants } from "@/components/ui/button";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import http from "@/utils/http";
import { endpoints } from "@/utils/endpoints";
import Spinner from "@/components/spinner";
import { isObject } from "@/utils/object";
import { toast } from "sonner";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { DataTable } from "@/components/ui/table/data-table";
import CategoryTableActions from "./_component/category-table-actions";
import { serialize } from "@/lib/searchparams";
import SubcatTableActions from "../sub-categories/_component/subcat-table-actions";
import { DataTableSkeleton } from "@/components/ui/table/data-table-skeleton";
import { Suspense } from "react";

async function deleteCategory(data) {
  return http().delete(`${endpoints.categories.getAll}/${data.id}`);
}

async function fetchCategories(params) {
  return await http().get(`${endpoints.categories.getAll}?${params}`);
}

export default function Categories() {
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
  console.log(data);
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

  if (isError) {
    toast.error(error.message ?? "error");
    return "error";
  }

  return (
    <div className="border-input container mx-auto rounded-lg bg-white p-8">
      <div className="flex items-center justify-between">
        <Title text={"Categories"} />

        <Link
          className={buttonVariants({ variant: "outline" })}
          href={"/categories/create"}
        >
          Create
        </Link>
      </div>
      <div>
        <CategoryTableActions />
        {isLoading ||
          (isFetching && <DataTableSkeleton columnCount={4} rowCount={10} />)}
        <Suspense
          key={key}
          fallback={<DataTableSkeleton columnCount={4} rowCount={10} />}
        >
          {data && (
            <DataTable
              columns={columns(handleDelete, handleNavigate)}
              data={data.data.map((category) => category)}
              totalItems={data.total}
            />
          )}
        </Suspense>
      </div>
    </div>
  );
}
