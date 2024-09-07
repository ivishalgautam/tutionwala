"use client";
import Title from "@/components/Title";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Spinner from "@/components/Spinner";
import { useState } from "react";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import http from "@/utils/http";
import { endpoints } from "../../utils/endpoints.js";
import { toast } from "sonner";
import { isObject } from "@/utils/object";
import { useRouter } from "next/navigation.js";
import Loader from "@/components/loader";

async function deleteCustomer(data) {
  return http().delete(`${endpoints.users.getAll}/${data.id}`);
}

const fetchUsers = async () => {
  const { data } = await http().get(endpoints.users.getAll);
  return data;
};

export default function Users() {
  const router = useRouter();

  const [customerId, setCustomerId] = useState(null);
  const queryClient = useQueryClient();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["users"],
    queryFn: fetchUsers,
  });

  console.log({ data });

  function handleNavigate(href) {
    router.push(href);
  }

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

  if (isLoading) {
    return <Loader />;
  }

  if (isError) {
    return error?.message ?? "error";
  }

  return (
    <div className="">
      <div className="flex items-center justify-between">
        <Title text={"Users"} />
        <Button variant="outline" asChild>
          <Link href={"/users/create"}>Create</Link>
        </Button>
      </div>

      <div>
        <DataTable
          columns={columns(handleDelete, handleUserStatus, handleNavigate)}
          data={data}
        />
      </div>
    </div>
  );
}
