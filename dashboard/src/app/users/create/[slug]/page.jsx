"use client";
import StudentForm from "@/components/forms/student";
import TutorForm from "@/components/forms/tutor";
import React from "react";

export default function Page({ params: { slug } }) {
  return (
    <div className="rounded-lg bg-white p-8">
      {slug === "tutor" ? <TutorForm /> : <StudentForm />}
    </div>
  );
}
