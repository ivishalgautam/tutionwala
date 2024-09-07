"use client";
import Title from "@/components/Title";
import { columns } from "./columns";
import { DataTable } from "./data-table";
import Modal from "@/components/Modal";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import http from "@/utils/http";
import { endpoints } from "@/utils/endpoints";
import Spinner from "@/components/Spinner";
import { toast } from "sonner";
import { BoardForm } from "@/components/forms/board";

async function createBoard(data) {
  return http().post(`${endpoints.boards.getAll}`, data);
}

async function updateBoard(data) {
  return http().put(`${endpoints.boards.getAll}/${data.id}`, data);
}

async function deleteBoard(data) {
  return http().delete(`${endpoints.boards.getAll}/${data.id}`);
}

async function fetchBoards() {
  const { data } = await http().get(endpoints.boards.getAll);
  return data;
}

export default function Categories() {
  const [boardId, setBoardId] = useState("");
  const [isModal, setIsModal] = useState(false);
  const [type, setType] = useState("create");
  const queryClient = useQueryClient();

  function openModal() {
    setIsModal(true);
  }
  function closeModal() {
    setIsModal(false);
  }

  const { data, isLoading, isError, error } = useQuery({
    queryFn: fetchBoards,
    queryKey: ["boards"],
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
    onSuccess: () => {
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

  if (isLoading) {
    return <Spinner />;
  }

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
          onClick={() => {
            setType("create");
            openModal();
          }}
        >
          Create
        </Button>
      </div>
      <div>
        <DataTable
          columns={columns(setType, openModal, setBoardId, handleDelete)}
          data={data}
        />
      </div>

      <Modal isOpen={isModal} onClose={closeModal} className={"w-96"}>
        <BoardForm
          type={type}
          handleCreate={handleCreate}
          handleUpdate={handleUpdate}
          boardId={boardId}
        />
      </Modal>
    </div>
  );
}
