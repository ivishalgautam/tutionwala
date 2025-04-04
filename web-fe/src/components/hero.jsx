"use client";
import Image from "next/image";
import dynamic from "next/dynamic";
import { SearchCategoryLoader } from "./loaders/hero";
const SearchModal = dynamic(() => import("./search"), {
  loading: () => <SearchCategoryLoader />,
});

export default function Hero() {
  return (
    <div className="bg-gradient-to-b from-primary-25 to-primary-50">
      <section className="mx-auto max-w-screen-xl items-center px-4 py-12 md:px-8 md:py-24 lg:flex">
        <div className="flex-1 space-y-5 sm:text-center lg:text-left">
          <h1 className="text-2xl font-bold text-primary xl:text-4xl">
            Your Success, Guided by
            <br />
            <span className="text-secondary"> Expert Tutors</span>
          </h1>
          <p className="max-w-xl text-pretty leading-relaxed text-gray-500 sm:mx-auto lg:ml-0">
            Currently Providing Coaching in Prime Locations of Lajpat Nagar, New
            Delhi, Badarpur, and Faridabad, Haryana, India
          </p>
          <p className="max-w-xl text-pretty leading-relaxed text-gray-500 sm:mx-auto lg:ml-0">
            At our tuition classes, students receive personalized guidance from
            expert tutors dedicated to their academic growth. We focus on
            building strong fundamentals, enhancing problem-solving skills, and
            boosting confidence for long-term success.
          </p>
          <div className="space-y-2">
            <p className=" text-gray-800">What you want to learn?</p>
            <form className="items-center sm:flex sm:justify-center sm:space-x-3 sm:space-y-0 lg:justify-start">
              <div className="basis-4/5">
                <SearchModal />
              </div>
            </form>
          </div>
        </div>

        <div className="mt-4 flex-1 text-center lg:ml-3 lg:mt-0">
          <figure className="h-[500px] w-full">
            <Image
              src="/images/hero.jpeg"
              width={500}
              height={500}
              alt="tutionwala"
              className="mx-auto h-full w-full rounded-lg object-cover object-center shadow-2xl sm:w-10/12 lg:w-full"
              priority={false}
              loading="lazy"
            />
          </figure>
        </div>
      </section>
    </div>
  );
}
