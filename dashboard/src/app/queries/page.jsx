"use client";
import Title from "@/components/Title";
import { columns } from "./columns";
import { Suspense, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import http from "@/utils/http";
import { endpoints } from "../../utils/endpoints.js";
import Spinner from "@/components/spinner";
import { toast } from "sonner";
import QueryDialog from "@/components/dialogs/query-dialog";
import { DataTable } from "@/components/ui/table/data-table";
import QueriesTableActions from "./_component/queries-table-actions";
import { useSearchParams } from "next/navigation";
import { serialize } from "@/lib/searchparams";
import SubcatTableActions from "../sub-categories/_component/subcat-table-actions";
import { DataTableSkeleton } from "@/components/ui/table/data-table-skeleton";

async function deleteQuery({ id }) {
  return await http().delete(`${endpoints.queries.getAll}/${id}`);
}

async function fetchQueries(params) {
  return await http().get(`${endpoints.queries.getAll}?${params}`);
}

export default function Queries() {
  const [isModal, setIsModal] = useState(false);
  const [queryId, setQueryId] = useState(null);
  const queryClient = useQueryClient();
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
    queryFn: () => fetchQueries(searchParamStr),
    queryKey: ["queries", searchParamStr],
  });

  const deleteMutation = useMutation(deleteQuery, {
    onSuccess: () => {
      toast.success("Query deleted.");
      queryClient.invalidateQueries(["queries"]);
      closeModal();
    },
    onError: (error) => {
      toast.error(error.response?.data?.message ?? error?.message ?? "error");
    },
  });

  const handleDelete = async (id) => {
    deleteMutation.mutate({ id });
  };

  if (isError) error?.message ?? "error";

  return (
    <div className="border-input container mx-auto rounded-lg bg-white p-8">
      <div className="flex items-center justify-between">
        <Title text={"Queries"} />
      </div>
      <div>
        <QueriesTableActions />

        {isLoading ||
          (isFetching && <DataTableSkeleton columnCount={4} rowCount={10} />)}
        <Suspense
          key={key}
          fallback={<DataTableSkeleton columnCount={4} rowCount={10} />}
        >
          {data && (
            <DataTable
              columns={columns(openModal, setQueryId)}
              data={data.data}
              totalItems={data.total}
            />
          )}
        </Suspense>
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
