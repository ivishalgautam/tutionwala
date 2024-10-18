"use client";

import Image from "next/image";
import SearchModal from "./search";

export default function Hero() {
  return (
    <div className="bg-gradient-to-b from-primary-25 to-primary-50">
      <section className="mx-auto max-w-screen-xl items-center px-4 pb-24 pt-24 md:px-8 lg:flex">
        <div className="flex-1 space-y-4 sm:text-center lg:text-left">
          <h1 className="text-4xl font-bold text-gray-800 xl:text-4xl">
            Your Success, Guided by
            <br />
            <span className="text-primary"> Expert Tutors</span>
          </h1>
          <p className="max-w-xl text-pretty leading-relaxed text-gray-500 sm:mx-auto lg:ml-0">
            At our tuition classes, students receive personalized guidance from
            expert tutors dedicated to their academic growth. We focus on
            building strong fundamentals, enhancing problem-solving skills, and
            boosting confidence for long-term success.
          </p>
          <div>
            <p className="py-3 text-gray-800">What you want to learn?</p>
            <form className="items-center space-y-3 sm:flex sm:justify-center sm:space-x-3 sm:space-y-0 lg:justify-start">
              <div className="basis-4/5">
                <SearchModal />
              </div>
            </form>
          </div>
        </div>
        <div className="mt-4 flex-1 text-center lg:ml-3 lg:mt-0">
          <Image
            src="/images/hero.webp"
            width={500}
            height={500}
            alt="tutionwala"
            className="mx-auto w-full rounded-lg shadow-2xl sm:w-10/12 lg:w-full"
            priority={false}
            loading="lazy"
          />
        </div>
      </section>
    </div>
  );
}
