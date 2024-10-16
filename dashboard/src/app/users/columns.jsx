"use client";
import { ArrowUpDown } from "lucide-react";
import Link from "next/link";
import { Switch } from "@/components/ui/switch";
import { Small } from "@/components/ui/typography";
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
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export const columns = (handleDelete, handleUserStatus, handleNavigate) => [
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
  },
  {
    accessorKey: "mobile_number",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Phone
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "email",
    header: ({ column }) => {
      return <Button variant="ghost">Email</Button>;
    },
  },
  {
    accessorKey: "role",
    header: ({ column }) => {
      return <Button variant="ghost">Role</Button>;
    },
    cell: (row) => {
      const role = row.getValue("role");
      return (
        <Badge
          className={cn({
            "border-emerald-500/50 bg-emerald-500/30 text-emerald-500 hover:bg-emerald-500/40":
              role === "sales_person",
            "border-orange-500/50 bg-orange-500/30 text-orange-500 hover:bg-orange-500/40":
              role === "personal_trainer",
          })}
        >
          {role.split("_").join(" ")}
        </Badge>
      );
    },
  },
  {
    accessorKey: "is_active",
    header: ({ column }) => {
      return <Button variant="ghost">Status</Button>;
    },
    cell: ({ row }) => {
      const is_active = row.getValue("is_active");
      const id = row.original.id;
      return (
        <div className="flex items-center justify-start gap-2">
          <Switch
            checked={is_active}
            onCheckedChange={() => handleUserStatus(id, !is_active)}
          />
          <Small className={is_active ? "text-green-500" : "text-red-500"}>
            {is_active ? "active" : "inactive"}
          </Small>
        </div>
      );
    },
  },
  {
    accessorKey: "created_at",
    header: ({ column }) => {
      return <Button variant="ghost">Registered On</Button>;
    },
    cell: ({ row }) => {
      return (
        <div>{moment(row.getValue("created_at")).format("DD/MM/YYYY")}</div>
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
            <DropdownMenuItem onClick={() => handleNavigate(`/users/${id}`)}>
              Edit
            </DropdownMenuItem>
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
