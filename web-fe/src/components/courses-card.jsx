import React from "react";
import NextImage from "./next-image";
import { H6, Muted } from "./ui/typography";
import Link from "next/link";

export default function CoursesCard({ courses = [] }) {
  return courses?.map((course) => (
    <Link key={course.id} href={`/tutors?category=${slug}`}>
      <div className="space-y-3">
        <figure className="">
          <NextImage
            src={course.image}
            width={200}
            height={200}
            alt={course.name}
            className={
              "aspect-video h-full w-full rounded-lg object-cover object-center drop-shadow-lg"
            }
          />
        </figure>
        <Muted className={"text-center"}>{course.name}</Muted>
      </div>
    </Link>
  ));
}
