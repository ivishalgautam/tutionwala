"use client";
import { endpoints } from "@/utils/endpoints";
import http from "@/utils/http";
import { useQuery } from "@tanstack/react-query";
import React, { useMemo } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Loading from "./loading";
import Link from "next/link";
import { Large, Muted, Small } from "./ui/typography";
import { Heading } from "./ui/heading";
import Image from "next/image";
import NextImage from "./next-image";

async function fetchCategoriesTabs() {
  const { data } = await http().get(
    `${endpoints.categories.getAll}/tabular-form`,
  );
  return data;
}

export default function CategoriesTabs() {
  const {
    data = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryFn: fetchCategoriesTabs,
    queryKey: ["categories-tabs"],
    keepPreviousData: true,
  });
  const tabs = useMemo(() => data, [data]);

  if (isLoading) return <Loading />;
  if (isError) return error?.message ?? "Error";

  return (
    <div className="px-4 py-20 md:px-10 lg:p-16">
      <div className="space-y-2">
        <Heading title={"Find a Tutor for Anything!"} description={""} />
      </div>
      <div>
        <Tabs
          defaultValue={data?.find((item) => item.sub_categories.length).name}
          className=""
        >
          <div className="flex items-center justify-center">
            <TabsList className="border bg-white">
              {tabs?.map(
                ({ name: tab, sub_categories: tabContent, image }) =>
                  tabContent.length > 0 && (
                    <TabsTrigger
                      value={tab}
                      key={tab}
                      className="capitalize data-[state=active]:bg-primary data-[state=active]:text-white"
                    >
                      {tab}
                    </TabsTrigger>
                  ),
              )}
            </TabsList>
          </div>
          {tabs?.map(
            ({ name: tab, sub_categories: tabContent, image }) =>
              tabContent.length > 0 && (
                <TabsContent
                  value={tab}
                  key={tab}
                  className="rounded-lg border bg-white p-4"
                >
                  <ul className="grid grid-cols-[repeat(auto-fill,minmax(180px,1fr))] gap-4">
                    {tabContent.map((item) => (
                      <div
                        key={item.name}
                        className="w-full cursor-pointer rounded-md border bg-gray-100 p-2 shadow-sm transition-all hover:scale-95 hover:border-primary"
                      >
                        <Link href={`/tutors?category=${item.slug}`}>
                          <figure className="size-24 w-full">
                            <NextImage
                              src={item.image}
                              width={500}
                              height={500}
                              alt={item.name}
                              className={
                                "h-full w-full rounded-lg object-cover object-center"
                              }
                            />
                          </figure>
                          <div className="py-4">
                            <Muted className={"text-center uppercase"}>
                              {item.name}
                            </Muted>
                          </div>
                        </Link>
                      </div>
                    ))}
                  </ul>
                </TabsContent>
              ),
          )}
        </Tabs>
      </div>
    </div>
  );
}
