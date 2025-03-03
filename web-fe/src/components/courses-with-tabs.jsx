import CoursesByCategorySlug from "./courses-by-category-slug";
import { Heading } from "./ui/heading";
import { Small } from "./ui/typography";
import { Lightbulb } from "lucide-react";

export default function CoursesWithTabs({ slugs }) {
  return (
    <div>
      <div className="container space-y-10 py-10">
        <div className="space-y-2">
          <Small
            className={"flex items-center justify-center gap-1 text-primary"}
          >
            <Lightbulb size={20} />{" "}
            <span className="tracking-wide">Categories</span>
          </Small>
          <Heading title={"Explore Categories"} description={""} />
        </div>

        <div className="space-y-10">
          {slugs.map((slug) => (
            <div key={slug} className="space-y-4">
              <h5
                className={
                  "relative z-10 inline-flex w-max items-center text-lg font-medium uppercase"
                }
              >
                {slug.split("-").join(" ")}
              </h5>
              <CoursesByCategorySlug slug={slug} design="cards" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
