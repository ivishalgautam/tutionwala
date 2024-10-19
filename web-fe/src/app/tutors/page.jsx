import TutorsPageLoader from "@/components/loaders/tutors-page";
import dynamic from "next/dynamic";
const TutorsWithFilter = dynamic(
  () => import("@/components/tutors-with-filter"),
  {
    loading: () => <TutorsPageLoader />,
  },
);

export default function Page() {
  return (
    <div className="min-h-screen bg-white pb-10">
      <TutorsWithFilter />
    </div>
  );
}
