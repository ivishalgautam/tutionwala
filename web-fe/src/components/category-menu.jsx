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
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { DotsNine } from "phosphor-react";
import Loading from "./loading";
import http from "@/utils/http";
import { endpoints } from "@/utils/endpoints";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import NextImage from "./next-image";
import { H5, H6, Large, Muted, Small } from "./ui/typography";

async function fetchCategories() {
  const { data } = await http().get(`${endpoints.categories.getAll}`);
  return data;
}

export function CategoryMenu() {
  const { data, isLoading, isError, error } = useQuery({
    queryFn: fetchCategories,
    queryKey: ["categories"],
    keepPreviousData: true,
  });
  if (isLoading) return <Loading />;
  if (isError) return error?.message ?? "Error";

  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger className="flex items-center justify-center gap-2 border">
            <DotsNine />
            <span>Category</span>
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] lg:grid-cols-3">
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
            // href={category.slug}
            href={"#"}
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
