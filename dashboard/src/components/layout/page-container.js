import React from "react";
import { ScrollArea } from "../ui/scroll-area";

export default function PageContainer({ children, scrollable = true }) {
  return scrollable ? (
    <ScrollArea className="h-[calc(100dvh)]">
      <div className="h-full bg-white p-4 md:px-8">{children}</div>
    </ScrollArea>
  ) : (
    <div className="h-full bg-white p-4 md:px-8">{children}</div>
  );
}
