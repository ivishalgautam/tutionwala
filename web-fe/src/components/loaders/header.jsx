import React from "react";
import CategoryMenuLoader from "./category-menu";

export default function HeaderLoader() {
  return (
    <div className="animate-pulse bg-gray-200">
      <div className="container flex h-24 w-full items-center justify-between rounded">
        <div className="flex items-center justify-start gap-8">
          <div className="h-12 w-24 rounded-lg bg-gray-300"></div>
          <CategoryMenuLoader />
        </div>
        <div className="hidden items-center justify-center gap-2 lg:flex">
          {Array.from({ length: 4 }).map((_, key) => (
            <div key={key} className="h-10 w-24 rounded-lg bg-gray-300"></div>
          ))}
        </div>
        <div className="hidden items-center justify-center gap-2 lg:flex">
          <div className="h-10 w-24 rounded-lg bg-gray-300"></div>
          <div className="h-10 w-32 rounded-lg bg-gray-300"></div>
        </div>
      </div>
    </div>
  );
}
