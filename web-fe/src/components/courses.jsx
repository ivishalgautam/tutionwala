import { createArraySlices } from "@/helpers/array-slice";
import Link from "next/link";

export const Courses = ({ courses = [], totalSlices = 5, sliceCount = 5 }) => {
  const sliceCounts = createArraySlices(totalSlices, sliceCount);

  return (
    <div className="grid grid-cols-2 gap-5 pl-4 md:grid-cols-3 lg:grid-cols-5">
      {sliceCounts.map(([from, to], ind) => (
        <ul className="list-disc marker:text-white" key={ind}>
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
