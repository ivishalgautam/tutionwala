"use client";
import Image from "next/image";
import dynamic from "next/dynamic";
import { SearchCategoryLoader } from "./loaders/hero";
import FadeUp from "./fade-up";
const SearchModal = dynamic(() => import("./search"), {
  loading: () => <SearchCategoryLoader />,
});

export default function Hero() {
  return (
    <div className="bg-gradient-to-b from-primary-25 to-primary-50">
      <section className="mx-auto max-w-screen-xl items-center px-4 pb-24 pt-24 md:px-8 lg:flex">
        <div className="flex-1 space-y-4 sm:text-center lg:text-left">
          <FadeUp delay={0.3} duration={0.6} y={15}>
            <h1 className="text-4xl font-bold text-gray-800 xl:text-4xl">
              Your Success, Guided by
              <br />
              <span className="text-primary"> Expert Tutors</span>
            </h1>
          </FadeUp>
          <FadeUp delay={0.6} duration={0.6} y={15}>
            <p className="max-w-xl text-pretty leading-relaxed text-gray-500 sm:mx-auto lg:ml-0">
              At our tuition classes, students receive personalized guidance
              from expert tutors dedicated to their academic growth. We focus on
              building strong fundamentals, enhancing problem-solving skills,
              and boosting confidence for long-term success.
            </p>
          </FadeUp>
          <FadeUp delay={1} duration={1} y={0} x={-100}>
            <p className="py-3 text-gray-800">What you want to learn?</p>
            <form className="items-center space-y-3 sm:flex sm:justify-center sm:space-x-3 sm:space-y-0 lg:justify-start">
              <div className="basis-4/5">
                <SearchModal />
              </div>
            </form>
          </FadeUp>
        </div>
        <FadeUp delay={1} duration={1} y={0} x={500} rotate={45}>
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
        </FadeUp>
      </section>
    </div>
  );
}
