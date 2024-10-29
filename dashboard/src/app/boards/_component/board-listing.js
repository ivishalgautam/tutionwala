"use client";
import { columns } from "../columns";
import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import dynamic from "next/dynamic";
import { DataTable } from "@/components/ui/table/data-table";
import { useRouter, useSearchParams } from "next/navigation";
import { DataTableSkeleton } from "@/components/ui/table/data-table-skeleton";
import {
  createBoard,
  deleteBoard,
  fetchBoards,
  updateBoard,
} from "@/server/boards";

const BoardDialog = dynamic(() => import("@/components/dialogs/board-dialog"), {
  ssr: false,
});

//

export default function BoardListing() {
  const [boardId, setBoardId] = useState("");
  const [isModal, setIsModal] = useState(false);
  const [type, setType] = useState("create");
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
    queryFn: () => fetchBoards(searchParamStr),
    queryKey: ["boards", searchParamStr],
    enabled: !!searchParamStr,
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

  useEffect(() => {
    if (!searchParamStr) {
      const params = new URLSearchParams();
      params.set("page", 1);
      params.set("limit", 10);
      router.replace(`?${params.toString()}`);
    }
  }, [searchParamStr, router]);

  if (isLoading || isFetching)
    return <DataTableSkeleton columnCount={3} rowCount={10} />;

  if (isError) return error?.message ?? "error";

  return (
    <div className="border-input rounded-lg">
      <DataTable
        columns={columns(setType, openModal, setBoardId, handleDelete)}
        data={data?.data}
        totalItems={data.total}
      />

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
