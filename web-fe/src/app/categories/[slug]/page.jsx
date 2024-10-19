const CoursesByCategorySlug = dynamic(
  () => import("@/components/courses-by-category-slug"),
  {
    loading: () => <Loading />,
  },
);
import Loading from "@/components/loading";
import dynamic from "next/dynamic";
import React from "react";

export default function Page({ params: { slug } }) {
  return (
    <div className="mx-auto min-h-screen max-w-screen-xl bg-white p-4">
      <CoursesByCategorySlug slug={slug} />
    </div>
  );
}
