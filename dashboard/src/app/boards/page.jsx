"use client";
import Title from "@/components/Title";
import { columns } from "./columns";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import http from "@/utils/http";
import { endpoints } from "@/utils/endpoints";
import { toast } from "sonner";
import dynamic from "next/dynamic";
import { DataTable } from "@/components/ui/table/data-table";
import BoardsTableActions from "./_component/board-table-actions";
import { Suspense } from "react";
import { DataTableSkeleton } from "@/components/ui/table/data-table-skeleton";
import { useSearchParams } from "next/navigation";
import { serialize } from "@/lib/searchparams";

const BoardDialog = dynamic(() => import("@/components/dialogs/board-dialog"), {
  ssr: false,
});

//
async function createBoard(data) {
  return http().post(`${endpoints.boards.getAll}`, data);
}

async function updateBoard(data) {
  return http().put(`${endpoints.boards.getAll}/${data.id}`, data);
}

async function deleteBoard(data) {
  return http().delete(`${endpoints.boards.getAll}/${data.id}`);
}

async function fetchBoards(params) {
  return await http().get(`${endpoints.boards.getAll}?${params}`);
}

export default function Categories() {
  const [boardId, setBoardId] = useState("");
  const [isModal, setIsModal] = useState(false);
  const [type, setType] = useState("create");
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
    queryFn: () => fetchBoards(searchParamStr),
    queryKey: ["boards", searchParamStr],
  });

  const createMutation = useMutation(createBoard, {
    onSuccess: () => {
      toast.success("Board added.");
      queryClient.invalidateQueries({ queryKey: ["boards"] });
      closeModal();
    },
    onError: (error) => {
      toast.error(error.message ?? "Error adding board");
    },
  });

  const updateMutation = useMutation(updateBoard, {
    onSuccess: (data) => {
      console.log({ data });
      toast.success("Board updated.");
      queryClient.invalidateQueries({ queryKey: ["boards"] });
      closeModal();
    },
    onError: (error) => {
      toast.error(error.message ?? "Error updating board");
    },
  });

  const deleteMutation = useMutation(deleteBoard, {
    onSuccess: () => {
      toast.success("Board deleted.");
      queryClient.invalidateQueries({ queryKey: ["boards"] });
      closeModal();
    },
    onError: (error) => {
      toast.error(error.message ?? "error deleting");
    },
  });

  const handleCreate = async (data) => {
    createMutation.mutate(data);
  };

  const handleUpdate = async (data) => {
    updateMutation.mutate(data);
  };
  const handleDelete = async (id) => {
    deleteMutation.mutate({ id: id });
  };

  if (isError) {
    toast.error(error.message ?? "error");
    return "error";
  }

  return (
    <div className="border-input container mx-auto rounded-lg bg-white p-8">
      <div className="flex items-center justify-between">
        <Title text={"boards"} />

        <Button
          type="button"
          variant="outline"
          onClick={() => {
            setType("create");
            openModal();
          }}
        >
          Create
        </Button>
      </div>
      <div>
        <BoardsTableActions />
        {isLoading ||
          (isFetching && <DataTableSkeleton columnCount={4} rowCount={10} />)}
        <Suspense
          key={key}
          fallback={<DataTableSkeleton columnCount={4} rowCount={10} />}
        >
          {data && (
            <DataTable
              columns={columns(setType, openModal, setBoardId, handleDelete)}
              data={data?.data}
              totalItems={data.total}
            />
          )}
        </Suspense>
      </div>

      {typeof document !== "undefined" && (
        <BoardDialog
          type={type}
          handleCreate={handleCreate}
          handleUpdate={handleUpdate}
          boardId={boardId}
          isOpen={isModal}
          setIsOpen={setIsModal}
        />
      )}
    </div>
  );
}
