"use client";
import Title from "@/components/Title";
import { columns } from "./columns";
import { DataTable } from "./data-table";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import http from "@/utils/http";
import { endpoints } from "../../utils/endpoints.js";
import Spinner from "@/components/spinner";
import { toast } from "sonner";
import QueryDialog from "@/components/dialogs/query-dialog";

async function deleteQuery({ id }) {
  return await http().delete(`${endpoints.queries.getAll}/${id}`);
}

async function fetchQueries() {
  const { data } = await http().get(endpoints.queries.getAll);
  console.log({ data });
  return data;
}

export default function Queries() {
  const [isModal, setIsModal] = useState(false);
  const [queryId, setQueryId] = useState(null);
  const queryClient = useQueryClient();

  function openModal() {
    setIsModal(true);
  }
  function closeModal() {
    setIsModal(false);
  }

  const { data, isLoading, isError, error } = useQuery({
    queryFn: fetchQueries,
    queryKey: ["queries"],
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

  if (isLoading) return <Spinner />;
  if (isError) error?.message ?? "error";

  return (
    <div className="border-input container mx-auto rounded-lg bg-white p-8">
      <div className="flex items-center justify-between">
        <Title text={"Queries"} />
      </div>
      <div>
        <DataTable columns={columns(openModal, setQueryId)} data={data} />
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
