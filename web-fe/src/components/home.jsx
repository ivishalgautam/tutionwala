import dynamic from "next/dynamic";
import Loading from "./loading";

const Hero = dynamic(() => import("./hero.jsx"), {
  loading: () => <Loading />,
});
const FeaturedCategories = dynamic(() => import("./featured-categories"), {
  loading: () => <Loading />,
});
const WhyChooseUs = dynamic(() => import("./why-choose-us"), {
  loading: () => <Loading />,
});
const StudentReviewCards = dynamic(() => import("./student-feedbacks"), {
  loading: () => <Loading />,
});

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
