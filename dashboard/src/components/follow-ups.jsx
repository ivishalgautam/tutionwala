import React, { useState } from "react";
import FollowUpCard from "./card/follow-up";
import { Button } from "./ui/button";
import { Plus } from "lucide-react";
import { PlusIcon } from "@radix-ui/react-icons";
import Modal from "./Modal";
import CreateFollowUpForm from "./forms/follow-up";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import http from "@/utils/http";
import { endpoints } from "@/utils/endpoints";
import { toast } from "sonner";

async function createFollowUp(data) {
  return http().post(endpoints.followups.getAll, data);
}

async function updateFollowUp(data) {
  return http().put(`${endpoints.followups.getAll}/${data.id}`, data);
}

async function deleteFollowUp(data) {
  return http().delete(`${endpoints.followups.getAll}/${data.id}`);
}

const fetchFollowups = async (id) => {
  const { data } = await http().get(
    `${endpoints.followups.getAll}/getByLeadId/${id}`,
  );
  return data;
};

export default function FollowUps({ leadId }) {
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
    queryKey: [`followups-${leadId}`],
    queryFn: () => fetchFollowups(leadId),
    enabled: !!leadId,
  });

  const openModal = () => {
    setIsModal(true);
  };

  const closeModal = () => {
    setIsModal(false);
  };

  const createMutation = useMutation(createFollowUp, {
    onSuccess: (data) => {
      toast.success(data.message ?? "Follow up added.");
      queryClient.invalidateQueries(`lead-${leadId}`);
      setIsModal(false);
    },
    onError: (error) => {
      toast.error(error.message ?? "Failed to create follow up!");
    },
  });

  const updateMutation = useMutation(updateFollowUp, {
    onSuccess: (data) => {
      toast.success(data.message ?? "Follow up updated.");
      queryClient.invalidateQueries(`lead-${leadId}`);
      closeModal();
      setFollowUpId("");
    },
    onError: (error) => {
      toast.error(error.message ?? "Failed to update follow up!");
    },
  });

  const deleteMutation = useMutation(deleteFollowUp, {
    onSuccess: (data) => {
      toast.success(data.message ?? "Follow up deleted.");
      queryClient.invalidateQueries(`lead-${leadId}`);
    },
    onError: (error) => {
      toast.error(error.message ?? "Failed to delete follow up!");
    },
  });

  async function handleCreate(data) {
    createMutation.mutate(data);
  }

  async function handleUpdate(data) {
    updateMutation.mutate(data);
  }

  async function handleDelete(data) {
    const confirmation = confirm("Are you sure?");
    if (!confirmation) return;
    deleteMutation.mutate(data);
  }

  return (
    <div className="space-y-4">
      <Button
        variant="outline"
        type="button"
        onClick={() => {
          setFollowUpId("");
          setType("create");
          openModal();
        }}
      >
        <PlusIcon /> &nbsp; Add Follow Up
      </Button>
      {isLoading
        ? Array.from({ length: 5 }).map((_, idx) => <Skeloton key={idx} />)
        : followUps?.map((followup) => (
            <FollowUpCard
              key={followup.id}
              followup={followup}
              handleUpdate={handleUpdate}
              handleDelete={handleDelete}
              setType={setType}
              openModal={openModal}
              setFollowUpId={setFollowUpId}
            />
          ))}
      <Modal isOpen={isModal} onClose={closeModal}>
        <CreateFollowUpForm
          handleCreate={handleCreate}
          handleUpdate={handleUpdate}
          leadId={leadId}
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
