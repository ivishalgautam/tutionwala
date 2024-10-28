"use client";
import OTPForm from "@/forms/otp";
import AuthLayout from "@/components/layout/auth-layout";

export default function Verify() {
  return (
    <AuthLayout>
      <OTPForm />
    </AuthLayout>
  );
}
