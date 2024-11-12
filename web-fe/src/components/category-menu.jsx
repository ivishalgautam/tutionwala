"use client";

import * as React from "react";
import Link from "next/link";

import { cn } from "@/lib/utils";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { DotsNine } from "phosphor-react";
import Loading from "./loading";
import http from "@/utils/http";
import { endpoints } from "@/utils/endpoints";
import { useQuery } from "@tanstack/react-query";
import NextImage from "./next-image";
import { Muted, Small } from "./ui/typography";

async function fetchCategories() {
  const { data } = await http().get(`${endpoints.categories.getAll}`);
  return data;
}

export function CategoryMenu() {
  const {
    data = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryFn: fetchCategories,
    queryKey: ["categories"],
    keepPreviousData: true,
  });

  if (isError) return error?.message ?? "Error";

  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger className="flex items-center justify-center gap-2 border">
            <DotsNine />
            <span className="hidden sm:block">Category</span>
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[200px] gap-3 p-4 sm:w-[400px] sm:grid-cols-2 md:w-[500px] lg:w-[600px] lg:grid-cols-[.75fr_1fr]">
              {data.map((category) => (
                <ListItem key={category.id} category={category}></ListItem>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}

const ListItem = React.forwardRef(
  ({ className, category, children, ...props }, ref) => {
    return (
      <li>
        <NavigationMenuLink asChild>
          <Link
            href={`/categories/${category.slug}?categoryName=${category.name}`}
            ref={ref}
            className={cn(
              "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
              className,
            )}
            {...props}
          >
            <div className="flex items-center justify-start gap-2 text-sm font-medium capitalize leading-none">
              <figure className="size-12">
                <NextImage
                  src={category.image}
                  width={100}
                  height={100}
                  alt={category.name}
                  className={"h-full w-full object-cover object-center"}
                />
              </figure>
              <div>
                <Small className={"font-medium uppercase"}>
                  {category.name}
                </Small>
                <Muted className={"text-xs"}>{category.courses}+ Courses</Muted>
              </div>
            </div>
            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
              {children}
            </p>
          </Link>
        </NavigationMenuLink>
      </li>
    );
  },
);
ListItem.displayName = "ListItem";
