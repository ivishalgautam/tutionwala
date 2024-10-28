import { cn } from "@/lib/utils";
import { H2 } from "./typography";

export const Heading = ({ title, description, className }) => {
  return (
    <div className={cn("space-y-2 text-center", className)}>
      <H2 className={"mx-auto w-max text-center capitalize"}>{title}</H2>
      <p className="text-sm text-gray-500">{description}</p>
    </div>
  );
};