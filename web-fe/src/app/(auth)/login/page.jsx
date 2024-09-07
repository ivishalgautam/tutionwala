"use client";
import LoginForm from "@/components/forms/login";
import OTPForm from "@/components/forms/otp";
import AuthLayout from "@/components/layout/auth-layout";
import useLocalStorage from "@/hooks/useLocalStorage";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Page() {
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [phone, setPhone] = useState("");
  const router = useRouter();

  const [token] = useLocalStorage("token");
  if (token) return router.replace("/");

  return (
    <AuthLayout>
      {!isOtpSent ? (
        <LoginForm setIsOtpSent={setIsOtpSent} setPhone={setPhone} />
      ) : (
        <OTPForm phone={phone} />
      )}
    </AuthLayout>
  );
}
