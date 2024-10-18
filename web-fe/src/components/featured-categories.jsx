"use client";
import { endpoints } from "@/utils/endpoints";
import http from "@/utils/http";
import { useQuery } from "@tanstack/react-query";
import { H2, Muted, Small } from "./ui/typography";
import useEmblaCarousel from "embla-carousel-react";
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

  if (isLoading) return <Skeloton />;
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

function Skeloton() {
  return (
    <div class="animate-pulse bg-gray-200 p-4 md:p-10 lg:p-16">
      <div>
        <div class="mx-auto h-4 w-1/4 rounded bg-gray-300"></div>
        <div class="mx-auto mt-2 h-6 w-1/2 rounded bg-gray-300"></div>
        <div class="mx-auto mt-2 h-4 w-3/4 rounded bg-gray-300"></div>
      </div>
      <section class="mt-8">
        <div>
          <div class="flex space-x-4">
            <div class="h-36 w-36 rounded bg-gray-300"></div>
            <div class="h-36 w-36 rounded bg-gray-300"></div>
            <div class="h-36 w-36 rounded bg-gray-300"></div>
            <div class="h-36 w-36 rounded bg-gray-300"></div>
          </div>
        </div>
        <div class="mt-4 flex items-center justify-end">
          <div class="flex items-center justify-end gap-2">
            <div class="mr-1 h-8 w-8 rounded bg-gray-300"></div>
            <div class="h-8 w-8 rounded bg-gray-300"></div>
          </div>
        </div>
      </section>
    </div>
  );
}
