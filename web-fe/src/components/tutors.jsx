import TutorCard from "./card/tutor";
import { cn } from "@/lib/utils";
import { Muted } from "./ui/typography";

export default function Tutors({
  tutors = [],
  isLoading,
  className,
  searchParams,
}) {
  if (isLoading) {
    return (
      <div className={cn(className)}>
        {Array.from({ length: 10 }).map((_, key) => (
          <Loader key={key} className={className} />
        ))}
      </div>
    );
  }
  return tutors.length ? (
    <div
      className={cn(
        "flex flex-col items-start justify-center gap-4",
        className,
      )}
    >
      {tutors?.map((tutor, ind) => (
        <TutorCard
          key={ind}
          tutor={tutor.user}
          ratings={tutor.avg_ratings}
          totalReviews={tutor.total_reviews}
          searchParams={searchParams}
        />
      ))}
    </div>
  ) : (
    <div className="flex items-center justify-center">
      <Muted>No tutors found!</Muted>
    </div>
  );
}

export function Loader({ className }) {
  return (
    <div
      className={cn(
        "mb-2 flex h-[247.2px] w-full animate-pulse items-start justify-start gap-4 rounded bg-gray-100 p-4",
      )}
    >
      {/* image */}
      <div className="size-32 flex-shrink-0 animate-pulse rounded bg-gray-200"></div>
      <div className="flex h-full w-full flex-col justify-between">
        <div className="space-y-4">
          {/* name and ratings */}
          <div className="flex w-full items-center justify-between">
            <div className="h-[28px] w-[200px] animate-pulse rounded-full bg-gray-200"></div>
            <div className="h-[28px] w-[100px] animate-pulse rounded-full bg-gray-200"></div>
          </div>
          {/* experince */}
          <div className="space-y-1">
            <div className="h-5 w-full animate-pulse rounded-full bg-gray-200"></div>
            <div className="h-5 w-full animate-pulse rounded-full bg-gray-200"></div>
            <div className="h-5 w-4/5 animate-pulse rounded-full bg-gray-200"></div>
          </div>
        </div>
        {/* button */}
        <div className="flex items-center justify-end">
          <div className="h-10 w-24 animate-pulse rounded-lg bg-gray-200"></div>
        </div>
      </div>
    </div>
  );
}
