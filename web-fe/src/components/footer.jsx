"use client";
import Image from "next/image";
import { Large, Small } from "./ui/typography";
import { EnvelopeSimple, Phone, WhatsappLogo } from "phosphor-react";
import useFetchFeaturedCourses from "@/hooks/useFetchFeaturedCourses";
import { socialLinks } from "@/data/static";
import Loading from "./loading";
import { Courses } from "./courses";
import config from "@/config";
import Link from "next/link";

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
        <FooterOne />
        <FooterTwo {...{ isError, error, isLoading, courses }} />
        <FooterThree />
      </div>
    </footer>
  );
};

export const FooterOne = () => {
  return (
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
              We provide personalized attention from experienced educators to
              strengthen fundamentals, enhance reasoning skills, and build
              self-confidence for academic success.
            </Small>
          </div>
          <div>
            <ul className="flex gap-3">
              {socialLinks.map(({ icon, href }) => (
                <li
                  key={href}
                  className="rounded-full border-2 border-white/20 text-sm font-medium transition-colors hover:border-white hover:bg-white hover:text-primary"
                >
                  <a
                    href={href}
                    target="_blank"
                    className="block h-full w-full p-2.5"
                  >
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
            <Phone size={20} />
            <span>{config.phone}</span>
          </div>
          <div className="flex items-center gap-2">
            <EnvelopeSimple size={20} />
            <span>{config.email}</span>
          </div>
          <div className="flex items-center gap-2">
            <WhatsappLogo size={20} />
            <span>{config.phone}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export const FooterTwo = ({ isError, error, isLoading, courses }) => {
  return (
    <div className="grid grid-cols-12">
      <div className="col-span-12 space-y-2 border-t border-black/10 py-5 sm:col-span-5 md:col-span-4 lg:col-span-2">
        <Large>Useful Links</Large>
        <Navigation />
      </div>

      <div className="col-span-12 space-y-2 border-t border-black/10 py-5 sm:col-span-7 md:col-span-8 lg:col-span-10">
        <Large>Tutors By Subjects</Large>
        <div>
          {isError && (error?.message ?? "error")}
          {isLoading ? (
            <Loading />
          ) : (
            <Courses {...{ courses, totalSlices: 5, sliceCount: 5 }} />
          )}
        </div>
      </div>
    </div>
  );
};

export const FooterThree = () => {
  return (
    <div className="mt-8 items-center justify-between border-t border-black/10 py-6 sm:flex">
      <div className="mt-4 sm:mt-0">
        <span className="text-sm font-medium">
          &copy; {new Date().getFullYear()} TUTIONWALA.COM. All Rights Reserved.
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
