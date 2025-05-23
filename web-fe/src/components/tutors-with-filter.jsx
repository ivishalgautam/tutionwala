"use client";

import { endpoints } from "@/utils/endpoints";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
const Tutors = dynamic(() => import("./tutors"), {
  loading: () => (
    <div className="col-span-12 h-full rounded-md bg-gray-200 md:col-span-12 lg:col-span-8"></div>
  ),
});
import Image from "next/image";
import { H1, Small } from "./ui/typography";
import { useForm } from "react-hook-form";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import { Input } from "./ui/input";
import useMapLoader from "@/hooks/useMapLoader";
import { useAutocomplete } from "@/hooks/useAutoComplete";

import { Filter } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import { Button, buttonVariants } from "./ui/button";
import dynamic from "next/dynamic";
import { PaginationWithLinks } from "./pagination-with-links";
import { FilterForm } from "@/forms/filter";
import ResetAllFilters from "./reset-all-filters";
import { useQueryState } from "nuqs";
import { cn } from "@/lib/utils";

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
          <div className="absolute left-1/2 top-20 -translate-x-1/2 gap-2 text-white">
            <h1
              className={
                "w-full shrink-0  text-wrap text-center text-2xl font-extrabold capitalize md:text-4xl"
              }
            >
              Find the Perfect Tutor for You
            </h1>
            <p className={"text-center text-sm font-normal"}>
              Search and filter through expert tutors based on your learning
              needs, subject, experience, and availability.
            </p>
          </div>
        </div>

        <div className="inline-block lg:hidden">
          <MobileFilter {...{ searchParams, handleSubmit, onSubmit }} />
        </div>

        <div className="flex items-center justify-between">
          <div className="text-2xl">{data?.total ?? 0} Tutors found.</div>
          <ResetAllFilters />
        </div>

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
            {paginationCount > 0 && (
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

export const FilterAddress = () => {
  const { isLoaded } = useMapLoader();
  const { inputRef, selectedPlace } = useAutocomplete(isLoaded);

  // nuqs query state for addr, lat, lng
  const [addr, setAddr] = useQueryState("addr", {
    history: "push",
    scroll: false,
  });
  const [lat, setLat] = useQueryState("lat", {
    history: "push",
    scroll: false,
  });
  const [lng, setLng] = useQueryState("lng", {
    history: "push",
    scroll: false,
  });

  // Populate input field from addr query param
  useEffect(() => {
    if (!inputRef.current) return;
    inputRef.current.value = addr ?? "";
  }, [addr, inputRef]);

  // Update query params on place select
  useEffect(() => {
    if (!selectedPlace) return;

    const addressToSet = selectedPlace.address;
    const latValue = selectedPlace?.location?.lat();
    const lngValue = selectedPlace?.location?.lng();

    if (addressToSet) {
      setAddr(addressToSet);
      setLat(String(latValue));
      setLng(String(lngValue));
    } else {
      setAddr(null);
      setLat(null);
      setLng(null);
    }
  }, [selectedPlace, setAddr, setLat, setLng]);

  const handleReset = () => {
    setAddr(null);
    setLat(null);
    setLng(null);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Input
        ref={inputRef}
        placeholder="Filter by location"
        className="flex-1"
      />
      {(addr || lat || lng) && (
        <Button type="button" onClick={handleReset}>
          Reset
        </Button>
      )}
    </div>
  );
};

const MobileFilter = ({ searchParams, handleSubmit, onSubmit }) => {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <Button type="button" variant="outline" onClick={() => setOpen(true)}>
        <Filter size={15} className="mr-1" /> Filter
      </Button>

      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sliding Panel */}
      <div
        className={cn(
          "fixed left-0 top-0 z-50 h-full w-3/4 max-w-sm bg-background p-6 shadow-lg transition-transform duration-300 ease-in-out",
          open ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Select Filtration</h2>
          <Button
            type="button"
            onClick={() => setOpen(false)}
            className="text-white"
          >
            ✕
          </Button>
        </div>

        {/* Your Filter Form */}
        <FilterForm {...{ searchParams, handleSubmit, onSubmit }} />
      </div>
    </div>
  );
};
