import NextImage from "../next-image";
import { Large, Muted } from "../ui/typography";
import Link from "next/link";

export default function CategoryCard({ category }) {
  return <Card2 category={category} />;
}

function Card1({ category }) {
  return (
    <div className="w-full cursor-pointer rounded-xl border bg-gray-50 p-6 transition-all hover:shadow-lg">
      <Link
        href={`/categories/${category.slug}/?categoryName=${category.name}`}
      >
        <div className="flex justify-center">
          <figure className="size-32 overflow-hidden rounded-full border bg-white">
            <NextImage
              src={category.image}
              width={500}
              height={500}
              alt={category.name}
              className={"h-full w-full object-cover object-center"}
            />
          </figure>
        </div>

        <div className="mt-4">
          <Large className={"text-center uppercase !text-primary"}>
            {category.name}
          </Large>
          <div className="mt-2 rounded-full bg-primary/10 px-3 py-1 ">
            <Muted
              className={"block text-nowrap text-center text-xs uppercase "}
            >
              {category.courses}+ Course
            </Muted>
          </div>
        </div>
      </Link>
    </div>
  );
}

function Card2({ category }) {
  return (
    <div className="w-full cursor-pointer overflow-hidden rounded-md border bg-gray-100 shadow-sm transition-all hover:scale-95 hover:border-primary">
      <Link
        href={`/categories/${category.slug}/?categoryName=${category.name}`}
      >
        <figure className="size-32 w-full">
          <NextImage
            src={category.image}
            width={500}
            height={500}
            alt={category.name}
            className={"h-full w-full object-cover object-center"}
          />
        </figure>
        <div className="py-4">
          <Large className={"text-center uppercase text-primary"}>
            {category.name}
          </Large>
          <Muted className={"block text-nowrap text-center text-xs uppercase"}>
            {category.courses}+ Course
          </Muted>
        </div>
      </Link>
    </div>
  );
}
