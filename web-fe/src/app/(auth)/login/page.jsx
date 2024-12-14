"use client";
import LoginForm from "@/forms/login";
import OTPForm from "@/forms/otp";
import AuthLayout from "@/components/layout/auth-layout";
import useLocalStorage from "@/hooks/useLocalStorage";
import { useRouter } from "next/navigation";
import { useContext, useState } from "react";
import { MainContext } from "@/store/context";

export default function Page() {
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [phone, setPhone] = useState("");
  const router = useRouter();
  const { user } = useContext(MainContext);
  if (user) {
    return router.replace("/");
  } else {
    localStorage.clear();
  }

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
