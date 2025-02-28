import { Loader } from "@/components/header";
import TutotProfile from "@/components/tutor-profile";
import { endpoints } from "@/utils/endpoints";
import axios from "axios";
import { Suspense } from "react";

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
    ...teacher
  } = await fetchTutor(tutorId);

  return (
    <div className="">
      <Suspense fallback={<Loader />}>
        <TutotProfile
          tutorId={tutorId}
          {...{
            user: tutor,
            courses,
            avg_ratings,
            total_reviews,
            ...teacher,
          }}
        />
      </Suspense>
    </div>
  );
}
