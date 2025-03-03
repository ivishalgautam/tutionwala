"use client";
import { endpoints } from "@/utils/endpoints";
import http from "@/utils/http";
import { useQuery } from "@tanstack/react-query";
import React, { useMemo } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Loading from "./loading";
import Link from "next/link";
import { Small } from "./ui/typography";
import { Heading } from "./ui/heading";

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
                ({ name: tab, sub_categories: tabContent }) =>
                  tabContent.length > 0 && (
                    <TabsTrigger
                      value={tab}
                      key={tab}
                      className="data-[state=active]:bg-primary data-[state=active]:text-white"
                    >
                      {tab}
                    </TabsTrigger>
                  ),
              )}
            </TabsList>
          </div>
          {tabs?.map(
            ({ name: tab, sub_categories: tabContent }) =>
              tabContent.length > 0 && (
                <TabsContent
                  value={tab}
                  key={tab}
                  className="rounded-lg border bg-white p-4"
                >
                  <ul className="grid grid-cols-[repeat(auto-fill,minmax(180px,1fr))]">
                    {tabContent.map((item) => (
                      <li
                        key={item.name}
                        className="border-l p-2 text-sm hover:bg-gray-200"
                      >
                        <Link href={`/tutors?category=${item.slug}`}>
                          {item.name}
                        </Link>
                      </li>
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
