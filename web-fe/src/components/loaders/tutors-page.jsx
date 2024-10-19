import React from "react";

export default function TutorsPageLoader() {
  return (
    <div class="bg-gray-100">
      <div class="container animate-pulse space-y-4 py-8">
        <div class="relative h-80 overflow-hidden rounded-lg bg-gray-200"></div>
        <div class="block h-10 w-full rounded bg-gray-200 lg:hidden"></div>
        <div class="h-10 w-1/4 rounded bg-gray-200 text-2xl"></div>
        <div class="items-center justify-start gap-2 space-y-2 divide-y rounded-lg md:flex md:space-y-0 md:divide-x md:divide-y-0 md:py-2">
          <div class="flex h-12 flex-1 items-center justify-start rounded bg-gray-200"></div>
          <div class="flex h-12 flex-1 items-center justify-start gap-1.5 rounded bg-gray-200 pt-2 md:pl-4 md:pt-0"></div>
        </div>
        <div class="grid grid-cols-12 gap-4">
          <div className="hidden w-full space-y-2 lg:col-span-4 lg:block">
            {Array.from({ length: 6 }).map((_, key) => (
              <div key={key} class="h-12 w-full rounded bg-gray-200"></div>
            ))}
          </div>
          <div class="col-span-12 h-full rounded-md bg-gray-200 md:col-span-12 lg:col-span-8"></div>
        </div>
      </div>
    </div>
  );
}