import FollowUps from "@/components/follow-ups";
import React from "react";

export default function Page({ params: { slug: studentId } }) {
  return (
    <div className="container min-h-screen bg-white p-4">
      <FollowUps studentId={studentId} />
    </div>
  );
}
