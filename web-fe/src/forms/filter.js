import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import LanguageSelect from "@/components/select/language-select";
import RatingSelect from "@/components/select/rating-select";
import DemoClassSelect from "@/components/select/demo-class-select";
import ClassConductSelect from "@/components/select/class-conduct-select";
import ClassFlexibilitySelect from "@/components/select/flexibility-select";
import ClassPlaceSelect from "@/components/select/place-select";
import { FilterAddress } from "@/components/tutors-with-filter";
import SubCategorySelect from "@/components/select/sub-category-select";
import { useQueryState } from "nuqs";
import { useQuery } from "@tanstack/react-query";
import http from "@/utils/http";
import { endpoints } from "@/utils/endpoints";
import SubjectSelect from "@/components/select/subject-select";

export const FilterForm = ({ searchParams, handleSubmit, onSubmit }) => {
  const router = useRouter();
  const isOffline = searchParams.get("mode") === "offline";
  const [category, setCategory] = useQueryState("category");

  const { data, isLoading, isError, error } = useQuery({
    queryFn: async () => {
      const { data } = await http().get(
        `${endpoints.subCategories.getAll}/${category}`,
      );
      return data;
    },
    queryKey: ["category", category],
    enabled: !!category,
  });
  const classNames = {
    option: () =>
      "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
  };

  const styles = {
    control: (provided) => ({
      background: "#fff",
      borderRadius: "8px",
      display: "flex",
      border: "1px solid #BEBFC1",
    }),
    menuPortal: (provided) => ({
      ...provided,
      zIndex: 99999999999,
    }),
    menu: (base) => ({
      ...base,
      zIndex: 999999999,
      textTransform: "capitalize",
    }),
    menuList: (base) => ({
      ...base,
      maxHeight: "300px",
      overflowY: "auto",
    }),
  };

  const tabs = [
    {
      name: "Mode?",
      comp: (
        <ClassConductSelect
          searchParams={searchParams}
          styles={styles}
          classNames={classNames}
        />
      ),
      className: "",
    },
    ...(isOffline
      ? [
          {
            name: "Location?",
            comp: <FilterAddress searchParams={searchParams} styles={styles} />,
            className: "",
          },
        ]
      : []),
    {
      name: "Category?",
      comp: (
        <SubCategorySelect
          isMulti={false}
          searchParams={searchParams}
          styles={styles}
          classNames={classNames}
        />
      ),
      className: "",
    },
    ...(isLoading
      ? []
      : data.is_boards
        ? [
            {
              name: "Subject?",
              comp: (
                <SubjectSelect
                  searchParams={searchParams}
                  boards={data?.boards ?? []}
                  styles={styles}
                  classNames={classNames}
                />
              ),
              className: "",
            },
          ]
        : []),
    {
      name: "Languages?",
      comp: (
        <LanguageSelect
          searchParams={searchParams}
          styles={styles}
          classNames={classNames}
        />
      ),
      className: "",
    },
    {
      name: "Rating?",
      comp: (
        <RatingSelect
          searchParams={searchParams}
          styles={styles}
          classNames={classNames}
        />
      ),
      className: "",
    },
    {
      name: "Demo Classes?",
      comp: (
        <DemoClassSelect
          searchParams={searchParams}
          styles={styles}
          classNames={classNames}
        />
      ),
      className: "",
    },

    {
      name: "Flexibility?",
      comp: (
        <ClassFlexibilitySelect
          searchParams={searchParams}
          styles={styles}
          classNames={classNames}
        />
      ),
      className: "",
    },
    ...(isOffline
      ? [
          {
            name: "Place?",
            comp: (
              <ClassPlaceSelect
                searchParams={searchParams}
                styles={styles}
                classNames={classNames}
              />
            ),
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
