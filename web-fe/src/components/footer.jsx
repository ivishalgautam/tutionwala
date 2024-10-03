"use client";
import Image from "next/image";
import { Large, Small } from "./ui/typography";
import {
  EnvelopeSimple,
  FacebookLogo,
  InstagramLogo,
  LinkedinLogo,
  Phone,
  TwitterLogo,
  WhatsappLogo,
} from "phosphor-react";
import useFetchFeaturedCourses from "@/hooks/useFetchFeaturedCourses";
import Link from "next/link";
import { socialLinks } from "@/data/static";

export const Footer = () => {
  const {
    data: courses,
    isLoading,
    isError,
    error,
  } = useFetchFeaturedCourses({ limit: 25 });

  return (
    <footer className="mx-auto bg-primary px-4 py-5 text-white md:px-8">
      <div className="container">
        {/* 1 */}
        <div className="justify-between space-y-8 pb-5 md:flex md:gap-6 md:space-y-0">
          <div className="flex-1 basis-2/3">
            <div className="space-y-4">
              <figure className="flex items-center gap-2">
                <Image
                  src={"/images/logo.png"}
                  width={100}
                  height={100}
                  alt="TutionWala logo"
                  className="rounded-lg"
                />
              </figure>
              <div className="md:flex-1">
                <Small className={"text-pretty"}>
                  We provide personalized attention from experienced educators
                  to strengthen fundamentals, enhance reasoning skills, and
                  build self-confidence for academic success.
                </Small>
              </div>
              <div>
                <ul className="flex gap-3">
                  {socialLinks.map(({ icon, href }) => (
                    <li
                      key={href}
                      className="inline-block rounded-full border-2 border-white/20 p-2 text-sm font-medium transition-colors hover:border-white hover:bg-white hover:text-primary"
                    >
                      <a href={href} target="_blank" className="">
                        {icon}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="flex-1 basis-1/3 items-center justify-between space-y-3 text-sm sm:text-base md:mt-0">
            <Large>Feel free to share your question</Large>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Phone size={20} /> <span>+91 98113 18314</span>
              </div>
              <div className="flex items-center gap-2">
                <EnvelopeSimple size={20} />{" "}
                <span>tech.tutionwala@gmail.com</span>
              </div>
              <div className="flex items-center gap-2">
                <WhatsappLogo size={20} /> <span>+91 98113 18314</span>
              </div>
            </div>
          </div>
        </div>

        {/* 2 */}
        <div className="space-y-2 border-t border-black/10 py-5">
          <Large>Tutors by subjects</Large>
          <div>
            {isError && (error?.message ?? "error")}
            {isLoading ? "loading..." : <Courses {...{ courses }} />}
          </div>
        </div>

        {/* 3 */}
        <div className="mt-8 items-center justify-between border-t border-black/10 py-6 sm:flex">
          <div className="mt-4 sm:mt-0">
            <span className="text-sm font-medium">
              &copy; {new Date().getFullYear()} TUTIONWALA.IN. All Rights
              Reserved.
            </span>
          </div>
          <div className="mt-6 sm:mt-0">
            <ul className="flex gap-4">
              <li className="text-sm font-medium">
                <a
                  href="#"
                  target="_blank"
                  className="underline hover:text-primary-500"
                >
                  Terms of use
                </a>
              </li>
              <li className="text-sm font-medium">
                <a
                  href="#"
                  target="_blank"
                  className="underline hover:text-primary-500"
                >
                  Privacy policy
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

export const Courses = ({ courses = [], sliceCount = 5 }) => {
  const slice = [
    [0 * sliceCount, 1 * sliceCount],
    [1 * sliceCount, 2 * sliceCount],
    [2 * sliceCount, 3 * sliceCount],
    [3 * sliceCount, 4 * sliceCount],
    [4 * sliceCount, 5 * sliceCount],
  ];

  console.log({ slice });

  return (
    <div className="grid grid-cols-2 gap-5 pl-4 md:grid-cols-3 lg:grid-cols-5">
      {slice.map(([from, to]) => (
        <ul className="list-disc marker:text-white">
          {courses?.map(({ id, name, slug }) => (
            <div key={id}>
              <li>
                <Link
                  href={`/tutors?category=${slug}`}
                  className="text-sm font-medium capitalize transition-colors hover:text-primary"
                >
                  {name}
                </Link>
              </li>
              <li>
                <Link
                  href={`/tutors?category=${slug}`}
                  className="text-sm font-medium capitalize transition-colors hover:text-primary"
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
