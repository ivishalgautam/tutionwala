import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { H1, H2, Large, Muted, Small } from "@/components/ui/typography";
import Image from "next/image";
import Link from "next/link";

const features = [
  {
    heading: "Personalized Learning",
    body: "Tailored education plans that cater to individual student needs and learning styles, ensuring effective progress.",
    icon: "/icons/knowledge.png",
  },
  {
    heading: "Expert Tutors",
    body: "Access to experienced and highly qualified educators who provide guidance and support in a wide range of subjects.",
    icon: "/icons/tutor.png",
  },
  {
    heading: "Interactive Classes",
    body: "Engaging online sessions with live discussions, real-time feedback, and hands-on activities for an immersive learning experience.",
    icon: "/icons/interactions.png",
  },
  {
    heading: "Flexible Scheduling",
    body: "Learn at your own pace with classes that fit your schedule, making education convenient and accessible anytime, anywhere.",
    icon: "/icons/working-hours.png",
  },
];

export default function Page() {
  return (
    <div className="space-y-10 bg-white">
      {/* bread crumbs */}
      <div className="flex h-52 flex-col items-center justify-center gap-2 bg-primary-50">
        <H1 className={"text-center"}>About Us</H1>
        <div className="flex items-center justify-center">
          <BreadCrumb />
        </div>
      </div>

      <div className="container">
        {/* main */}
        <div className="grid gap-10 p-10 md:grid-cols-2">
          <div className="">
            <figure className="mx-auto max-w-[500px] overflow-hidden rounded-lg md:ml-auto">
              <Image
                src={"/images/about-us.jpg"}
                width={500}
                height={500}
                alt="about us"
                className="h-full w-full object-cover object-center"
              />
            </figure>
          </div>
          <div className="space-y-2">
            <Content />
          </div>
        </div>

        {/* features */}
        <div className="py-10">
          <Features />
        </div>
      </div>
    </div>
  );
}

function Content() {
  return (
    <>
      <Muted className={"uppercase text-secondary"}>
        Welcome to tutionwala
      </Muted>
      <H2 className={"text-primary"}>Your Learning Partner for Success</H2>
      <Muted className={"text-sm lg:text-base"}>
        At Tutionwala, we offer personalized online education to help students
        thrive. Our mission is to make learning accessible, interactive, and
        engaging—connecting learners with expert educators to unlock their
        potential.
      </Muted>
      <Muted className={"text-sm lg:text-base"}>
        We believe in fostering a supportive learning environment where students
        can grow and excel. With a focus on quality education and personalized
        attention, we strive to empower learners to reach their academic goals
        and beyond.
      </Muted>
    </>
  );
}

function BreadCrumb() {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink>
            <Link href="/">Home</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>About Us</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}

function Features() {
  return (
    <ul
      className={`grid gap-4 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4`}
    >
      {features.map((ele, ind) => (
        <li
          key={ind}
          className="space-y-4 rounded-lg border p-6 transition-colors hover:border-primary"
        >
          <figure className="size-16">
            <Image
              src={ele.icon}
              width={100}
              height={100}
              alt={ele.heading}
              className="h-full w-full"
            />
          </figure>
          <div className="text-primary">
            <Large>{ele.heading}</Large>
            <Muted className={"lg:min-h-[80px]"}>{ele.body}</Muted>
          </div>
        </li>
      ))}
    </ul>
  );
}
