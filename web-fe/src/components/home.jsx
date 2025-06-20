import dynamic from "next/dynamic";
import Loading from "./loading";
import HeroLoader from "./loaders/hero";
import CategoryLoader from "./loaders/category";
import WhyChooseUsLoader from "./loaders/why-choose-us";
import WhatsAppWidget from "./whatsapp-widget";

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
const CoursesWithTabs = dynamic(() => import("./courses-with-tabs"), {
  ssr: false,
  loading: () => <Loading />,
});
const PricingSection = dynamic(() => import("./pricing-section"), {
  ssr: false,
  loading: () => <Loading />,
});
const CatgoriesTabs = dynamic(() => import("./categories-tabs"), {
  ssr: false,
  loading: () => <Loading />,
});
const AppDownloadSection = dynamic(() => import("./app-download-section"), {
  ssr: false,
  loading: () => <Loading />,
});

export default function HomePage() {
  return (
    <>
      <Hero />
      <FeaturedCategories />
      <WhyChooseUs />
      <StudentReviewCards />
      <CoursesWithTabs slugs={["school"]} />
      {/* <PricingSection /> */}
      <WhatsAppWidget />
      <CatgoriesTabs />
      <AppDownloadSection />
    </>
  );
}
