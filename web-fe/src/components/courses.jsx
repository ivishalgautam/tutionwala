import { createArraySlices } from "@/helpers/array-slice";
import CoursesList from "./courses-list";
import CoursesCard from "./courses-card";

export const Courses = ({
  courses = [],
  totalSlices = 5,
  sliceCount = 5,
  design = "list",
}) => {
  const sliceCounts = createArraySlices(totalSlices, sliceCount);
  return (
    <div>
      <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
        {design === "list" && (
          <CoursesList sliceCounts={sliceCounts} courses={courses} />
        )}
      </div>

      <div className="grid gap-5 gap-y-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
        {design === "cards" && <CoursesCard courses={courses} />}
      </div>
    </div>
  );
};
