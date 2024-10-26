import React from "react";
import { ScrollArea } from "../ui/scroll-area";
import { cn } from "@/lib/utils";

export default function PageContainer({
  children,
  scrollable = true,
  className,
}) {
  return scrollable ? (
    <ScrollArea className="h-[calc(100dvh)]">
      <div className={cn("h-full bg-white p-4 md:px-8", className)}>
        {children}
      </div>
    </ScrollArea>
  ) : (
    <div className={cn("h-full bg-white p-4 md:px-8", className)}>
      {children}
    </div>
  );
}
