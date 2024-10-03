"use client";
import Loading from "@/components/loading";
import { CoursesColumns } from "@/components/table/courses/columns";
import { CoursesDataTable } from "@/components/table/courses/data-table";
import { endpoints } from "@/utils/endpoints";
import http from "@/utils/http";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

async function fetchCourses() {
  const { data } = await http().get(endpoints.tutor.courses);
  return data;
}

async function deleteCourses({ id }) {
  const { data } = await http().delete(`${endpoints.tutor.courses}/${id}`);
  return data;
}

export default function Page() {
  const queryClient = useQueryClient();
  const {
    data: courses,
    isLoading: isCoursesLoading,
    isError: isCoursesError,
    error: coursesError,
  } = useQuery({
    queryFn: fetchCourses,
    queryKey: ["courses"],
  });

  const deleteMutation = useMutation(deleteCourses, {
    onSuccess: (data) => {
      toast.success(data?.message ?? "Course deleted.");
      queryClient.invalidateQueries(["courses"]);
    },
    onError: (error) => {
      toast.error(error.message ?? "Failed to delete course!");
    },
  });

  async function handleDelete(data) {
    const confirmation = confirm("Are you sure?");
    if (!confirmation) return;
    deleteMutation.mutate(data);
  }

  return (
    <Courses
      {...{
        isCoursesLoading,
        courses,
        isCoursesError,
        coursesError,
        handleDelete,
      }}
    />
  );
}

export const Courses = ({
  isCoursesLoading,
  courses,
  isCoursesError,
  coursesError,
  handleDelete,
}) => {
  return (
    <div>
      {isCoursesError && (coursesError?.message ?? "Error")}
      {isCoursesLoading ? (
        <Loading />
      ) : (
        <CoursesDataTable
          data={courses}
          columns={CoursesColumns(handleDelete)}
        />
      )}
    </div>
  );
};
