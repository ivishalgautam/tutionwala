"use client";
import { useSearchParams } from "next/navigation";
import { useContext, useState } from "react";

import { toast } from "sonner";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import Loading from "@/components/loading";
import { endpoints } from "@/utils/endpoints";
import http from "@/utils/http";
import Modal from "@/components/Modal";
import ReviewForm from "@/components/forms/review";

import { MainContext } from "@/store/context";

// table imports
import { columns as tutorColumns } from "@/components/table/enquiries/tutors/columns";
import { columns as studentColumns } from "@/components/table/enquiries/students/columns";
import { DataTable as TutorsEnquiryDataTable } from "@/components/table/enquiries/tutors/data-table";
import { DataTable as StudentsEnquiryDataTable } from "@/components/table/enquiries/students/data-table";
import { CoursesColumns } from "@/components/table/courses/columns";
import { CoursesDataTable } from "@/components/table/courses/data-table";
import DashboardLayout from "@/components/layout/dashboard-layout";
import Map from "@/components/map";

async function fetchEnquiries() {
  const { data } = await http().get(endpoints.enquiries.getAll);
  return data;
}

async function fetchCourses() {
  const { data } = await http().get(endpoints.tutor.courses);
  return data;
}
async function updateEnquiry(data) {
  return await http().put(`${endpoints.enquiries.getAll}/${data.id}`, data);
}

async function deleteEnquiry({ id }) {
  const { data } = await http().delete(`${endpoints.enquiries.getAll}/${id}`);
  return data;
}

export default function Page() {
  const { user, isUserLoading } = useContext(MainContext);
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();
  const currTab = searchParams.get("tab");
  const [isReviewModal, setIsReviewModal] = useState(false);
  const [tutorId, setTutorId] = useState("");
  const [enquiryId, setEnquiryId] = useState("");

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

  const {
    data: courses,
    isLoading: isCoursesLoading,
    isError: isCoursesError,
    error: coursesError,
  } = useQuery({
    queryFn: fetchCourses,
    queryKey: ["courses"],
    enabled: !!(currTab === "courses"),
  });

  const openReviewModal = () => {
    setIsReviewModal(true);
  };
  const closeReviewModal = () => {
    setIsReviewModal(false);
  };

  const updateEnqMutation = useMutation(updateEnquiry, {
    onSuccess: () => {
      toast.success("Updated");
      queryClient.invalidateQueries({ queryKey: ["enquiries"] });
    },
    onError: (error) => {
      toast.error(error?.message ?? "An error occured!");
      queryClient.invalidateQueries({ queryKey: ["enquiries"] });
    },
  });

  const deleteEnqMutation = useMutation(deleteEnquiry, {
    onSuccess: () => {
      toast.success("Enquiry deleted.");
      queryClient.invalidateQueries({ queryKey: ["enquiries"] });
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
      <DashboardLayout>
        {currTab === "enquiries" && (
          <Enquiries
            {...{
              isEnquiriesLoading,
              isUserLoading,
              enquiries,
              user,
              handleDelete,
              openReviewModal,
              setTutorId,
              handleUpdate,
              isEnquiriesError,
              enquiriesError,
              setEnquiryId,
            }}
          />
        )}

        {currTab === "courses" && (
          <Courses
            {...{ isCoursesLoading, courses, isCoursesError, coursesError }}
          />
        )}

        {currTab === "profile" && <Map />}
      </DashboardLayout>
      <Modal isOpen={isReviewModal} onClose={closeReviewModal}>
        <ReviewForm tutorId={tutorId} enquiryId={enquiryId} />
      </Modal>
    </>
  );
}

export const Enquiries = ({
  isEnquiriesLoading,
  enquiries,
  user,
  isUserLoading,
  handleDelete,
  openReviewModal,
  setTutorId,
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
            openReviewModal,
            setTutorId,
            setEnquiryId,
          }}
        />
      ) : user?.role === "tutor" ? (
        <StudentEnquiries {...{ enquiries, handleDelete, handleUpdate }} />
      ) : null}
    </div>
  );
};

export const TutorEnquiries = ({
  enquiries,
  handleDelete,
  openReviewModal,
  setTutorId,
  setEnquiryId,
}) => {
  return (
    <TutorsEnquiryDataTable
      columns={tutorColumns(
        handleDelete,
        openReviewModal,
        setTutorId,
        setEnquiryId,
      )}
      data={enquiries?.map(({ id, tutor, created_at, status }) => ({
        id,
        created_at,
        status,
        fullname: tutor[0].fullname,
        tutorId: tutor[0].tutor_id,
      }))}
    />
  );
};

export const StudentEnquiries = ({ enquiries, handleDelete, handleUpdate }) => {
  return (
    <StudentsEnquiryDataTable
      columns={studentColumns(handleDelete, handleUpdate)}
      data={enquiries?.map(({ id, status, student, created_at }) => ({
        id,
        created_at,
        status,
        fullname: student[0].fullname,
        userId: student[0].user_id,
        studentId: student[0].student_id,
      }))}
    />
  );
};

export const Courses = ({
  isCoursesLoading,
  courses,
  isCoursesError,
  coursesError,
}) => {
  return (
    <div>
      {isCoursesError && (coursesError?.message ?? "Error")}
      {isCoursesLoading ? (
        <Loading />
      ) : (
        <CoursesDataTable data={courses} columns={CoursesColumns()} />
      )}
    </div>
  );
};
