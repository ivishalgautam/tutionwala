"use client";
import Loading from "@/components/loading";
import { columns as tutorColumns } from "@/components/table/enquiries/tutors/columns";
import { columns as studentColumns } from "@/components/table/enquiries/students/columns";
import { DataTable as TutorsEnquiryDataTable } from "@/components/table/enquiries/tutors/data-table";
import { DataTable as StudentsEnquiryDataTable } from "@/components/table/enquiries/students/data-table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Muted, Small } from "@/components/ui/typography";
import { cn } from "@/lib/utils";
import { MainContext } from "@/store/context";
import { endpoints } from "@/utils/endpoints";
import http from "@/utils/http";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import React, { useContext } from "react";
import { toast } from "sonner";

const tabs = [
  { value: "enquiries", label: "Enquiries", roles: ["student", "tutor"] },
  { value: "follow-ups", label: "Follow ups", roles: ["tutor"] },
];

async function fetchEnquiries() {
  const { data } = await http().get(endpoints.enquiries.getAll);
  return data;
}
async function deleteCategory({ id }) {
  const { data } = await http().delete(`${endpoints.enquiries.getAll}/${id}`);
  return data;
}

export default function Page() {
  const { user, isUserLoading } = useContext(MainContext);
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();
  const currTab = searchParams.get("tab");
  const {
    data: enquiries,
    isLoading: isEnquiriesLoading,
    isError: isEnquiriesError,
    error: enquiriesError,
  } = useQuery({
    queryFn: fetchEnquiries,
    queryKey: ["enquiries"],
    enabled: !!(currTab === "enquiries"),
  });

  const deleteMutation = useMutation(deleteCategory, {
    onSuccess: () => {
      toast.success("Enquiry deleted.");
      queryClient.invalidateQueries({ queryKey: ["enquiries"] });
    },
    onError: (error) => {
      toast.error(error.message ?? "error");
    },
  });

  const handleDelete = async (id) => {
    deleteMutation.mutate({ id: id });
  };
  return (
    <div className="min-h-screen bg-gray-200 py-4">
      <div className="container grid grid-cols-12 gap-4">
        <div className="col-span-3">
          <div className="overflow-hidden rounded bg-white shadow-sm">
            <div className="border-b-2 p-3">
              {isUserLoading ? (
                "loading..."
              ) : (
                <div className="flex items-start justify-start gap-2">
                  <figure className="size-20">
                    <Image
                      src={`${process.env.NEXT_PUBLIC_IMAGE_DOMAIN}/${user.profile_picture}`}
                      width={100}
                      height={100}
                      alt={user.fullname}
                      className="h-full w-full rounded"
                    />
                  </figure>
                  <div>
                    <Small>{user.fullname}</Small>
                    <Muted className={"text-xs capitalize"}>{user.role}</Muted>
                  </div>
                </div>
              )}
            </div>
            <ul className="space-y-[1px]">
              {["enquiries"].map((item) => (
                <li
                  key={item}
                  className={cn(
                    "relative text-xs font-medium uppercase transition-all hover:bg-gray-100 hover:before:absolute hover:before:left-0 hover:before:top-0 hover:before:h-full hover:before:w-1 hover:before:bg-primary",
                    {
                      "bg-gray-100 before:absolute before:left-0 before:top-0 before:h-full before:w-1 before:bg-primary":
                        currTab === item,
                    },
                  )}
                >
                  <Link
                    href={`?tab=${item}${item === "dashboard" ? `&stab=enquiries` : ""}`}
                    className="block p-3 px-6"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="col-span-9">
          <div className="rounded bg-white p-4">
            {isEnquiriesLoading ? (
              <Loading />
            ) : user.role === "student" ? (
              <TutorsEnquiryDataTable
                columns={tutorColumns(handleDelete)}
                data={enquiries?.map(({ id, tutor, created_at }) => ({
                  id,
                  created_at,
                  fullname: tutor[0].fullname,
                }))}
              />
            ) : user.role === "tutor" ? (
              <StudentsEnquiryDataTable
                columns={studentColumns(handleDelete)}
                data={enquiries?.map(({ id, student, created_at }) => ({
                  id,
                  created_at,
                  fullname: student[0].fullname,
                  userId: student[0].user_id,
                  studentId: student[0].student_id,
                }))}
              />
            ) : (
              <></>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
