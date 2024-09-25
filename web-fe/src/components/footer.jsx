"use client";
import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";

import Link from "next/link";
import { H2, Small } from "./ui/typography";
import { GradualSpacing } from "./ui/animated-text";

const pathArr = [
  "M 62 140 L 43 140 L 43 16.8 L 0 16.8 L 0 0 L 105 0 L 105 16.8 L 62 16.8 L 62 140 Z", // T
  "M35 100 L35 20 L50 20 L50 85 L65 85 L65 100 Z", // U
  "M 62 140 L 43 140 L 43 16.8 L 0 16.8 L 0 0 L 105 0 L 105 16.8 L 62 16.8 L 62 140 Z", // T
  "M145 100 L145 20 L160 20 L160 50 L145 50 L145 85 L160 85 L160 100 Z", // I
  "M170 100 L170 20 L185 20 L185 50 L170 50 L170 100 Z", // O
  "M195 100 L195 20 L210 20 L210 100 Z", // N
  "M220 100 L220 20 L235 20 L235 50 L220 50 L220 100 Z", // W
  "M245 100 L245 20 L260 20 L260 50 L245 50 L245 100 Z", // A
  "M270 100 L270 20 L285 20 L285 100 Z", // L
  "M295 100 L295 20 L310 20 L310 50 L295 50 L295 100 Z", // A
];

const Footer = () => {
  const container = useRef(null);
  const ref = useRef(null);
  const isInView = useInView(ref);

  const variants = {
    visible: (i) => ({
      translateY: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12,
        duration: 0.4,
        delay: i * 0.03,
      },
    }),

    hidden: { translateY: 200 },
  };

  return (
    <>
      <div
        className="relative h-full bg-white pt-8 text-black sm:pt-14"
        ref={container}
      >
        <div className="mx-auto space-y-8 px-4 sm:container">
          <div className="w-full justify-between md:flex">
            <div className="md:flex-1">
              <H2 className="mb-2 text-2xl font-semibold text-primary md:text-4xl">
                Let&lsquo;s do great work together
              </H2>
              <Small className={"text-pretty"}>
                At our tuition classes, we provide personalized attention from
                experienced educators in a supportive environment. Our goal is
                to empower students by strengthening fundamental understanding,
                enhancing reasoning skills, and building self-confidence for
                academic success.
              </Small>
            </div>
            <div className="flex items-start justify-end gap-10 md:flex-1">
              <ul>
                <li className="pb-2 text-2xl font-semibold text-black">
                  SITEMAP
                </li>
                <li className="text-xl font-medium">
                  <Link className="hover:text-primary-500" href="/">
                    Home
                  </Link>
                </li>
                <li className="text-xl font-medium">
                  <Link className="hover:text-primary-500" href="/about">
                    About us
                  </Link>
                </li>
                <li className="text-xl font-medium">
                  <Link className="hover:text-primary-500" href="/blogs">
                    Blogs
                  </Link>
                </li>
                <li className="text-xl font-medium">
                  <Link className="hover:text-primary-500" href="/contact-us">
                    Contact
                  </Link>
                </li>
              </ul>
              <ul>
                <li className="pb-2 text-2xl font-semibold text-black">
                  SOCIAL
                </li>
                <li className="text-xl font-medium">
                  <a
                    href="https://www.linkedin.com/company/next-codez/"
                    target="_blank"
                    className="underline hover:text-primary-500"
                  >
                    LinkedIn
                  </a>
                </li>
                <li className="text-xl font-medium">
                  <a
                    href="https://twitter.com/NextCodez"
                    target="_blank"
                    className="underline hover:text-primary-500"
                  >
                    Twitter
                  </a>
                </li>
                <li className="text-xl font-medium">
                  <a
                    href="https://www.instagram.com/nextcodez/"
                    target="_blank"
                    className="underline hover:text-primary-500"
                  >
                    Instagram
                  </a>
                </li>
                <li className="text-xl font-medium">
                  <a
                    href="https://www.facebook.com/nextcodezz"
                    target="_blank"
                    className="underline hover:text-primary-500"
                  >
                    Facebook
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="flex flex-col-reverse justify-between gap-3 py-2 md:flex-row">
            <span className="font-medium">
              &copy; {new Date().getFullYear()} TUTIONWALA.IN. All Rights
              Reserved.
            </span>
            <a href="#" className="font-semibold">
              Privacy Policy
            </a>
          </div>
        </div>
      </div>
    </>
  );
};

export default Footer;
