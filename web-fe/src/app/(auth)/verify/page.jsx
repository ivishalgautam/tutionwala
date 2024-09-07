"use client";
import OTPForm from "@/components/forms/otp";
import AuthLayout from "@/components/layout/auth-layout";

export default function Verify() {
  return (
    <AuthLayout>
      <OTPForm />
    </AuthLayout>
  );
}
