"use client";

import { endpoints } from "@/utils/endpoints";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Tutors from "./tutors";
import Image from "next/image";
import { H1, Small } from "./ui/typography";
import { useForm } from "react-hook-form";
import SubCategorySelect from "./select/sub-category-select";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect } from "react";
import PaginationControl from "./pagination";
import LanguageSelect from "./select/language-select";
import GenderSelect from "./select/gender-select";
import RatingSelect from "./select/rating-select";

const fetchTutors = async (params) => {
  let baseUrl = process.env.NEXT_PUBLIC_API_URL;
  const { data } = await axios.get(
    `${baseUrl}${endpoints.tutor.getAll}?${params}`,
  );
  return data;
};

export default function TutorsWithFilter() {
  const searchParams = useSearchParams();
  const page = parseInt(searchParams.get("page"), 10);
  const limit = parseInt(searchParams.get("limit"), 10);
  const router = useRouter();

  const {
    control,
    formState: { errors },
    handleSubmit,
  } = useForm();

  const { data, isLoading } = useQuery({
    queryFn: () => fetchTutors(searchParams.toString()),
    queryKey: ["tutors", searchParams.toString()],
  });

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

  const onSubmit = (data) => {
    console.log({ data });
  };

  const paginationCount = Math.ceil(data?.total / limit);

  useEffect(() => {
    if (!page) {
      router.push(`?${createQueryString("page", 1)}`);
    }
    if (!limit) {
      router.push(`?${createQueryString("limit", 2)}`);
    }
  }, [page, limit, createQueryString, router]);

  return (
    <div>
      <div className="relative h-80 before:absolute before:inset-0 before:bg-black/50">
        <Image
          src={"/images/search-banner.jpg"}
          width={2000}
          height={2000}
          alt="learn"
          className="h-full w-full object-cover object-center"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-white">
          <H1>Find the Perfect Tutor for You</H1>
          <Small className={"text-center font-normal"}>
            Search and filter through expert tutors based on your learning
            needs, subject, experience, and availability.
          </Small>
        </div>
        <div className="absolute -bottom-14 left-0 -mt-4 w-full p-4">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-wrap items-center justify-start gap-2 rounded bg-white p-4 shadow-lg">
              <div className="flex-grow">
                <SubCategorySelect isMulti={true} searchParams={searchParams} />
              </div>

              <div className="flex-grow">
                <LanguageSelect searchParams={searchParams} />
              </div>

              <div className="flex-grow">
                <GenderSelect searchParams={searchParams} />
              </div>

              <div className="flex-grow">
                <RatingSelect searchParams={searchParams} />
              </div>
            </div>
          </form>
        </div>
      </div>

      <div className="container mt-32">
        <Tutors
          tutors={data?.data ?? []}
          isLoading={isLoading}
          className={"grid gap-2 lg:grid-cols-2"}
        />
        {paginationCount > 1 && (
          <div className="mt-10">
            <PaginationControl
              {...{ page, paginationCount, createQueryString }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
