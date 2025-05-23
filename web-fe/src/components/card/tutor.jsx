import Link from "next/link";
import { H4, Muted } from "../ui/typography";
import EnquiryForm from "../../forms/enquiry";
import { Badge } from "../ui/badge";

import Review from "../review";
import Image from "next/image";
import { BadgeCheck } from "lucide-react";

export default function TutorCard({
  tutor,
  ratings,
  totalReviews,
  searchParams,
}) {
  return (
    <div className="w-full max-w-full space-y-2 rounded-lg border border-gray-200 bg-white p-4">
      <div className="sm:flex sm:items-start sm:justify-start sm:gap-4">
        <figure className="size-24 flex-shrink-0">
          <Image
            src={tutor.profile_picture}
            width={100}
            height={100}
            className="h-full w-full rounded object-cover object-center"
            alt={tutor.fullname}
          />
        </figure>
        <div className="flex-grow space-y-2">
          <div className="sm:flex sm:items-center sm:justify-between">
            <Link href={`/tutors/${tutor.tutor_id}`}>
              <H4
                className={
                  "flex items-center justify-start gap-1 transition-colors hover:text-primary"
                }
              >
                <span>
                  {tutor.type === "institute"
                    ? tutor.institute_name
                    : tutor.fullname}{" "}
                </span>
                <BadgeCheck className="size-5 text-blue-500" />
              </H4>
            </Link>
            <div className="flex gap-1">
              <Review rating={ratings ?? 0} reviews={totalReviews ?? 0} />
            </div>
          </div>
          <Muted className={"line-clamp-4 break-all"}>{tutor.experience}</Muted>
          <div className="grid grid-cols-2">
            {tutor.languages?.length && (
              <div className="space-y-1">
                <div className="text-xs text-gray-500">Languages: </div>
                <div className="flex flex-wrap items-center justify-start gap-2">
                  {tutor.languages.map((language) => (
                    <Badge key={language.name} className="text-xs uppercase">
                      {language.name}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {tutor.boards?.[0]?.length > 0 && (
              <div className="space-y-1">
                <div className="text-xs text-gray-500">Boards: </div>
                <div className="flex flex-wrap items-center justify-start gap-2">
                  {tutor.boards?.[0]?.map((board, ind) => (
                    <Badge key={ind} className="text-xs uppercase">
                      {board.board_name}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
          <div className="text-end">
            <EnquiryForm tutorId={tutor.tutor_id} searchParams={searchParams} />
          </div>
        </div>
      </div>
    </div>
  );
}
