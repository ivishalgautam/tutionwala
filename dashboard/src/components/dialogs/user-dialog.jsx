import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import UserForm from "../forms/user";

export default function UserDialog({
  isOpen,
  setIsOpen,
  handleUpdate,
  type,
  userId,
}) {
  const handleSave = () => setIsOpen(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="sr-only">User form</DialogTitle>
          <DialogDescription className="sr-only">
            This is user form
          </DialogDescription>
        </DialogHeader>
        <UserForm
          handleUpdate={handleUpdate}
          type={type}
          userId={userId}
          onSave={handleSave}
        />
      </DialogContent>
    </Dialog>
  );
}
