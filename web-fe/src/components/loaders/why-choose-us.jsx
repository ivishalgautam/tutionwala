import React from "react";

export default function WhyChooseUsLoader() {
  return (
    <div class="relative h-[600px] animate-pulse">
      <div class="grid h-full bg-white/50 py-10 backdrop-blur-[200px] md:grid-cols-1 lg:grid-cols-2">
        <div class="flex items-center justify-center gap-10 p-8 lg:relative">
          <div class="h-full w-full rounded-lg bg-gray-200"></div>
        </div>
        <div class="space-y-16 p-8">
          <div class="space-y-4">
            <div class="h-5 w-1/4 rounded bg-gray-200"></div>
            <div class="h-10 w-1/2 rounded bg-gray-200"></div>
            <div class="h-5 w-3/4 rounded bg-gray-200"></div>
          </div>
          <div class="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }).map((_, key) => (
              <div key={key} class="h-16 rounded bg-gray-200"></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
