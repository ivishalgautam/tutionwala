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
import { Button, buttonVariants } from "@/components/ui/button";
import moment from "moment";
import Link from "next/link";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Chat } from "phosphor-react";
import { cn } from "@/lib/utils";

export const columns = (
  handleDelete,
  handleUpdate,
  setStudentId,
  setIsModal,
) => [
  {
    accessorKey: "fullname",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Fullname
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    // cell: ({ row }) => {
    //   const fullname = row.getValue("fullname");
    //   const count = row.original.unread_chat_count;
    //   return (
    //     <div className="space-x-1">
    //       <span>{fullname}</span> {count > 1 && <Badge>{count}</Badge>}
    //     </div>
    //   );
    // },
  },
  {
    accessorKey: "sub_category_name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Category
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const category = row.getValue("sub_category_name");
      const subjects = row.original.subjects
        ? (row.original.subjects.split(" ") ?? [])
        : [];

      return (
        <div>
          <span>{category ?? "N/a"}</span>
          {subjects.length > 0 && (
            <div className="space-x-1">
              {subjects.map((sub) => (
                <Badge key={sub} className={"text-xs font-normal capitalize"}>
                  {sub}
                </Badge>
              ))}
            </div>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Status
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const id = row.original.id;
      return (
        <Select
          defaultValue={row.getValue("status")}
          onValueChange={(value) => handleUpdate({ status: value, id })}
        >
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="converted">Converted</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
          </SelectContent>
        </Select>
      );
    },
  },
  {
    accessorKey: "created_at",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Enquiry date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const date = row.getValue("created_at");
      return moment(date).format("DD MMM YYYY");
    },
  },
  {
    id: "chat",
    enableHiding: false,
    cell: ({ row }) => {
      const id = row.original.id;
      const count = row.original.unread_chat_count;
      const name = row.original.fullname;

      return (
        <Link
          href={`/dashboard/enquiries/${id}/chat?name=${name.split(" ").join("+")}`}
          className={cn(buttonVariants({}), "h-9")}
        >
          <Chat className="mr-1 size-4" /> Chat{" "}
          {count > 0 && (
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
      const studentId = row.original.studentId;

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
            {/* <DropdownMenuItem
              onClick={() => {
                setStudentId(studentId);
                setIsModal(true);
              }}
            >
              Add follow up
            </DropdownMenuItem> */}
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => handleDelete(id)}>
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
