import React from "react";
import Hero from "./hero";
import FeaturedCategories from "./featured-categories";
import WhyChooseUs from "./why-choose-us";
import StudentReviewCards from "./student-feedbacks";

export default function HomePage() {
  return (
    <>
      <Hero />
      <FeaturedCategories />
      <WhyChooseUs />
      <StudentReviewCards />
    </>
  );
}
