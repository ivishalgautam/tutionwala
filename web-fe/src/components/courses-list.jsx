import Link from "next/link";
import React from "react";

export default function CoursesList({ sliceCounts, courses = [] }) {
  return sliceCounts.map(([from, to], ind) => (
    <ul className="" key={ind}>
      {courses?.slice(from, to).map(({ id, name, slug }) => (
        <div key={id}>
          <li>
            <Link
              href={`/tutors?category=${slug}`}
              className="text-sm font-medium capitalize underline-offset-2 transition-colors hover:underline"
            >
              {name}
            </Link>
          </li>
        </div>
      ))}
    </ul>
  ));
}
