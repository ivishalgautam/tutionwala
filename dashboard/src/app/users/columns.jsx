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

export const columns = (
  handleDelete,
  handleUserStatus,
  setUserId,
  openModal,
) => [
  {
    accessorKey: "fullname",
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
    cell: ({ row }) => {
      const id = row.original.tutor_id;
      const role = row.original.role;
      const fullname = row.getValue("fullname");
      return role === "tutor" ? (
        <a href={`https://www.tutionwala.com/tutors/${id}`} target="_blank">
          {fullname}
        </a>
      ) : (
        fullname
      );
    },
  },
  {
    accessorKey: "mobile_number",
    header: "PHONE",
  },
  {
    accessorKey: "email",
    header: "EMAIL",
  },
  {
    accessorKey: "role",
    header: "ROLE",
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
      return <Button variant="ghost">STATUS</Button>;
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
      return <Button variant="ghost">REGISTERED ON</Button>;
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
      const is_aadhaar_verified = row.original.is_aadhaar_verified;
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
            <DropdownMenuItem
              onClick={() => {
                setUserId(id);
                openModal("user");
              }}
            >
              View
            </DropdownMenuItem>
            {is_aadhaar_verified && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => {
                    setUserId(id);
                    openModal("aadhaar");
                  }}
                >
                  Aadhaar details
                </DropdownMenuItem>
              </>
            )}
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
