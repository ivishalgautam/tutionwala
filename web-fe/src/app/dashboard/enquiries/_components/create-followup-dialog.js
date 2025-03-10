import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import CreateFollowUpForm from "@/forms/follow-up";
import { endpoints } from "@/utils/endpoints";
import http from "@/utils/http";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

async function createFollowUp(data) {
  return http().post(endpoints.followUps.getAll, data);
}

export function CreateFollowUpDialog({ studentId, setIsModal, isModal }) {
  const queryClient = useQueryClient();

  const createMutation = useMutation(createFollowUp, {
    onSuccess: (data) => {
      toast.success(data.message ?? "Follow up added.");
      queryClient.invalidateQueries(`followups`);
      setIsModal(false);
    },
    onError: (error) => {
      toast.error(error.message ?? "Failed to create follow up!");
    },
  });

  async function handleCreate(data) {
    createMutation.mutate(data);
  }

  return (
    <Dialog open={isModal} onOpenChange={setIsModal}>
      <DialogContent className="">
        <DialogHeader>
          <DialogTitle>Follow Up</DialogTitle>
          <DialogDescription>Create a follow up</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <CreateFollowUpForm
            handleCreate={handleCreate}
            studentId={studentId}
            type={"create"}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
