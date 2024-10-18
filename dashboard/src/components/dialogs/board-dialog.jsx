import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { BoardForm } from "../forms/board";

export default function BoardDialog({
  isOpen,
  setIsOpen,
  handleUpdate,
  type,
  boardId,
}) {
  const handleSave = () => setIsOpen(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="sr-only">User form</DialogTitle>
        </DialogHeader>
        <BoardForm
          handleUpdate={handleUpdate}
          type={type}
          boardId={boardId}
          onSave={handleSave}
        />
      </DialogContent>
    </Dialog>
  );
}
