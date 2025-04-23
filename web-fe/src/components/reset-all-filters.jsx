"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useQueryStates } from "nuqs";
import { Button } from "./ui/button";

export default function ResetAllFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // List of all filter parameters used across components
  const filterParams = [
    "category",
    "rating",
    "place",
    "language",
    "gender",
    "flexibility",
    "demo",
    "mode",
    "addr",
    "lat",
    "lng",
    "subject",
  ];

  // Check if any filter is active
  const hasActiveFilters = filterParams.some((param) =>
    searchParams.has(param),
  );

  // Reset all filter parameters
  const handleResetAll = () => {
    // Create a new URLSearchParams object without the filter parameters
    const newParams = new URLSearchParams();

    // Copy any non-filter parameters that should be preserved
    searchParams.forEach((value, key) => {
      if (!filterParams.includes(key)) {
        newParams.set(key, value);
      }
    });

    // Navigate to the new URL without filter parameters
    const newPathname = newParams.toString()
      ? `?${newParams.toString()}`
      : window.location.pathname;

    router.push(newPathname);
  };

  // Only show the button if at least one filter is active
  if (!hasActiveFilters) return null;

  return (
    <Button
      onClick={handleResetAll}
      className="flex items-center gap-2 rounded bg-red-100 px-4 py-2 font-medium text-red-700 transition-colors hover:bg-red-200"
      type="button"
      aria-label="Reset all filters"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M3 3h18v18H3z"></path>
        <path d="m15 9-6 6"></path>
        <path d="m9 9 6 6"></path>
      </svg>
      Clear All Filters
    </Button>
  );
}
