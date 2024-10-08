import { H4 } from "../ui/typography";
import moment from "moment";
import { Timer } from "lucide-react";
import { Button } from "../ui/button";
import { DotsVerticalIcon } from "@radix-ui/react-icons";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { cn } from "@/lib/utils";

export default function FollowUpCard({
  followup,
  handleUpdate,
  handleDelete,
  setType,
  openModal,
  setFollowUpId,
}) {
  const nextFollowUp = moment(followup.date).isBefore(moment())
    ? "Expired"
    : moment(followup.date).fromNow();
  return (
    <div
      key={followup.id}
      className="relative rounded-lg border bg-white p-4 shadow"
    >
      <H4>{followup.title}</H4>
      <p
        className={cn("text-gray-400", {
          "line-through": followup.is_completed,
        })}
      >
        {followup.content}
      </p>
      <div className="mt-2 flex items-center justify-start gap-1 text-sm text-gray-500">
        <span>
          <Timer size={20} />
        </span>
        <span>Next follow up {nextFollowUp}</span>
      </div>
      <div className="text-sm text-gray-400">
        Created at: {moment(followup.created_at).fromNow()}
      </div>

      <div className="absolute right-4 top-4 flex items-center justify-center gap-2">
        <Button
          variant={"outline"}
          disabled={followup.is_completed}
          onClick={() => handleUpdate({ id: followup.id, is_completed: true })}
          className={cn({ "cursor-not-allowed": followup.is_completed })}
        >
          Follow
        </Button>
        <div>
          <DropdownMenu>
            <DropdownMenuTrigger>
              {" "}
              <Button size="icon" variant="outline">
                <DotsVerticalIcon />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem
                onClick={() => handleDelete({ id: followup.id })}
              >
                Delete
              </DropdownMenuItem>
              {!followup.is_completed && (
                <DropdownMenuItem
                  onClick={() => {
                    setType("edit");
                    setFollowUpId(followup.id);
                    openModal();
                  }}
                >
                  Edit
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}
