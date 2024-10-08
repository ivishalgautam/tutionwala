"use client";
import { endpoints } from "@/utils/endpoints";
import http from "@/utils/http";
import { useQuery } from "@tanstack/react-query";
import Loading from "./loading";
import NextImage from "./next-image";
import { H2, H5, Large, Muted, Small } from "./ui/typography";
import useEmblaCarousel from "embla-carousel-react";
import { DotButton, useDotButton } from "./carousel/EmblaCarouselDotButtons";
import {
  NextButton,
  PrevButton,
  usePrevNextButtons,
} from "./carousel/EmblaCarouselArrowButtons";
import CategoryCard from "./card/category";

async function fetchFeaturedCategories() {
  const { data } = await http().get(
    `${endpoints.categories.getAll}?featured=true`,
  );

  return data;
}

export default function FeaturedCategories() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ align: "start" });

  const { selectedIndex, scrollSnaps, onDotButtonClick } =
    useDotButton(emblaApi);

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

  if (isLoading) return <Loading />;
  if (isError) return error?.message ?? "Error";

  return (
    <div className="bg-patterns px-4 py-20 md:px-10 lg:p-16">
      <div>
        <Small
          className={
            "block text-center font-medium uppercase tracking-wide text-primary"
          }
        >
          Top Category
        </Small>
        <H2 className={"border-none text-center"}>
          Explore our top categories
        </H2>
        <Muted className={"block text-center"}>
          You&apos;ll find something to spark your curiosity and enhance
        </Muted>
      </div>
      <section className="embla">
        <div className="embla__viewport" ref={emblaRef}>
          <div className="embla__container">
            {data.map((category) => (
              <div className="embla__slide" key={category.id}>
                <div className="embla__slide__number">
                  <CategoryCard category={category} />
                </div>
              </div>
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
