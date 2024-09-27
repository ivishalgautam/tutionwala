"use client";
import DashboardLayout from "@/components/layout/dashboard-layout";
import Loading from "@/components/loading";
import { CoursesColumns } from "@/components/table/courses/columns";
import { CoursesDataTable } from "@/components/table/courses/data-table";
import { endpoints } from "@/utils/endpoints";
import http from "@/utils/http";
import { useQuery } from "@tanstack/react-query";

async function fetchCourses() {
  const { data } = await http().get(endpoints.tutor.courses);
  return data;
}

export default function Page() {
  const {
    data: courses,
    isLoading: isCoursesLoading,
    isError: isCoursesError,
    error: coursesError,
  } = useQuery({
    queryFn: fetchCourses,
    queryKey: ["courses"],
  });

  return (
    <Courses {...{ isCoursesLoading, courses, isCoursesError, coursesError }} />
  );
}

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
