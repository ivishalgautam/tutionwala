import React from "react";

export default function HeroLoader() {
  return (
    <div class="animate-pulse bg-gradient-to-b from-primary-25 to-primary-50">
      <section class="mx-auto max-w-screen-xl items-center gap-8 px-4 pb-24 pt-24 md:px-8 lg:flex">
        <div class="flex-1 space-y-8 sm:text-center lg:text-left">
          <div className="space-y-2 ">
            <div class="h-12 w-full rounded-full bg-gray-200"></div>
            <div class="mx-auto h-12 w-56 rounded-full bg-gray-200 lg:mx-0"></div>
          </div>

          <div class="space-y-1">
            <div className="h-4 w-full rounded-full bg-gray-200"></div>
            <div className="h-4 w-full rounded-full bg-gray-200"></div>
            <div className="h-4 w-full rounded-full bg-gray-200"></div>
            <div className="h-4 w-full rounded-full bg-gray-200"></div>
          </div>

          <div className="space-y-2">
            <div class="h-4 w-48 rounded-full bg-gray-200"></div>
            <form class="items-center space-y-3 sm:flex sm:justify-start sm:space-x-3 sm:space-y-0 lg:justify-start">
              <SearchCategoryLoader />
            </form>
          </div>
        </div>

        <div class="mt-4 flex-1 text-center lg:ml-3 lg:mt-0">
          <div class="mx-auto h-[420.45px] w-[602px] rounded bg-gray-200"></div>
        </div>
      </section>
    </div>
  );
}

export const SearchCategoryLoader = () => {
  return <div class="h-12 basis-4/5 rounded bg-gray-200" />;
};
