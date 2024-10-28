import EnquiryForm from "@/forms/enquiry";
import Review from "@/components/review";
import { H3, H4, Muted } from "@/components/ui/typography";
import { endpoints } from "@/utils/endpoints";
import axios from "axios";
import Image from "next/image";

const baseUrl = process.env.NEXT_PUBLIC_API_URL;
async function fetchTutor(id) {
  const { data } = await axios.get(`${baseUrl}${endpoints.tutor.getAll}/${id}`);

  return data.data;
}

export default async function Page({ params: { slug: tutorId } }) {
  const {
    user: tutor,
    courses,
    avg_ratings,
    total_reviews,
  } = await fetchTutor(tutorId);

  return (
    <div className="">
      <div className="container my-4 space-y-8 rounded-xl bg-white p-4 lg:p-8">
        <div className="flex items-start justify-start gap-4">
          <figure className="h-[150px] w-[150px]">
            <Image
              src={tutor.profile_picture}
              width={150}
              height={150}
              alt={tutor.fullname}
              className={
                "h-full w-full rounded-lg object-cover object-center shadow-lg"
              }
            />
          </figure>
          <div className="space-y-1">
            <div>
              <Review rating={avg_ratings} reviews={total_reviews} />
            </div>
            <H4>{tutor.fullname}</H4>
            <div>
              {courses?.map((course) => (
                <span
                  key={course.id}
                  className="cursor-pointer transition-colors hover:text-primary"
                >
                  {course.name} ({course.category_name}),
                </span>
              ))}
            </div>
            <div className="!mt-4">
              <EnquiryForm tutorId={tutorId} />
            </div>
          </div>
        </div>
        <div className="space-y-10">
          <H3 className={"border-b-2 border-primary/10 py-2"}>
            About {tutor.fullname}
          </H3>
          {tutor.intro_video && (
            <video
              src={tutor.intro_video}
              controls
              className="mx-auto w-96 rounded-lg"
              muted
            ></video>
          )}
          <Muted className={"!mt-10"}>{tutor.experience}</Muted>
        </div>
      </div>
    </div>
  );
}
