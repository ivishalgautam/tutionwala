"use client";

import { endpoints } from "@/utils/endpoints";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
const Tutors = dynamic(() => import("./tutors"), {
  loading: () => (
    <div class="col-span-12 h-full rounded-md bg-gray-200 md:col-span-12 lg:col-span-8"></div>
  ),
});
import Image from "next/image";
import { H1, Muted, P, Small } from "./ui/typography";
import { useForm } from "react-hook-form";
import SubCategorySelect from "./select/sub-category-select";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";

import { Input } from "./ui/input";
import useMapLoader from "@/hooks/useMapLoader";
import { useAutocomplete } from "@/hooks/useAutoComplete";

import { Filter, Layers, Search, X } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import { buttonVariants } from "./ui/button";
import dynamic from "next/dynamic";
import { PaginationWithLinks } from "./pagination-with-links";
import { FilterForm } from "@/forms/filter";

const fetchTutors = async (params) => {
  let baseUrl = process.env.NEXT_PUBLIC_API_URL;
  const { data } = await axios.get(
    `${baseUrl}${endpoints.tutor.getAll}?${params}`,
  );
  return data;
};

export default function TutorsWithFilter() {
  const {
    control,
    formState: { errors },
    handleSubmit,
  } = useForm();

  const searchParams = useSearchParams();
  const page = Number(searchParams.get("page") ?? 1);
  const limit = Number(searchParams.get("limit") ?? 10);
  const mode = searchParams.get("mode");
  const router = useRouter();
  const searchParamsStr = searchParams.toString();
  const { data, isLoading } = useQuery({
    queryFn: () => fetchTutors(searchParamsStr),
    queryKey: ["tutors", searchParamsStr],
    enabled: !!searchParamsStr,
  });

  const paginationCount = Math.ceil(data?.total / limit);

  const queryString = useMemo(() => searchParams.toString(), [searchParams]);
  useEffect(() => {
    if (mode !== "online") return;

    const params = new URLSearchParams(queryString);
    ["addr", "lat", "lng", "place"].forEach((key) => params.delete(key));

    const newSearch = params.toString();

    if (newSearch !== queryString) {
      router.replace(`?${newSearch}`, { scroll: false });
    }
  }, [mode, router, queryString]);

  const onSubmit = (data) => {};

  useEffect(() => {
    if (!searchParamsStr) {
      const params = new URLSearchParams();
      params.set("page", 1);
      params.set("limit", 10);
      router.replace(`?${params.toString()}`);
    }
  }, [searchParamsStr, router]);

  return (
    <div className="bg-gray-100">
      <div className="container space-y-4 py-8">
        <div className="relative h-96 overflow-hidden rounded-lg before:absolute before:inset-0 before:bg-black/50">
          <Image
            src={"/images/search-banner.jpg"}
            width={1000}
            height={1000}
            alt="learn"
            className="h-full w-full object-cover object-center"
            priority={false}
            loading="lazy"
          />
          <div className="absolute left-1/2 top-20 flex -translate-x-1/2 flex-col items-center justify-center gap-2 text-white">
            <H1 className={"text-center"}>Find the Perfect Tutor for You</H1>
            <Small className={"text-center font-normal"}>
              Search and filter through expert tutors based on your learning
              needs, subject, experience, and availability.
            </Small>
          </div>
        </div>

        <div className="inline-block lg:hidden">
          <MobileFilter {...{ searchParams, handleSubmit, onSubmit }} />
        </div>

        <div className="text-2xl">{data?.total ?? 0} Tutors found.</div>

        <div className="grid grid-cols-12 gap-4">
          <div className="hidden w-full lg:col-span-4 lg:block">
            <FilterForm {...{ searchParams, handleSubmit, onSubmit }} />
          </div>

          <div className="col-span-12 rounded-md md:col-span-12 lg:col-span-8">
            <Tutors
              tutors={data?.data ?? []}
              isLoading={isLoading}
              searchParams={searchParams.toString()}
            />
            {paginationCount > 1 && (
              <div className="mt-10">
                <PaginationWithLinks
                  page={page}
                  pageSize={limit}
                  totalCount={data?.total}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export const FilterAddress = ({ searchParams }) => {
  const { isLoaded } = useMapLoader();
  const { inputRef, selectedPlace } = useAutocomplete(isLoaded);
  const router = useRouter();
  const isOffline = searchParams.get("mode");
  useEffect(() => {
    const addr = searchParams.get("addr");
    addr ? (inputRef.current.value = addr) : (inputRef.current.value = null);
  }, [searchParams, inputRef]);

  useEffect(() => {
    if (!selectedPlace) return;
    const newSearchParams = new URLSearchParams(searchParams.toString());
    const addressToSet = selectedPlace.address;
    const lat = selectedPlace?.location?.lat();
    const lng = selectedPlace?.location?.lng();

    if (searchParams.get("addr")) {
      newSearchParams.set("addr", addressToSet);
      newSearchParams.set("lat", lat);
      newSearchParams.set("lng", lng);
    } else {
      newSearchParams.append("addr", addressToSet);
      newSearchParams.append("lat", lat);
      newSearchParams.append("lng", lng);
    }

    if (!addressToSet) {
      newSearchParams.delete("addr");
      newSearchParams.delete("lat");
      newSearchParams.delete("lng");
    }

    router.push(`?${newSearchParams.toString()}`, { scroll: false });
  }, [selectedPlace, searchParams, router]);

  return <Input ref={inputRef} placeholder="Filter by location" />;
};

const MobileFilter = ({ searchParams, handleSubmit, onSubmit }) => {
  return (
    <Sheet>
      <SheetTrigger className={buttonVariants({ variant: "outline" })}>
        <Filter size={15} /> &nbsp; Filter
      </SheetTrigger>
      <SheetContent side="left">
        <SheetHeader>
          <SheetTitle>Select filteration</SheetTitle>
          <FilterForm {...{ searchParams, handleSubmit, onSubmit }} />
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
};
