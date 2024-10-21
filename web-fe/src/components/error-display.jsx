import { H5, Muted } from "./ui/typography";
import Link from "next/link";
import { Button, buttonVariants } from "./ui/button";
import Image from "next/image";

export default function ErrorDisplay({
  location,
  message = "Something went wrong!",
  reset,
}) {
  return (
    <div className="container flex h-screen items-center justify-center">
      <div className="flex flex-col items-center justify-center gap-2">
        <div className="">
          <H5 className={"text-center"}>{location}</H5>
          <Muted className={"text-balance text-center"}>{message}</Muted>
        </div>

        <Image
          src={"/svg/error.svg"}
          width={500}
          height={500}
          alt="error"
          priority={false}
        />

        <div className="!mt-8 space-x-2 text-center">
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
