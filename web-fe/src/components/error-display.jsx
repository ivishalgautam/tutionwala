import React from "react";
import { H5, H6, Muted } from "./ui/typography";
import Link from "next/link";
import { Button, buttonVariants } from "./ui/button";

export default function ErrorDisplay({
  location,
  message = "Something went wrong!",
  reset,
}) {
  return (
    <div className="container flex h-screen items-center justify-center">
      <div className="flex flex-col items-center justify-center gap-2">
        <H5 className={"text-center"}>{location}</H5>
        <Muted className={"text-center"}>{message}</Muted>
        <div className="space-x-2">
          <Link href={"/"} className={buttonVariants()}>
            Go Home
          </Link>
          <Button onClick={() => reset()} variant="outline">
            Try again
          </Button>
        </div>
      </div>
    </div>
  );
}
