import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import LanguageSelect from "@/components/select/language-select";
import GenderSelect from "@/components/select/gender-select";
import RatingSelect from "@/components/select/rating-select";
import DemoClassSelect from "@/components/select/demo-class-select";
import ClassConductSelect from "@/components/select/class-conduct-select";
import ClassFlexibilitySelect from "@/components/select/flexibility-select";
import ClassPlaceSelect from "@/components/select/place-select";
import { PriceRangeSlider } from "@/components/price-range-slider";
import { PriceRangeSliderSelect } from "@/components/select/price-range-slider-select";
import { FilterAddress } from "@/components/tutors-with-filter";
import SubCategorySelect from "@/components/select/sub-category-select";

export const FilterForm = ({ searchParams, handleSubmit, onSubmit }) => {
  const router = useRouter();
  const isOffline = searchParams.get("mode") === "offline";

  const tabs = [
    {
      name: "Mode?",
      comp: <ClassConductSelect searchParams={searchParams} />,
      className: "",
    },
    ...(isOffline
      ? [
          {
            name: "Location?",
            comp: <FilterAddress searchParams={searchParams} />,
            className: "",
          },
        ]
      : []),
    {
      name: "Category?",
      comp: <SubCategorySelect isMulti={true} searchParams={searchParams} />,
      className: "",
    },

    {
      name: "Languages?",
      comp: <LanguageSelect searchParams={searchParams} />,
      className: "",
    },
    {
      name: "Rating?",
      comp: <RatingSelect searchParams={searchParams} />,
      className: "",
    },
    {
      name: "Demo Classes?",
      comp: <DemoClassSelect searchParams={searchParams} />,
      className: "",
    },

    {
      name: "Flexibility?",
      comp: <ClassFlexibilitySelect searchParams={searchParams} />,
      className: "",
    },
    ...(isOffline
      ? [
          {
            name: "Place?",
            comp: <ClassPlaceSelect searchParams={searchParams} />,
            className: "",
          },
        ]
      : []),
  ];

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="space-y-4 rounded-lg border border-gray-200 bg-white p-4">
        <Accordion type="multiple" className="space-y-2">
          {tabs.map((item, ind) => (
            <AccordionItem
              value={`item-${ind + 1}`}
              key={ind}
              className={cn(
                "rounded-lg border-b-0 bg-gray-100",
                item.className,
              )}
            >
              <AccordionTrigger className="border-b-0 p-3">
                {item.name}
              </AccordionTrigger>
              <AccordionContent className="px-4">{item.comp}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </form>
  );
};
