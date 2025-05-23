import Image from "next/image";
import { H2, Muted, Small } from "./ui/typography";
import {
  BookOpen,
  Briefcase,
  IndianRupee,
  Laptop,
  Lightbulb,
  Users,
} from "lucide-react";
import FadeUp from "./fade-up";

const benefits = [
  {
    title: "No Joining Fees",
    icon: <IndianRupee size={30} className="text-secondary" />,
  },
  {
    title: "Expert Instructors",
    icon: <Lightbulb size={30} className="text-secondary" />,
  },
  {
    title: "Interactive Learning",
    icon: <Laptop size={30} className="text-secondary" />,
  },
  {
    title: "Affordable Learning",
    icon: <BookOpen size={30} className="text-secondary" />,
  },
  {
    title: "Career Advance",
    icon: <Briefcase size={30} className="text-secondary" />,
  },
  {
    title: "Support Community",
    icon: <Users size={30} className="text-secondary" />,
  },
];

export default function WhyChooseUs() {
  return (
    <div className="relative">
      <div className="absolute bottom-10 left-0 size-[15rem] rounded-full bg-secondary"></div>
      <div className="absolute right-0 top-20 size-[20rem] rounded-full bg-secondary"></div>
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
              priority={false}
              loading="lazy"
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
              priority={false}
              loading="lazy"
            />
          </figure>
        </div>

        <div className="space-y-16 p-8">
          <div className="space-y-4">
            <Small className={"flex items-center gap-1 text-primary"}>
              <Lightbulb size={20} />{" "}
              <span className="text-xs uppercase text-secondary">
                Why Choose Us
              </span>
            </Small>
            <H2 className={"text-3xl text-primary md:text-4xl"}>
              TutionWala Your Path to Excellence & Success
            </H2>
            <Muted>
              We are passionate about education and dedicated to providing high-
              quality learning resources for learners of all backgrounds.
            </Muted>
          </div>

          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3">
            {benefits.map((b, ind) => (
              <FadeUp key={ind} delay={ind * 0.2}>
                <Block key={ind} title={b.title} icon={b.icon} />
              </FadeUp>
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
