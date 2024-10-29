import dynamic from "next/dynamic";
import Loading from "./loading";
import HeroLoader from "./loaders/hero";
import CategoryLoader from "./loaders/category";
import WhyChooseUsLoader from "./loaders/why-choose-us";
import FadeUp from "./fade-up";

const Hero = dynamic(() => import("./hero.jsx"), {
  loading: () => <HeroLoader />,
});
const FeaturedCategories = dynamic(() => import("./featured-categories"), {
  loading: () => <CategoryLoader />,
});
const WhyChooseUs = dynamic(() => import("./why-choose-us"), {
  loading: () => <WhyChooseUsLoader />,
});
const StudentReviewCards = dynamic(() => import("./student-feedbacks"), {
  loading: () => <Loading />,
});

export default function HomePage() {
  return (
    <>
      <FadeUp y={20} delay={0.5}>
        <Hero />
      </FadeUp>
      <FadeUp y={20} delay={0.5}>
        <FeaturedCategories />
      </FadeUp>
      <FadeUp y={20} delay={0.5}>
        <WhyChooseUs />
      </FadeUp>
      <FadeUp y={20} delay={0.5}>
        <StudentReviewCards />
      </FadeUp>
    </>
  );
}
