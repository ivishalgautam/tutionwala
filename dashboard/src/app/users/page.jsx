"use client";
import Title from "@/components/Title";
import Spinner from "@/components/spinner";
import { useState } from "react";
import { columns } from "./columns";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import http from "@/utils/http";
import { endpoints } from "../../utils/endpoints.js";
import { toast } from "sonner";
import { isObject } from "@/utils/object";
import { useRouter, useSearchParams } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { DotsVerticalIcon } from "@radix-ui/react-icons";
import dynamic from "next/dynamic";
import { DataTable } from "@/components/ui/table/data-table";
import UserTableActions from "./_component/user-table-actions";
import { Suspense } from "react";
import { DataTableSkeleton } from "@/components/ui/table/data-table-skeleton";
import { serialize } from "@/lib/searchparams";
const UserDialog = dynamic(() => import("@/components/dialogs/user-dialog"), {
  ssr: false,
});

async function deleteCustomer(data) {
  return http().delete(`${endpoints.users.getAll}/${data.id}`);
}

const fetchUsers = async (params) => {
  return await http().get(`${endpoints.users.getAll}?${params}`);
};

export default function Users() {
  const [isModal, setIsModal] = useState(false);
  const [userId, setUserId] = useState("");
  const router = useRouter();
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();
  const searchParamsStr = searchParams.toString();
  const key = serialize({ ...searchParams });

  const { data, isLoading, isFetching, isError, error } = useQuery({
    queryFn: () => fetchUsers(searchParamsStr),
    queryKey: ["users", searchParamsStr],
  });

  const deleteMutation = useMutation(deleteCustomer, {
    onSuccess: () => {
      toast.success("Customer deleted.");
      queryClient.invalidateQueries("users");
    },
    onError: (error) => {
      if (isObject(error)) {
        toast.error(error.message);
      } else {
        toast.error(error);
      }
    },
  });

  const handleDelete = async (data) => {
    const confirmation = confirm("Are you sure?");
    if (confirmation) {
      deleteMutation.mutate(data);
    }
  };

  async function handleUserStatus(customerId, status) {
    try {
      const response = await http().put(
        `${endpoints.users.getAll}/status/${customerId}`,
        { is_active: status },
      );
      toast.success(response.message);
      queryClient.invalidateQueries("customers");
    } catch (error) {
      console.log(error);
    }
  }

  const updateMutation = useMutation({
    mutationFn: async (data) => {
      return await http().put(`${endpoints.users.getAll}/${userId}`, data);
    },
    onSuccess: (data) => {
      toast.success("Updated");
      queryClient.invalidateQueries(["users"]);
      setIsModal(false);
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message ?? error?.message ?? "Error");
    },
  });

  const handleUpdate = (data) => {
    updateMutation.mutate(data);
  };

  const handleNavigate = (href) => {
    router.push(href);
  };

  if (isError) {
    return error?.message ?? "error";
  }

  return (
    <div className="border-input container mx-auto rounded-lg bg-white p-8">
      <div className="flex items-center justify-between">
        <Title text={"Users"} />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="">
              <DotsVerticalIcon className="h-3 w-3" />
              <span className="ml-1">Create</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() => handleNavigate("/users/create/student")}
            >
              Student
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => handleNavigate("/users/create/tutor")}
            >
              Tutor
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div>
        <UserTableActions />
        {isLoading ||
          (isFetching && <DataTableSkeleton columnCount={4} rowCount={10} />)}
        <Suspense
          key={key}
          fallback={<DataTableSkeleton columnCount={4} rowCount={10} />}
        >
          {data && (
            <DataTable
              columns={columns(handleDelete, handleUserStatus, setUserId, () =>
                setIsModal(true),
              )}
              data={data.data}
              totalItems={data.total}
            />
          )}
        </Suspense>
      </div>
      {typeof document !== "undefined" && (
        <UserDialog
          handleUpdate={handleUpdate}
          isOpen={isModal}
          setIsOpen={setIsModal}
          userId={userId}
          type={"edit"}
        />
      )}
    </div>
  );
}
