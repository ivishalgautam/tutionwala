import { createArraySlices } from "@/helpers/array-slice";
import Link from "next/link";

export const Courses = ({ courses = [], totalSlices = 5, sliceCount = 5 }) => {
  const sliceCounts = createArraySlices(totalSlices, sliceCount);
  return (
    <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
      {sliceCounts.map(([from, to], ind) => (
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
      ))}
    </div>
  );
};
