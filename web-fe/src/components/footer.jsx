"use client";
import Image from "next/image";
import { H6, Muted } from "./ui/typography";
import { EnvelopeSimple, Phone, WhatsappLogo } from "phosphor-react";
import useFetchFeaturedCourses from "@/hooks/useFetchFeaturedCourses";
import { socialLinks } from "@/data/static";
import Loading from "./loading";
const Courses = dynamic(() => import("./courses").then((data) => data.Courses));
import config from "@/config";
import Link from "next/link";
import dynamic from "next/dynamic";

export const Footer = () => {
  const {
    data: courses,
    isLoading,
    isError,
    error,
  } = useFetchFeaturedCourses({ limit: 25 });

  return (
    <footer className="mx-auto bg-gradient-to-br from-primary/80 to-secondary p-2 text-black">
      <div className="rounded-[2rem] bg-white/80 p-4">
        <div className="container py-8">
          <FooterOne />
          <FooterTwo {...{ isError, error, isLoading, courses }} />
          <FooterThree />
        </div>
      </div>
    </footer>
  );
};

export const FooterOne = () => {
  return (
    <div className="justify-between space-y-8 pb-5 md:grid md:grid-cols-12 md:gap-6 md:space-y-0">
      <div className="md:col-span-6">
        <div className="space-y-4">
          <figure className="flex items-center gap-2">
            <Image
              src={"/logo.png"}
              width={200}
              height={200}
              alt="TutionWala logo"
              className="rounded-lg"
            />
          </figure>
          <div className="md:flex-1">
            <div className={"text-balance text-sm tracking-wide text-gray-900"}>
              We provide personalized attention from experienced educators to
              strengthen fundamentals, enhance reasoning skills, and build
              self-confidence for academic success.
            </div>
          </div>
          <div>
            <ul className="flex gap-3">
              {socialLinks?.map(({ icon, href }) => (
                <li
                  key={href}
                  className="text-sm text-gray-600 transition-colors hover:text-gray-900"
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

      <div className="space-y-2 py-5 sm:col-span-5 md:col-span-3 ">
        <Muted className={"font-medium"}>Useful Links</Muted>
        <Navigation />
      </div>

      <div className="items-center justify-between space-y-3 text-sm sm:text-base md:col-span-3 md:mt-0">
        <H6>Feel free to share your question</H6>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Phone size={20} />
            <Muted>{config.phone}</Muted>
          </div>
          <div className="flex items-center gap-2">
            <EnvelopeSimple size={20} />
            <Muted>{config.email}</Muted>
          </div>
          <div className="flex items-center gap-2">
            <WhatsappLogo size={20} />
            <Muted>{config.phone}</Muted>
          </div>
        </div>
      </div>
    </div>
  );
};

export const FooterTwo = ({ isError, error, isLoading, courses }) => {
  return (
    <div className="grid grid-cols-12">
      {/* <div className="col-span-12 space-y-2 border-t border-black/10 py-5 sm:col-span-7 md:col-span-8 lg:col-span-10">
        <Muted className={"font-medium"}>Tutors By Subjects</Muted>
        <div>
          {isLoading ? (
            <Loading />
          ) : isError ? (
            (error?.message ?? "error")
          ) : (
            <Courses {...{ courses, totalSlices: 5, sliceCount: 5 }} />
          )}
        </div>
      </div> */}
    </div>
  );
};

export const FooterThree = () => {
  return (
    <div className="mt-8 items-center justify-between border-t border-black/10 pt-4 sm:flex">
      <div className="mt-4 sm:mt-0">
        <span className="text-sm">
          &copy; {new Date().getFullYear()} TUTIONWALA.COM.
        </span>
      </div>
      <div className="mt-6 sm:mt-0">
        <ul className="flex gap-4">
          <li className="text-sm font-medium">
            <Link
              href="/terms-and-conditions"
              className="underline hover:text-primary-500"
            >
              Terms and conditions
            </Link>
          </li>
          <li className="text-sm font-medium">
            <Link
              href="/privacy-policy"
              className="underline hover:text-primary-500"
            >
              Privacy policy
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

function Navigation() {
  return (
    <ul>
      {[
        {
          href: "/",
          label: "Home",
        },
        {
          href: "/tutors",
          label: "Tutors",
        },
        {
          href: "/about",
          label: "About",
        },
        {
          href: "/contact",
          label: "Contact Us",
        },
      ].map(({ href, label }) => (
        <li key={label}>
          <Link
            href={href}
            className="text-sm font-medium capitalize underline-offset-2 transition-colors hover:underline"
          >
            {label}
          </Link>
        </li>
      ))}
    </ul>
  );
}
