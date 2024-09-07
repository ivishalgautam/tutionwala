"use client";
import Title from "@/components/Title";
import { columns } from "./columns";
import { DataTable } from "./data-table";
import { buttonVariants } from "@/components/ui/button";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import http from "@/utils/http";
import { endpoints } from "@/utils/endpoints";
import Spinner from "@/components/Spinner";
import { toast } from "sonner";
import Link from "next/link";
import { useRouter } from "next/navigation";

async function deleteSubCategory(data) {
  return http().delete(`${endpoints.subCategories.getAll}/${data.id}`);
}

async function fetchSubCategories() {
  const { data } = await http().get(endpoints.subCategories.getAll);
  return data;
}

export default function Categories() {
  const queryClient = useQueryClient();
  const router = useRouter();

  const { data, isLoading, isError, error } = useQuery({
    queryFn: fetchSubCategories,
    queryKey: ["sub-categories"],
  });

  const deleteMutation = useMutation(deleteSubCategory, {
    onSuccess: () => {
      toast.success("Sub category deleted.");
      queryClient.invalidateQueries({ queryKey: ["sub-categories"] });
    },
    onError: (error) => {
      toast.error(error.message ?? "error");
    },
  });

  const handleDelete = async (id) => {
    deleteMutation.mutate({ id: id });
  };

  const handleNavigate = (href) => {
    router.push(href);
  };

  if (isLoading) {
    return <Spinner />;
  }

  if (isError) {
    toast.error(error.message);
    return "error";
  }

  return (
    <div className="border-input container mx-auto rounded-lg bg-white p-8">
      <div className="flex items-center justify-between">
        <Title text={"Sub Categories"} />

        <Link
          className={buttonVariants("default")}
          href={"/sub-categories/create"}
        >
          Create
        </Link>
      </div>
      <div>
        <DataTable
          columns={columns(handleDelete, handleNavigate)}
          data={data}
        />
      </div>
    </div>
  );
}
