import React from "react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "./ui/pagination";
import { cn } from "@/lib/utils";

export default function PaginationControl({
  page,
  paginationCount,
  createQueryString,
}) {
  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href={`?${createQueryString("page", Math.max(page - 1, 1))}`}
          />
        </PaginationItem>
        {Array.from({ length: paginationCount }).map((_, ind) => (
          <PaginationItem key={ind}>
            <PaginationLink
              href={`?${createQueryString("page", ind + 1)}`}
              isActive={page == ind + 1}
              className={"hover:bg-primary hover:text-white"}
            >
              {ind + 1}
            </PaginationLink>
          </PaginationItem>
        ))}
        <PaginationItem>{/* <PaginationEllipsis /> */}</PaginationItem>
        <PaginationItem>
          <PaginationNext
            href={`?${createQueryString("page", Math.min(page + 1, paginationCount))}`}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
