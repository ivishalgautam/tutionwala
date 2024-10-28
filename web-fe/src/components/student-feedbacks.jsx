"use client";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Marquee from "./marquee";
import { Muted, Small } from "./ui/typography";
import { Lightbulb } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import http from "@/utils/http";
import { endpoints } from "@/utils/endpoints";
import Loading from "./loading";
import { Rating } from "@smastrom/react-rating";
import "@smastrom/react-rating/style.css";
import { Heading } from "./ui/heading";

const reviews = [
  {
    tutor_name: "Sanjay Singhania",
    review:
      "I've never seen anything like this before. It's amazing. I love it.",
    tutor_profile: "/images/not-found.png",
    student_name: "Rohit Sharma",
    rating: 4,
  },
  {
    tutor_name: "Tirtha Sagar",
    review: "I don't know what to say. I'm speechless. This is amazing.",
    tutor_profile: "/images/not-found.png",
    student_name: "Sonu Singh",
    rating: 5,
  },
  {
    tutor_name: "Kamlesh Sarkar",
    review: "I'm at a loss for words. This is amazing. I love it.",
    tutor_profile: "/images/not-found.png",
    student_name: "Akash Kumar",
    rating: 4,
  },
  {
    tutor_name: "Rahul Verma",
    review: "I'm at a loss for words. This is amazing. I love it.",
    tutor_profile: "/images/not-found.png",
    student_name: "Yash Singh",
    rating: 5,
  },
  {
    tutor_name: "Vijay Gupta",
    review: "I'm at a loss for words. This is amazing. I love it.",
    tutor_profile: "/images/not-found.png",
    student_name: "Hemant Sharma",
    rating: 4,
  },
  {
    tutor_name: "Santosh Singh",
    review: "I'm at a loss for words. This is amazing. I love it.",
    tutor_profile: "/images/not-found.png",
    student_name: "Rahul Kapoor",
    rating: 5,
  },
];

export default function StudentReviewCards() {
  const { data, isLoading } = useQuery({
    queryKey: [`feedbacks`],
    queryFn: async () => {
      const { data } = await http().get(
        `${endpoints.reviews.getAll}?page=1&limit=20&minRating=4`,
      );
      return data?.length >= 10 ? data : reviews;
      return data;
    },
  });

  if (isLoading) return <Loading />;

  const firstRow = data.slice(0, Math.floor(data.length / 2));
  const secondRow = data.slice(Math.ceil(data.length / 2));

  return (
    <div className="relative flex min-h-screen w-full flex-col items-center justify-center gap-12 overflow-x-hidden rounded-lg border bg-background py-20">
      <div className="space-y-2">
        <Small
          className={"flex items-center justify-center gap-1 text-primary"}
        >
          <Lightbulb size={20} />{" "}
          <span className="tracking-wide">Student Review</span>
        </Small>
        <Heading title={"Our Students Feedback"} description={""} />
      </div>

      <div>
        <Marquee pauseOnHover className="[--duration:20s]">
          {firstRow.map((review, key) => (
            <ReviewCard key={key} {...review} />
          ))}
        </Marquee>
        <Marquee reverse pauseOnHover className="[--duration:20s]">
          {secondRow.map((review, key) => (
            <ReviewCard key={key} {...review} />
          ))}
        </Marquee>
      </div>
      <div className="pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-white dark:from-background"></div>
      <div className="pointer-events-none absolute inset-y-0 right-0 w-1/3 bg-gradient-to-l from-white dark:from-background"></div>
    </div>
  );
}

export const ReviewCard = ({
  tutor_profile,
  tutor_name,
  student_name,
  review,
  rating,
}) => {
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
        <figure className="size-8">
          <Image
            className="h-full w-full rounded-full object-cover object-center"
            width="32"
            height="32"
            alt=""
            src={tutor_profile}
          />
        </figure>
        <div className="flex flex-col">
          <figcaption className="text-sm font-medium dark:text-white">
            {tutor_name}
          </figcaption>
        </div>
      </div>
      <div className="h-full space-y-2 rounded-lg p-3 py-2">
        <Rating style={{ maxWidth: 100 }} value={rating} readOnly />

        <blockquote className="h-[60px] text-sm">{review}</blockquote>
        <Muted className={"text-end text-xs font-medium"}>
          ~{student_name}
        </Muted>
      </div>
    </figure>
  );
};
