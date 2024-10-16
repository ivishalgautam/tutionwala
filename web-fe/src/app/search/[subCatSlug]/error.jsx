"use client";

import { Button } from "@/components/ui/button";
import { H6 } from "@/components/ui/typography";
import { buttonVariants } from "keep-react";
import Link from "next/link";

export default function Error({ error, reset }) {
  return (
    <div className="flex h-screen items-center justify-center">
      <div className="flex flex-col items-center justify-center gap-2">
        <H6>Something went wrong!</H6>
        <div className="space-x-2">
          <Link href={"/"} className={buttonVariants()}>
            Go Home
          </Link>
          <Button onClick={() => reset()}>Try again</Button>
        </div>
      </div>
    </div>
  );
}
