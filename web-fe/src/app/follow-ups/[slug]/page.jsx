import FollowUps from "@/components/follow-ups-by-student";

export default function Page({ params: { slug: studentId } }) {
  return (
    <div className="container min-h-screen bg-white p-4">
      <FollowUps studentId={studentId} />
    </div>
  );
}
