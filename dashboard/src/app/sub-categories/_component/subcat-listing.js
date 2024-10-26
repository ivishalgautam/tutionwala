"use client";
import { columns } from "../columns";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import http from "@/utils/http";
import { endpoints } from "@/utils/endpoints";
import { toast } from "sonner";
import { useRouter, useSearchParams } from "next/navigation";
import { DataTable } from "@/components/ui/table/data-table";
import { DataTableSkeleton } from "@/components/ui/table/data-table-skeleton";
import { serialize } from "@/lib/searchparams";

async function deleteSubCategory(data) {
  return http().delete(`${endpoints.subCategories.getAll}/${data.id}`);
}

async function fetchSubCategories(params) {
  return await http().get(`${endpoints.subCategories.getAll}?${params}`);
}

export default function SubCategoryListing() {
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

  if (isLoading || isFetching)
    return <DataTableSkeleton columnCount={3} rowCount={10} />;

  if (isError) return error?.message ?? "error";

  return (
    <div className="border-input rounded-lg">
      <DataTable
        columns={columns(handleDelete, handleNavigate)}
        data={data.data}
        totalItems={data.total}
      />
    </div>
  );
}
