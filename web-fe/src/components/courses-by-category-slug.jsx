"use client";
import { endpoints } from "@/utils/endpoints";
import http from "@/utils/http";
import { useQuery } from "@tanstack/react-query";
import Loading from "./loading";
import { H4 } from "./ui/typography";
import { useSearchParams } from "next/navigation";
import { Courses } from "./courses";

const fetchCourses = async (slug, page = 1) => {
  return await http().get(
    `${endpoints.subCategories.getAll}/getByCategorySlug/${slug}?limit=100&page=${page}`,
  );
};

export default function CoursesByCategorySlug({ slug, design = "list" }) {
  const searchParams = useSearchParams();
  const categoryName =
    design === "list" &&
    searchParams.get("categoryName").split("%20").join(" ");
  let page = searchParams.get("page");
  page = page ? Number(page) : 1;

  const { data, isLoading, isError, error } = useQuery({
    queryKey: [`courses-${slug}`],
    queryFn: () => fetchCourses(slug, page),
  });

  if (isLoading) return <Loading />;
  if (isError) return error?.message ?? "error";

  return (
    <div className="space-y-6">
      {design === "list" && <H4 className={"text-center"}>{categoryName}</H4>}

      <div>
        <Courses
          courses={data?.data}
          sliceCount={5}
          totalSlices={3}
          design={design}
        />
      </div>
    </div>
  );
}
