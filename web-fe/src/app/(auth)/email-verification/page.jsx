"use client";
import Loading from "@/components/loading";
import EmailVerificationForm from "@/forms/email-verification";
import { MainContext } from "@/store/context";
import { useRouter } from "next/navigation";
import { useContext } from "react";

export default function EmailVerificationPage() {
  const router = useRouter();
  const { user } = useContext(MainContext);
  if (user?.is_email_verified) {
    router.replace("/dashboard/enquiries");
  }
  return (
    <div className="flex h-[80vh] items-center justify-center">
      <EmailVerificationForm />
    </div>
  );
}
