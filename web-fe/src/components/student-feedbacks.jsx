import { cn } from "@/lib/utils";
import Image from "next/image";
import Marquee from "./marquee";
import { H2, Muted, Small } from "./ui/typography";
import { Lightbulb } from "lucide-react";

const reviews = [
  {
    tutor_name: "Jack",
    body: "I've never seen anything like this before. It's amazing. I love it.",
    img: "/images/not-found.png",
    student_name: "Student Name",
  },
  {
    tutor_name: "Jill",
    body: "I don't know what to say. I'm speechless. This is amazing.",
    img: "/images/not-found.png",
    student_name: "Student Name",
  },
  {
    tutor_name: "John",
    body: "I'm at a loss for words. This is amazing. I love it.",
    img: "/images/not-found.png",
    student_name: "Student Name",
  },
  {
    tutor_name: "Jane",
    body: "I'm at a loss for words. This is amazing. I love it.",
    img: "/images/not-found.png",
    student_name: "Student Name",
  },
  {
    tutor_name: "Jenny",
    body: "I'm at a loss for words. This is amazing. I love it.",
    img: "/images/not-found.png",
    student_name: "Student Name",
  },
  {
    tutor_name: "James",
    body: "I'm at a loss for words. This is amazing. I love it.",
    img: "/images/not-found.png",
    student_name: "Student Name",
  },
];

const firstRow = reviews.slice(0, reviews.length / 2);
const secondRow = reviews.slice(reviews.length / 2);

const ReviewCard = ({ img, tutor_name, student_name, body }) => {
  return (
    <figure
      className={cn(
        "relative w-64 cursor-pointer overflow-hidden rounded-xl border p-4",
        // light styles
        "border-gray-950/[.1] bg-gray-950/[.05]",
        // dark styles
        "dark:border-gray-50/[.1] dark:bg-gray-50/[.10] dark:hover:bg-gray-50/[.15]",
      )}
    >
      <div className="flex flex-row items-center gap-2">
        <Image
          className="rounded-full"
          width="32"
          height="32"
          alt=""
          src={img}
        />
        <div className="flex flex-col">
          <figcaption className="text-sm font-medium dark:text-white">
            {tutor_name}
          </figcaption>
        </div>
      </div>
      <div className="h-full rounded-lg p-3 py-2">
        <blockquote className="h-[60px] text-sm">{body}</blockquote>
        <Muted className={"text-end text-xs font-medium"}>
          ~{student_name}
        </Muted>
      </div>
    </figure>
  );
};

export default async function StudentReviewCards() {
  return (
    <div className="relative flex min-h-screen w-full flex-col items-center justify-center gap-12 overflow-x-hidden rounded-lg border bg-background py-20">
      <div className="space-y-4">
        <Small
          className={"flex items-center justify-center gap-1 text-primary"}
        >
          <Lightbulb size={20} />{" "}
          <span className="tracking-wide">Student Review</span>
        </Small>
        <H2 className={"text-center text-4xl font-extrabold"}>
          Our Students Feedback
        </H2>
        <Muted className={"text-center"}>
          You&apos;ll find something to spark your curiosity and enhance
        </Muted>
      </div>

      <div>
        <Marquee pauseOnHover className="[--duration:20s]">
          {firstRow.map((review) => (
            <ReviewCard key={review.username} {...review} />
          ))}
        </Marquee>
        <Marquee reverse pauseOnHover className="[--duration:20s]">
          {secondRow.map((review) => (
            <ReviewCard key={review.username} {...review} />
          ))}
        </Marquee>
      </div>
      <div className="pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-white dark:from-background"></div>
      <div className="pointer-events-none absolute inset-y-0 right-0 w-1/3 bg-gradient-to-l from-white dark:from-background"></div>
    </div>
  );
}
