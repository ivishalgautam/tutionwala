"use client";
import { endpoints } from "@/utils/endpoints";
import http from "@/utils/http";
import { useQuery } from "@tanstack/react-query";
import { Small } from "./ui/typography";
import useEmblaCarousel from "embla-carousel-react";
import {
  NextButton,
  PrevButton,
  usePrevNextButtons,
} from "./carousel/EmblaCarouselArrowButtons";
const CategoryCard = dynamic(() => import("./card/category"), {
  loading: () => "loading...",
});
import CategoryLoader from "./loaders/category";
import { Heading } from "./ui/heading";
import dynamic from "next/dynamic";
import FadeUp from "./fade-up";

async function fetchFeaturedCategories() {
  const { data } = await http().get(
    `${endpoints.categories.getAll}?featured=true`,
  );

  return data;
}

export default function FeaturedCategories() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ align: "start" });

  const {
    prevBtnDisabled,
    nextBtnDisabled,
    onPrevButtonClick,
    onNextButtonClick,
  } = usePrevNextButtons(emblaApi);

  const { data, isLoading, isError, error } = useQuery({
    queryFn: fetchFeaturedCategories,
    queryKey: ["featured-categories"],
    keepPreviousData: true,
  });

  if (isLoading) return <CategoryLoader />;
  if (isError) return error?.message ?? "Error";

  return (
    <div className="bg-patterns px-4 py-20 md:px-10 lg:p-16">
      <div className="space-y-2">
        <Small
          className={
            "block text-center font-medium uppercase tracking-wide text-primary"
          }
        >
          Top Category
        </Small>
        <Heading
          title={"Explore our top categories"}
          description={
            "You'll find something to spark your curiosity and enhance"
          }
        />
      </div>
      <section className="embla">
        <div className="embla__viewport" ref={emblaRef}>
          <div className="embla__container">
            {data.map((category, ind) => (
              <FadeUp key={category.id} delay={(ind + 1) * 0.2} x={50} y={0}>
                <div className="embla__slide">
                  <div className="embla__slide__number">
                    <CategoryCard category={category} />
                  </div>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-end">
          <div className="flex items-center justify-end gap-2">
            <PrevButton
              onClick={onPrevButtonClick}
              disabled={prevBtnDisabled}
            />
            <NextButton
              onClick={onNextButtonClick}
              disabled={nextBtnDisabled}
            />
          </div>
        </div>
      </section>
    </div>
  );
}
