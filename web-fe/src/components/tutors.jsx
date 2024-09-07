import Image from "next/image";
import React from "react";
import { H4, Muted } from "./ui/typography";
import { Rating } from "@smastrom/react-rating";
import { Badge } from "./ui/badge";
import EnquiryForm from "./forms/enquiry";

export default function Tutors({ tutors = [], isLoading }) {
  if (isLoading) {
    return Array.from({ length: 10 }).map((_, key) => (
      <div
        key={key}
        className="mb-2 flex h-[247.2px] w-full animate-pulse items-start justify-start gap-4 rounded bg-gray-100 p-4"
      >
        {/* image */}
        <div className="size-32 flex-shrink-0 animate-pulse rounded bg-gray-200"></div>
        <div className="flex h-full w-full flex-col justify-between">
          <div className="space-y-4">
            {/* name and ratings */}
            <div className="flex w-full items-center justify-between">
              <div className="h-[28px] w-[200px] animate-pulse rounded-full bg-gray-200"></div>
              <div className="h-[28px] w-[100px] animate-pulse rounded-full bg-gray-200"></div>
            </div>
            {/* experince */}
            <div className="space-y-1">
              <div className="h-5 w-full animate-pulse rounded-full bg-gray-200"></div>
              <div className="h-5 w-full animate-pulse rounded-full bg-gray-200"></div>
              <div className="h-5 w-4/5 animate-pulse rounded-full bg-gray-200"></div>
            </div>
          </div>
          {/* button */}
          <div className="flex items-center justify-end">
            <div className="h-10 w-24 animate-pulse rounded-lg bg-gray-200"></div>
          </div>
        </div>
      </div>
    ));
  }
  return tutors?.map((tutor) => (
    <div key={tutor.id} className="space-y-2 rounded border p-4">
      <div className="flex items-start justify-start gap-4">
        <figure className="size-32 flex-shrink-0">
          <Image
            src={`${process.env.NEXT_PUBLIC_IMAGE_DOMAIN}/${tutor.profile_picture}`}
            width={100}
            height={100}
            alt=""
            className="h-full w-full rounded object-cover object-center"
          />
        </figure>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <H4>{tutor.fullname}</H4>
            <Rating
              style={{ maxWidth: 100 }}
              value={Math.floor(Math.random() * 5)}
              onChange={() => {}}
              readOnly
            />
          </div>
          <Muted>
            {tutor.experience?.length > 150
              ? `${tutor.experience.substring(0, 150)}...`
              : tutor.experience}
          </Muted>
          <div className="grid grid-cols-2">
            {tutor.languages?.length && (
              <div className="space-y-1">
                <div className="text-xs text-gray-500">Languages: </div>
                <div className="flex flex-wrap items-center justify-start gap-2">
                  {tutor.languages
                    .map(({ name }) => name)
                    .map((language) => (
                      <Badge key={language} className="text-xs uppercase">
                        {language}
                      </Badge>
                    ))}
                </div>
              </div>
            )}
            {tutor.boards?.length && (
              <div className="space-y-1">
                <div className="text-xs text-gray-500">Boards: </div>
                <div className="flex flex-wrap items-center justify-start gap-2">
                  {tutor.boards
                    .map(({ board_name }) => board_name)
                    .map((board) => (
                      <Badge key={board} className="text-xs uppercase">
                        {board}
                      </Badge>
                    ))}
                </div>
              </div>
            )}
          </div>
          <div className="text-end">
            <EnquiryForm tutorId={tutor.id} />
          </div>
        </div>
      </div>
    </div>
  ));
}
