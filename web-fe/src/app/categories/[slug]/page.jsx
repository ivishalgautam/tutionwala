import CoursesByCategorySlug from "@/components/courses-by-category-slug";
import React from "react";

export default function Page({ params: { slug } }) {
  return (
    <div className="mx-auto min-h-screen max-w-screen-xl bg-white p-4">
      <CoursesByCategorySlug slug={slug} />
    </div>
  );
}
