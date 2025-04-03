"use client";
import { columns } from "../columns";
import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import QueryDialog from "@/components/dialogs/query-dialog";
import { DataTable } from "@/components/ui/table/data-table";
import { useRouter, useSearchParams } from "next/navigation";
import { DataTableSkeleton } from "@/components/ui/table/data-table-skeleton";
import { deleteQuery, fetchQueries, updateQuery } from "@/server/query";

export default function QueryListing() {
  const [isModal, setIsModal] = useState(false);
  const [queryId, setQueryId] = useState(null);
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();
  const searchParamStr = searchParams.toString();
  const router = useRouter();

  function openModal() {
    setIsModal(true);
  }
  function closeModal() {
    setIsModal(false);
  }

  const { data, isLoading, isFetching, isError, error } = useQuery({
    queryFn: () => fetchQueries(searchParamStr),
    queryKey: ["queries", searchParamStr],
    enabled: !!searchParamStr,
  });

  const updateMutation = useMutation({
    mutationFn: (data) => updateQuery(queryId, data),
    onSuccess: () => {
      toast.success("Query updated.");
      queryClient.invalidateQueries(["queries", searchParamStr]);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message ?? error?.message ?? "error");
    },
  });

  const handleUpdate = async (data) => {
    updateMutation.mutate(data);
  };
  const deleteMutation = useMutation(deleteQuery, {
    onSuccess: () => {
      toast.success("Query deleted.");
      queryClient.invalidateQueries(["queries", searchParamStr]);
      closeModal();
    },
    onError: (error) => {
      toast.error(error.response?.data?.message ?? error?.message ?? "error");
    },
  });

  const handleDelete = async (id) => {
    deleteMutation.mutate({ id });
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

  if (isError) error?.message ?? "error";

  return (
    <div className="border-input rounded-lg">
      <div>
        <DataTable
          columns={columns(openModal, setQueryId, handleUpdate)}
          data={data.data}
          totalItems={data.total}
        />
      </div>

      <QueryDialog
        isOpen={isModal}
        setIsOpen={setIsModal}
        handleDelete={handleDelete}
        queryId={queryId}
      />
    </div>
  );
}
