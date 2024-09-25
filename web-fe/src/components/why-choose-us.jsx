import Image from "next/image";
import React from "react";
import { H2, H6, Large, Muted, Small } from "./ui/typography";
import {
  BookOpen,
  Briefcase,
  IndianRupee,
  Laptop,
  Lightbulb,
  Users,
} from "lucide-react";

const benefits = [
  {
    title: "No Joining Fees",
    icon: <IndianRupee size={30} className="text-primary" />,
  },
  {
    title: "Expert Instructors",
    icon: <Lightbulb size={30} className="text-primary" />,
  },
  {
    title: "Interactive Learning",
    icon: <Laptop size={30} className="text-primary" />,
  },
  {
    title: "Affordable Learning",
    icon: <BookOpen size={30} className="text-primary" />,
  },
  {
    title: "Career Advance",
    icon: <Briefcase size={30} className="text-primary" />,
  },
  {
    title: "Support Community",
    icon: <Users size={30} className="text-primary" />,
  },
];

export default function WhyChooseUs() {
  return (
    <div className="relative">
      <div className="absolute bottom-10 left-0 size-[15rem] rounded-full bg-primary"></div>
      <div className="absolute right-0 top-20 size-[20rem] rounded-full bg-primary"></div>
      <div className="grid h-full bg-white/50 py-10 backdrop-blur-[200px] md:grid-cols-1 lg:grid-cols-2">
        <div className="flex items-center justify-center gap-10 p-8 lg:relative">
          <figure className="aspect-[9/16]">
            <Image
              src={`/images/why-choose-us-1.jpg`}
              width={200}
              height={200}
              quality={100}
              alt="teacher teaching a student"
              className="h-full w-full rounded-lg object-cover object-center shadow-xl"
            />
          </figure>
          <figure className="aspect-square">
            <Image
              src={`/images/why-choose-us-3.jpg`}
              width={300}
              height={300}
              quality={100}
              alt="teacher teaching a student"
              className="h-full w-full rounded-lg object-cover object-center shadow-2xl"
            />
          </figure>
        </div>

        <div className="space-y-16 p-8">
          <div className="space-y-4">
            <Small className={"flex items-center gap-1 text-primary"}>
              <Lightbulb size={20} />{" "}
              <span className="tracking-wide">Why Choose Us</span>
            </Small>
            <H2 className={"text-3xl font-extrabold md:text-4xl"}>
              TutionWala Your Path to Excellence & Success
            </H2>
            <Muted>
              We are passionate about education and dedicated to providing high-
              quality learning resources for learners of all backgrounds.
            </Muted>
          </div>

          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3">
            {benefits.map(({ title, icon }) => (
              <Block key={title} title={title} icon={icon} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function Block({ title, icon }) {
  return (
    <div className="flex items-center justify-start gap-2 rounded-md border border-white bg-white/50 p-4">
      <span>{icon}</span>
      <Small className="line-clamp-2 leading-5 text-gray-600">{title}</Small>
    </div>
  );
}
