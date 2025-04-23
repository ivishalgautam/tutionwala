"use client";
import Loading from "@/components/loading";
import { useContext, useState } from "react";

// table imports
import { columns as tutorColumns } from "@/components/table/enquiries/tutors/columns";
import { columns as studentColumns } from "@/components/table/enquiries/students/columns";
import { DataTable as TutorsEnquiryDataTable } from "@/components/table/enquiries/tutors/data-table";
import { DataTable as StudentsEnquiryDataTable } from "@/components/table/enquiries/students/data-table";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Modal from "@/components/Modal";
import ReviewForm from "@/forms/review";
import { MainContext } from "@/store/context";
import http from "@/utils/http";
import { endpoints } from "@/utils/endpoints";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import FollowUps from "@/components/tutor-follow-ups";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { CreateFollowUpDialog } from "@/app/dashboard/enquiries/_components/create-followup-dialog";

async function fetchEnquiries() {
  const { data } = await http().get(endpoints.enquiries.getAll);
  return data;
}

async function updateEnquiry(data) {
  return await http().put(`${endpoints.enquiries.getAll}/${data.id}`, data);
}

async function deleteEnquiry({ id }) {
  const { data } = await http().delete(`${endpoints.enquiries.getAll}/${id}`);
  return data;
}

export default function AllEnquiries() {
  const [enquiryId, setEnquiryId] = useState("");
  const queryClient = useQueryClient();
  const { user, isUserLoading } = useContext(MainContext);
  const searchParams = useSearchParams();
  const tab = searchParams.get("tab") ?? "enquiries";

  const {
    data: enquiries,
    isLoading: isEnquiriesLoading,
    isError: isEnquiriesError,
    error: enquiriesError,
  } = useQuery({
    queryFn: fetchEnquiries,
    queryKey: ["enquiries"],
  });

  const updateEnqMutation = useMutation(updateEnquiry, {
    onSuccess: () => {
      toast.success("Updated");
      queryClient.invalidateQueries(["enquiries"]);
    },
    onError: (error) => {
      toast.error(error?.message ?? "An error occured!");
      queryClient.invalidateQueries(["enquiries"]);
    },
  });

  const deleteEnqMutation = useMutation(deleteEnquiry, {
    onSuccess: () => {
      toast.success("Enquiry deleted.");
      queryClient.invalidateQueries(["enquiries"]);
    },
    onError: (error) => {
      toast.error(error.message ?? "error");
    },
  });

  const handleUpdate = async (data) => {
    updateEnqMutation.mutate(data);
  };

  const handleDelete = async (id) => {
    deleteEnqMutation.mutate({ id: id });
  };

  return (
    <>
      <Enquiries
        {...{
          isEnquiriesLoading,
          isUserLoading,
          enquiries,
          user,
          handleDelete,
          handleUpdate,
          isEnquiriesError,
          enquiriesError,
          setEnquiryId,
        }}
      />
    </>
  );
}

export const Enquiries = ({
  isEnquiriesLoading,
  enquiries,
  user,
  isUserLoading,
  handleDelete,
  handleUpdate,
  isEnquiriesError,
  enquiriesError,
  setEnquiryId,
}) => {
  return (
    <div>
      {isEnquiriesError && (enquiriesError?.message ?? "Error")}
      {isEnquiriesLoading || isUserLoading ? (
        <Loading />
      ) : user?.role === "student" ? (
        <TutorEnquiries
          {...{
            enquiries,
            handleDelete,
            setEnquiryId,
          }}
        />
      ) : user?.role === "tutor" ? (
        <StudentEnquiries {...{ enquiries, handleDelete, handleUpdate }} />
      ) : null}
    </div>
  );
};

export const TutorEnquiries = ({ enquiries, handleDelete, setEnquiryId }) => {
  return (
    <TutorsEnquiryDataTable
      columns={tutorColumns(handleDelete, setEnquiryId)}
      data={enquiries?.map(
        ({
          id,
          tutor,
          created_at,
          status,
          sub_category_name,
          unread_chat_count,
        }) => ({
          id,
          sub_category_name,
          created_at,
          status,
          fullname: tutor[0].fullname,
          tutorId: tutor[0].tutor_id,
          unread_chat_count,
        }),
      )}
    />
  );
};

export const StudentEnquiries = ({ enquiries, handleDelete, handleUpdate }) => {
  const [studentId, setStudentId] = useState(null);
  const [isModal, setIsModal] = useState(false);

  return (
    <>
      <StudentsEnquiryDataTable
        columns={studentColumns(
          handleDelete,
          handleUpdate,
          setStudentId,
          setIsModal,
        )}
        data={enquiries?.map(
          ({
            id,
            status,
            student,
            created_at,
            sub_category_name,
            unread_chat_count,
            subjects,
          }) => ({
            id,
            sub_category_name,
            created_at,
            status,
            fullname: student[0].fullname,
            userId: student[0].user_id,
            studentId: student[0].student_id,
            email: student[0].email,
            mobile_number: student[0].mobile_number,
            unread_chat_count,
            subjects,
          }),
        )}
      />

      <CreateFollowUpDialog
        setIsModal={setIsModal}
        studentId={studentId}
        isModal={isModal}
      />
    </>
  );
};
