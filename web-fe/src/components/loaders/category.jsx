import React from "react";

export default function CategoryLoader() {
  return (
    <div className="animate-pulse bg-gray-200 p-4 md:p-10 lg:p-16">
      <div>
        <div className="mx-auto h-4 w-1/4 rounded bg-gray-300"></div>
        <div className="mx-auto mt-2 h-6 w-1/2 rounded bg-gray-300"></div>
        <div className="mx-auto mt-2 h-4 w-3/4 rounded bg-gray-300"></div>
      </div>
      <section className="mt-8">
        <div>
          <div className="flex space-x-4 overflow-x-hidden">
            {Array.from({ length: 12 }).map((_, key) => (
              <div
                key={key}
                className="size-44 flex-shrink-0 rounded bg-gray-300"
              ></div>
            ))}
          </div>
        </div>
        <div className="mt-4 flex items-center justify-end">
          <div className="flex items-center justify-end gap-2">
            <div className="mr-1 h-8 w-8 rounded-full bg-gray-300"></div>
            <div className="h-8 w-8 rounded-full bg-gray-300"></div>
          </div>
        </div>
      </section>
    </div>
  );
}
