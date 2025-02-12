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
    tutor_name: "Amit Khanna",
    review:
      "The way he explains concepts is outstanding. Learning has never been this easy!",
    tutor_profile: "/images/not-found.png",
    student_name: "Ravi Mehta",
    rating: 5,
  },
  {
    tutor_name: "Sanjay Singhania",
    review:
      "Great tutor with deep subject knowledge. Cleared all my doubts patiently.",
    tutor_profile: "/images/not-found.png",
    student_name: "Neha Sharma",
    rating: 4,
  },
  {
    tutor_name: "Tirtha Sagar",
    review:
      "Very knowledgeable and supportive. Helped me improve my understanding a lot.",
    tutor_profile: "/images/not-found.png",
    student_name: "Vikas Yadav",
    rating: 5,
  },
  {
    tutor_name: "Kamlesh Sarkar",
    review:
      "Explains everything clearly and makes learning fun. Highly recommended!",
    tutor_profile: "/images/not-found.png",
    student_name: "Aditi Verma",
    rating: 5,
  },
  {
    tutor_name: "Rahul Verma",
    review:
      "Goes the extra mile to ensure students understand. A fantastic teacher!",
    tutor_profile: "/images/not-found.png",
    student_name: "Prakash Kumar",
    rating: 4,
  },
  {
    tutor_name: "Vijay Gupta",
    review:
      "Makes even the toughest topics easy to grasp. A great learning experience!",
    tutor_profile: "/images/not-found.png",
    student_name: "Meenal Shah",
    rating: 5,
  },
  {
    tutor_name: "Santosh Singh",
    review:
      "Very patient and knowledgeable. Helped me gain confidence in my studies.",
    tutor_profile: "/images/not-found.png",
    student_name: "Kunal Tiwari",
    rating: 4,
  },
  {
    tutor_name: "Deepak Kumar",
    review: "His teaching methods are really effective. I’ve improved so much!",
    tutor_profile: "/images/not-found.png",
    student_name: "Rohan Malhotra",
    rating: 5,
  },
  {
    tutor_name: "Manish Kapoor",
    review:
      "Simplifies complex concepts like a pro. Really enjoyed his sessions.",
    tutor_profile: "/images/not-found.png",
    student_name: "Sneha Agarwal",
    rating: 5,
  },
  {
    tutor_name: "Prakash Mishra",
    review:
      "A dedicated teacher who always ensures students grasp the concepts well.",
    tutor_profile: "/images/not-found.png",
    student_name: "Aditya Saxena",
    rating: 4,
  },
  {
    tutor_name: "Rajeev Nair",
    review:
      "Amazing teaching style. I understood things I used to struggle with before.",
    tutor_profile: "/images/not-found.png",
    student_name: "Tarun Menon",
    rating: 5,
  },
  {
    tutor_name: "Arun Sethi",
    review:
      "Very interactive sessions with real-life examples. Enjoyed learning from him!",
    tutor_profile: "/images/not-found.png",
    student_name: "Simran Kaur",
    rating: 5,
  },
  {
    tutor_name: "Neeraj Pandey",
    review:
      "An excellent mentor who genuinely cares about his students’ progress.",
    tutor_profile: "/images/not-found.png",
    student_name: "Aman Gupta",
    rating: 5,
  },
  {
    tutor_name: "Mohit Sharma",
    review:
      "Explains with such clarity that even difficult topics seem simple.",
    tutor_profile: "/images/not-found.png",
    student_name: "Priya Bajaj",
    rating: 4,
  },
  {
    tutor_name: "Varun Bhardwaj",
    review: "Superb tutor! His sessions are engaging and insightful.",
    tutor_profile: "/images/not-found.png",
    student_name: "Harshit Mehta",
    rating: 5,
  },
  {
    tutor_name: "Kunal Joshi",
    review: "Highly knowledgeable and always willing to help. A great mentor!",
    tutor_profile: "/images/not-found.png",
    student_name: "Sanya Kapoor",
    rating: 4,
  },
  {
    tutor_name: "Rajesh Patil",
    review:
      "Helped me overcome my fear of math. Now I actually enjoy solving problems!",
    tutor_profile: "/images/not-found.png",
    student_name: "Ishaan Sharma",
    rating: 5,
  },
  {
    tutor_name: "Suresh Chandra",
    review: "Very organized and methodical in teaching. Helped me a lot!",
    tutor_profile: "/images/not-found.png",
    student_name: "Vivek Anand",
    rating: 4,
  },
  {
    tutor_name: "Pawan Saxena",
    review: "A fantastic tutor! He makes learning enjoyable and effective.",
    tutor_profile: "/images/not-found.png",
    student_name: "Ritika Jain",
    rating: 5,
  },
  {
    tutor_name: "Ankit Rawat",
    review: "Great mentor! Helped me achieve better results than I expected.",
    tutor_profile: "/images/not-found.png",
    student_name: "Arjun Chopra",
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
