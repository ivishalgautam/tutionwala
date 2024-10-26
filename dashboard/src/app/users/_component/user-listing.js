"use client";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import http from "@/utils/http";
import { toast } from "sonner";
import { isObject } from "@/utils/object";
import { useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";
const UserDialog = dynamic(() => import("@/components/dialogs/user-dialog"), {
  ssr: false,
});

import { DataTable } from "@/components/ui/table/data-table";
import React from "react";
import { columns } from "../columns";
import { endpoints } from "@/utils/endpoints";
import { DataTableSkeleton } from "@/components/ui/table/data-table-skeleton";
async function deleteCustomer(data) {
  return http().delete(`${endpoints.users.getAll}/${data.id}`);
}

const fetchUsers = async (params) => {
  return await http().get(`${endpoints.users.getAll}?${params}`);
};
export default function UserListing() {
  const [isModal, setIsModal] = useState(false);
  const [userId, setUserId] = useState("");
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();
  const searchParamsStr = searchParams.toString();

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

  if (isLoading || isFetching)
    return <DataTableSkeleton columnCount={6} rowCount={10} />;

  if (isError) return error?.message ?? "error";

  return (
    <div className="border-input rounded-lg">
      <div>
        {data && (
          <DataTable
            columns={columns(handleDelete, handleUserStatus, setUserId, () =>
              setIsModal(true),
            )}
            data={data.data}
            totalItems={data.total}
          />
        )}
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
