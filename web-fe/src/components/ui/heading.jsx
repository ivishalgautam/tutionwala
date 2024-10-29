import { cn } from "@/lib/utils";
import { H2 } from "./typography";
import FadeUp from "../fade-up";

export const Heading = ({ title, description, className }) => {
  return (
    <FadeUp y={20}>
      <div className={cn("space-y-2 text-center", className)}>
        <H2 className={"mx-auto w-max text-center capitalize"}>{title}</H2>
        <p className="text-sm text-gray-500">{description}</p>
      </div>
    </FadeUp>
  );
};
