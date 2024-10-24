import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import QueryForm from "@/components/forms/query";

export default function QueryDialog({
  isOpen,
  setIsOpen,
  handleDelete,
  queryId,
}) {
  const handleSave = () => setIsOpen(false);
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="sr-only">User form</DialogTitle>
          <DialogDescription className="sr-only">
            This is query form
          </DialogDescription>
        </DialogHeader>
        <QueryForm handleDelete={handleDelete} queryId={queryId} />
      </DialogContent>
    </Dialog>
  );
}
