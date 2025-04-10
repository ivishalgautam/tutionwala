import Image from "next/image";
import Link from "next/link";
import React from "react";

export default function SignUpAs() {
  return (
    <div className="flex gap-4">
      {["tutor", "student", "institute"].map((item) => (
        <div key={item}>
          <Link
            className={`group flex size-44 flex-col items-center justify-center gap-2 rounded-lg border text-lg font-semibold tracking-wider transition-colors hover:bg-gray-100`}
            href={`/signup/${item}`}
          >
            <figure className="size-20">
              <Image
                src={
                  item === "tutor"
                    ? "/images/teacher.png"
                    : item === "student"
                      ? "/images/student.png"
                      : "/images/institute.png"
                }
                width={100}
                height={100}
                alt={item}
                className="h-full w-full object-contain object-center transition-all"
              />
            </figure>
            <div className={"text-center text-sm uppercase"}>{item}</div>
          </Link>
        </div>
      ))}
    </div>
  );
}
