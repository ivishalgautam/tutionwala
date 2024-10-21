"use client";
import { useState } from "react";
import FollowUpCard from "./card/follow-up";
import Modal from "./Modal";
import CreateFollowUpForm from "./forms/follow-up";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import http from "@/utils/http";
import { endpoints } from "@/utils/endpoints";
import { toast } from "sonner";
import { P } from "./ui/typography";

async function updateFollowUp(data) {
  return http().put(`${endpoints.followUps.getAll}/${data.id}`, data);
}

async function deleteFollowUp(data) {
  return http().delete(`${endpoints.followUps.getAll}/${data.id}`);
}

const fetchFollowups = async () => {
  const { data } = await http().get(`${endpoints.followUps.getAll}`);
  return data;
};

export default function FollowUps() {
  const [followUpId, setFollowUpId] = useState("");
  const [isModal, setIsModal] = useState(false);
  const [type, setType] = useState("");
  const queryClient = useQueryClient();
  const {
    data: followUps,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: [`followups`],
    queryFn: fetchFollowups,
  });

  const openModal = () => {
    setIsModal(true);
  };

  const closeModal = () => {
    setIsModal(false);
  };

  const updateMutation = useMutation(updateFollowUp, {
    onSuccess: (data) => {
      toast.success(data.message ?? "Follow up updated.");
      queryClient.invalidateQueries(`followups`);
      closeModal();
      setFollowUpId("");
    },
    onError: (error) => {
      toast.error(error.message ?? "Failed to update follow up!");
    },
  });

  const deleteMutation = useMutation(deleteFollowUp, {
    onSuccess: (data) => {
      toast.success(data?.message ?? "Follow up deleted.");
      queryClient.invalidateQueries(`followups`);
    },
    onError: (error) => {
      toast.error(error.message ?? "Failed to delete follow up!");
    },
  });

  async function handleUpdate(data) {
    updateMutation.mutate(data);
  }

  async function handleDelete(data) {
    const confirmation = confirm("Are you sure?");
    if (!confirmation) return;
    deleteMutation.mutate(data);
  }

  if (isError) return error?.message ?? "error";

  return (
    <div className="space-y-4">
      {isLoading ? (
        Array.from({ length: 5 }).map((_, idx) => <Skeloton key={idx} />)
      ) : followUps?.length ? (
        followUps?.map((followup) => (
          <FollowUpCard
            key={followup.id}
            followup={followup}
            handleUpdate={handleUpdate}
            handleDelete={handleDelete}
            setType={setType}
            openModal={openModal}
            setFollowUpId={setFollowUpId}
          />
        ))
      ) : (
        <P className={"text-center"}>No Follows Ups Yet</P>
      )}
      <Modal isOpen={isModal} onClose={closeModal}>
        <CreateFollowUpForm
          handleUpdate={handleUpdate}
          type={type}
          followUpId={followUpId}
        />
      </Modal>
    </div>
  );
}

export const Skeloton = () => {
  return <div className="h-28 animate-pulse rounded-lg bg-gray-200"></div>;
};
