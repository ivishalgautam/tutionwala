"use client";

import { endpoints } from "@/utils/endpoints";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Tutors from "./tutors";
import Image from "next/image";
import { H1, Large, Muted, Small } from "./ui/typography";
import { useForm } from "react-hook-form";
import SubCategorySelect from "./select/sub-category-select";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import PaginationControl from "./pagination";
import LanguageSelect from "./select/language-select";
import GenderSelect from "./select/gender-select";
import RatingSelect from "./select/rating-select";
import { Input } from "./ui/input";
import useMapLoader from "@/hooks/useMapLoader";
import { useAutocomplete } from "@/hooks/useAutoComplete";
import DemoClassSelect from "./select/demo-class-select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";
import { Filter, Layers, Search, X } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import { Button, buttonVariants } from "./ui/button";
import { cn } from "@/lib/utils";
import ClassConductSelect from "./select/class-conduct-select";

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
  const router = useRouter();

  // show filtered data
  // const allowedFilterKeys = [
  //   "category",
  //   "language",
  //   "gender",
  //   "demo",
  //   "rating",
  //   "addr",
  // ];

  // const arrayFilterKeys = useMemo(() => ["category", "language", "rating"], []);
  // const filters = useCallback(() => {
  //   const obj = {};

  //   for (const [key, value] of searchParams.entries()) {
  //     if (!allowedFilterKeys.includes(key)) continue;

  //     if (arrayFilterKeys.includes(key)) {
  //       obj[key] = obj[key]
  //         ? [...obj[key], ...value.split(" ")]
  //         : value.split(" ");
  //     } else {
  //       obj[key] = value;
  //     }
  //   }

  //   return obj;
  // }, [searchParams, router]);

  // const selectedFilters = filters();

  // const deleteSearchParam = useCallback(
  //   (name, eleToDelete = null) => {
  //     const urlSearchParam = new URLSearchParams(searchParams.toString());
  //     const param = urlSearchParam.get(name);

  //     if (param) {
  //       let valueToSet = "";

  //       if (arrayFilterKeys.includes(name)) {
  //         const values = param.split(" ").filter((el) => el !== eleToDelete);
  //         valueToSet = values.join(" ");
  //         if (valueToSet) {
  //           urlSearchParam.set(name, valueToSet);
  //         } else {
  //           urlSearchParam.delete(name);
  //         }
  //       } else {
  //         if (name === "addr") {
  //           urlSearchParam.delete("addr");
  //           urlSearchParam.delete("lat");
  //           urlSearchParam.delete("lng");
  //         } else {
  //           urlSearchParam.delete(name);
  //         }
  //       }
  //       router.push(`?${urlSearchParam.toString()}`);
  //     }
  //   },
  //   [searchParams, arrayFilterKeys, router],
  // );

  const { data, isLoading } = useQuery({
    queryFn: () => fetchTutors(searchParams.toString()),
    queryKey: ["tutors", searchParams.toString()],
  });
  const paginationCount = Math.ceil(data?.total / limit);

  const createQueryString = useCallback(
    (name, value) => {
      const params = new URLSearchParams(searchParams.toString());
      if (params.get(name)) {
        params.set(name, value);
      } else {
        params.append(name, value);
      }

      return params.toString();
    },
    [searchParams],
  );

  const onSubmit = (data) => {};

  useEffect(() => {
    if (!page) {
      router.push(`?${createQueryString("page", 1)}`);
    }
    if (!limit) {
      router.push(`?${createQueryString("limit", 10)}`);
    }
  }, [page, limit, createQueryString, router]);

  return (
    <div className="bg-gray-100">
      <div className="container space-y-4 py-8">
        <div className="relative h-80 overflow-hidden rounded-lg before:absolute before:inset-0 before:bg-black/50">
          <Image
            src={"/images/search-banner.jpg"}
            width={2000}
            height={2000}
            alt="learn"
            className="h-full w-full object-cover object-center"
          />
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-white">
            <H1 className={"text-center"}>Find the Perfect Tutor for You</H1>
            <Small className={"text-center font-normal"}>
              Search and filter through expert tutors based on your learning
              needs, subject, experience, and availability.
            </Small>
          </div>
        </div>

        {/* selected filters */}
        {/* <SelectedFilters {...{ selectedFilters, deleteSearchParam }} /> */}
        <div className="inline-block lg:hidden">
          <MobileFilter {...{ searchParams, handleSubmit, onSubmit }} />
        </div>

        <div className="text-2xl">{data?.total ?? 0} Tutors found.</div>

        <div className="items-center justify-start space-y-2 divide-y rounded-lg border bg-white p-4 shadow-sm md:flex md:space-y-0 md:divide-x md:divide-y-0 md:py-2">
          <div className="flex flex-1 items-center justify-start">
            <span className="flex-grow-0 text-gray-500">
              <Search />
            </span>
            <FilterAddress searchParams={searchParams} />
          </div>

          <div className="flex flex-1 items-center justify-start gap-1.5 pt-2 md:pl-4 md:pt-0">
            <span className="flex-grow-0 text-gray-500">
              <Layers size={20} />
            </span>
            <div className="flex-grow">
              <SubCategorySelect isMulti={true} searchParams={searchParams} />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-4">
          <div className="hidden w-full lg:col-span-4 lg:block">
            <FilterForm {...{ searchParams, handleSubmit, onSubmit }} />
          </div>

          <div className="col-span-12 rounded-md md:col-span-12 lg:col-span-8">
            <Tutors tutors={data?.data ?? []} isLoading={isLoading} />
            {paginationCount > 1 && (
              <div className="mt-10">
                <PaginationControl
                  {...{ page, paginationCount, createQueryString }}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export const FilterForm = ({ searchParams, handleSubmit, onSubmit }) => {
  const tabs = [
    // {
    //   name: "Address?",
    //   comp: <FilterAddress searchParams={searchParams} />,
    //   className: "block lg:hidden",
    // },
    // {
    //   name: "Category?",
    //   comp: <SubCategorySelect searchParams={searchParams} />,
    //   className: "block lg:hidden",
    // },
    {
      name: "Languages?",
      comp: <LanguageSelect searchParams={searchParams} />,
      className: "",
    },
    {
      name: "Gender?",
      comp: <GenderSelect searchParams={searchParams} />,
      className: "",
    },
    {
      name: "Rating?",
      comp: <RatingSelect searchParams={searchParams} />,
      className: "",
    },
    {
      name: "Demo Classes?",
      comp: <DemoClassSelect searchParams={searchParams} />,
      className: "",
    },
    {
      name: "Class conduct mode?",
      comp: <ClassConductSelect searchParams={searchParams} />,
      className: "",
    },
  ];

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="space-y-4 rounded-lg border border-gray-200 bg-white p-4">
        <Accordion type="multiple" className="space-y-2">
          {tabs.map((item, ind) => (
            <AccordionItem
              value={`item-${ind + 1}`}
              key={ind}
              className={cn(
                "rounded-lg border-b-0 bg-gray-100",
                item.className,
              )}
            >
              <AccordionTrigger className="border-b-0 p-3">
                {item.name}
              </AccordionTrigger>
              <AccordionContent className="px-4">{item.comp}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </form>
  );
};

export const FilterAddress = ({ searchParams }) => {
  const { isLoaded } = useMapLoader();
  const { inputRef, selectedPlace } = useAutocomplete(isLoaded);
  const router = useRouter();
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

    router.push(`?${newSearchParams.toString()}`);
  }, [selectedPlace, searchParams, router]);

  return (
    <Input
      ref={inputRef}
      className={"w-full border-none bg-transparent text-base"}
      placeholder="Filter by location"
    />
  );
};

export const SelectedFilters = ({ selectedFilters, deleteSearchParam }) => {
  const Badge = ({ children, ...args }) => {
    return (
      <div
        className="flex cursor-pointer items-center gap-2 rounded-xl bg-primary-200 px-3 py-1 text-xs font-medium text-black"
        {...args}
      >
        <span>{children}</span>
        <span>
          <X size={15} />
        </span>
      </div>
    );
  };

  return (
    <div className="flex flex-wrap items-center justify-start gap-2">
      {Object.keys(selectedFilters)?.map((key, ind) => (
        <div key={ind} className="rounded bg-white/50 p-2">
          <Muted className={"text-xs capitalize"}>{key}</Muted>
          <div className="flex space-x-1">
            {Array.isArray(selectedFilters[key]) ? (
              selectedFilters[key].map((filter) => (
                <Badge
                  key={filter}
                  onClick={() => deleteSearchParam(key, filter)}
                >
                  {filter}
                </Badge>
              ))
            ) : (
              <Badge onClick={() => deleteSearchParam(key)}>
                {selectedFilters[key]}
              </Badge>
            )}
          </div>
        </div>
      ))}
    </div>
  );
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
