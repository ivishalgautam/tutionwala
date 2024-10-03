import React from "react";
import NextImage from "../next-image";
import { Large, Muted } from "../ui/typography";
import Link from "next/link";

export default function CategoryCard({ category }) {
  return (
    <div className="cursor-pointer rounded-md border bg-white p-8 px-14 shadow-sm transition-all hover:scale-95 hover:border-primary">
      <Link
        href={`/categories/${category.slug}/?categoryName=${category.name}`}
      >
        <figure className="size-20">
          <NextImage
            src={category.image}
            width={500}
            height={500}
            alt={category.name}
            className={"h-full w-full object-cover object-center"}
          />
        </figure>
        <div className="mt-4">
          <Large className={"text-center uppercase"}>{category.name}</Large>
          <Muted className={"block text-nowrap text-center text-xs uppercase"}>
            {category.courses}+ Course
          </Muted>
        </div>
      </Link>
    </div>
  );
}
