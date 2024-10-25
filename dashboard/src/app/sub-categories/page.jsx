"use client";
import Title from "@/components/Title";
import { columns } from "./columns";
import { buttonVariants } from "@/components/ui/button";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import http from "@/utils/http";
import { endpoints } from "@/utils/endpoints";
import { toast } from "sonner";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { DataTable } from "@/components/ui/table/data-table";
import SubcatTableActions from "./_component/subcat-table-actions";
import { Suspense } from "react";
import { DataTableSkeleton } from "@/components/ui/table/data-table-skeleton";
import { serialize } from "@/lib/searchparams";

async function deleteSubCategory(data) {
  return http().delete(`${endpoints.subCategories.getAll}/${data.id}`);
}

async function fetchSubCategories(params) {
  return await http().get(`${endpoints.subCategories.getAll}?${params}`);
}

export default function Categories() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const searchParams = useSearchParams();
  const searchParamStr = searchParams.toString();
  const key = serialize({ ...searchParams });

  const { data, isLoading, isFetching, isError, error } = useQuery({
    queryFn: () => fetchSubCategories(searchParamStr),
    queryKey: ["sub-categories", searchParamStr],
  });
  const deleteMutation = useMutation(deleteSubCategory, {
    onSuccess: () => {
      toast.success("Sub category deleted.");
      queryClient.invalidateQueries({ queryKey: ["sub-categories"] });
    },
    onError: (error) => {
      toast.error(error.message ?? "error");
    },
  });

  const handleDelete = async (id) => {
    deleteMutation.mutate({ id: id });
  };

  const handleNavigate = (href) => {
    router.push(href);
  };

  if (isError) {
    toast.error(error.message);
    return "error";
  }

  return (
    <div className="border-input container mx-auto rounded-lg bg-white p-8">
      <div className="flex items-center justify-between">
        <Title text={"Sub Categories"} />

        <Link
          className={buttonVariants({ variant: "outline" })}
          href={"/sub-categories/create"}
        >
          Create
        </Link>
      </div>
      <div>
        <SubcatTableActions />
        {isLoading ||
          (isFetching && <DataTableSkeleton columnCount={4} rowCount={10} />)}
        <Suspense
          key={key}
          fallback={<DataTableSkeleton columnCount={4} rowCount={10} />}
        >
          {data && (
            <DataTable
              columns={columns(handleDelete, handleNavigate)}
              data={data.data}
              totalItems={data.total}
            />
          )}
        </Suspense>
      </div>
    </div>
  );
}
