"use client";
import { ArrowUpDown } from "lucide-react";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import moment from "moment";
import { Button, buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import { Chat } from "phosphor-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export const columns = (handleDelete) => [
  {
    accessorKey: "student_name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          FULLNAME
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "created_at",
    header: ({ column }) => {
      return <Button variant="ghost">CREATED ON</Button>;
    },
    cell: ({ row }) => {
      return (
        <div>{moment(row.getValue("created_at")).format("DD/MM/YYYY")}</div>
      );
    },
  },
  {
    id: "chat",
    enableHiding: false,
    cell: ({ row }) => {
      const id = row.original.id;
      const count = row.original.unread_chat_count;
      const name = row.original.tutor_name || row.original.student_name;
      return (
        <Link
          href={`/dashboard/tutor-student-chats/${id}?name=${name.split(" ").join("+")}`}
          className={cn(buttonVariants({}), "h-9")}
        >
          <Chat className="mr-1 size-4" /> Chat{" "}
          {count > 1 && (
            <Badge
              className={"ml-1 bg-white text-black hover:bg-white/80"}
              variant={"secondary"}
            >
              {count}
            </Badge>
          )}
        </Link>
      );
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const id = row.original.id;
      const role = row.original.role;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <DotsHorizontalIcon className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => handleDelete({ id })}>
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
