"use client";

import { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { CheckCircle, AlertCircle, Loader2, ArrowLeft } from "lucide-react";
import { MainContext } from "@/store/context";
import { Input } from "@/components/ui/input";
import { useMutation } from "@tanstack/react-query";
import http from "@/utils/http";
import { endpoints } from "@/utils/endpoints";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { formatTime } from "@/utils/time";

// Update the form schema to include OTP validation
const emailSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
});

const otpSchema = z.object({
  otp: z
    .string()
    .min(6, { message: "OTP must be at least 6 characters" })
    .max(6, { message: "OTP must be exactly 6 characters" })
    .regex(/^\d+$/, { message: "OTP must contain only numbers" }),
});

// Update the component to include OTP verification step
export default function EmailVerificationForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [serverError, setServerError] = useState(null);
  const [step, setStep] = useState("email");
  const [submittedEmail, setSubmittedEmail] = useState("");

  const [minute] = useState(1);
  const [isResendDisabled, setIsResendDisabled] = useState(false);
  const [remainingTime, setRemainingTime] = useState(0);
  const { user } = useContext(MainContext);
  const router = useRouter();

  // Email form
  const emailForm = useForm({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      email: user.email,
    },
  });

  // OTP form
  const otpForm = useForm({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      otp: "",
    },
  });

  const requestOtpMutation = useMutation({
    mutationFn: async (data) => {
      return await http().post(endpoints.users.sendEmailOtp, data);
    },
    onSuccess: (data) => {
      setStep("otp");
      setIsResendDisabled(true);
      setRemainingTime(60 * minute);
      setTimeout(() => setIsResendDisabled(false), 1000 * 60 * minute);
      otpForm.setValue("otp", "");
    },
    onError: (error) => {
      console.error(
        "Error sending OTP:",
        error?.response?.data?.message ?? error?.message ?? error,
      );
    },
  });
  const verifyOtpMutation = useMutation({
    mutationFn: async (data) => {
      return await http().post(endpoints.users.verifyEmailOtp, data);
    },
    onSuccess: (data) => {
      toast.success(data?.message ?? "Email verified successfully.");
      router.push("/dashboard/enquiries");
    },
    onError: (error) => {
      console.error(
        "Error sending OTP:",
        error?.response?.data?.message ?? error?.message ?? error,
      );
      setError(
        error?.response?.data?.message ??
          error?.message ??
          "Failed to verify OTP. Please try again.",
      );
    },
  });

  const onSubmitEmail = async (data) => {
    requestOtpMutation.mutate(data);
  };

  const onSubmitOtp = async (data) => {
    const emailFormData = emailForm.getValues();
    verifyOtpMutation.mutate({ email: emailFormData.email, ...data });
  };

  const handleResendCode = async () => {
    const emailFormData = emailForm.getValues();
    requestOtpMutation.mutate({ email: emailFormData.email });
  };

  const resetForm = () => {
    setStep("email");
    setIsSuccess(false);
    setServerError(null);
    emailForm.reset();
    otpForm.reset();
  };

  useEffect(() => {
    if (isResendDisabled) {
      const interval = setInterval(() => {
        setRemainingTime((prevTime) => prevTime - 1);
      }, 1000); // Update remaining time every second
      return () => clearInterval(interval);
    }
  }, [isResendDisabled]);

  return (
    <div className="mx-auto w-full max-w-md rounded-lg border bg-card p-6 shadow-md">
      <h2 className="mb-6 text-center text-2xl font-bold">Verify Your Email</h2>

      {isSuccess ? (
        <div className="flex flex-col items-center justify-center space-y-4 py-4">
          <CheckCircle className="h-12 w-12 text-green-500" />
          <p className="text-center text-muted-foreground">
            Your email has been successfully verified!
          </p>
          <Button onClick={resetForm} variant="outline" className="mt-4">
            Verify another email
          </Button>
        </div>
      ) : step === "email" ? (
        <form
          onSubmit={emailForm.handleSubmit(onSubmitEmail)}
          className="space-y-6"
        >
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">
              Email Address
            </label>
            <Input
              id="email"
              type="email"
              className={`w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary ${
                emailForm.formState.errors.email
                  ? "border-destructive focus:ring-destructive"
                  : "border-input"
              }`}
              placeholder="your.email@example.com"
              {...emailForm.register("email")}
              disabled
            />
            {emailForm.formState.errors.email && (
              <p className="flex items-center gap-1 text-sm text-destructive">
                <AlertCircle className="h-4 w-4" />
                {emailForm.formState.errors.email.message}
              </p>
            )}
          </div>

          {requestOtpMutation.isError && (
            <div className="rounded-md border border-destructive/20 bg-destructive/10 p-3">
              <p className="flex items-center gap-2 text-sm text-destructive">
                <AlertCircle className="h-4 w-4" />
                {requestOtpMutation.error.message ?? "Error sending OTP."}
              </p>
            </div>
          )}

          <Button
            type="submit"
            className="w-full"
            disabled={requestOtpMutation.isLoading}
          >
            {requestOtpMutation.isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending...
              </>
            ) : (
              "Send Verification Code"
            )}
          </Button>

          <p className="text-center text-xs text-muted-foreground">
            We&apos;ll send you a 6-digit verification code to your email
            address
          </p>
        </form>
      ) : (
        <form
          onSubmit={otpForm.handleSubmit(onSubmitOtp)}
          className="space-y-6"
        >
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label htmlFor="otp" className="text-sm font-medium">
                Verification Code
              </label>
            </div>

            <p className="mb-2 text-sm text-muted-foreground">
              Enter the 6-digit code sent to{" "}
              <span className="font-medium">{submittedEmail}</span>
            </p>

            <Input
              id="otp"
              type="text"
              inputMode="numeric"
              maxLength={6}
              className={`w-full rounded-md border px-3 py-2 text-center text-lg tracking-widest focus:outline-none focus:ring-2 focus:ring-primary ${
                otpForm.formState.errors.otp
                  ? "border-destructive focus:ring-destructive"
                  : "border-input"
              }`}
              placeholder="123456"
              {...otpForm.register("otp")}
              disabled={isSubmitting}
            />
            {otpForm.formState.errors.otp && (
              <p className="flex items-center gap-1 text-sm text-destructive">
                <AlertCircle className="h-4 w-4" />
                {otpForm.formState.errors.otp.message}
              </p>
            )}
          </div>

          {verifyOtpMutation.isError && (
            <div className="rounded-md border border-destructive/20 bg-destructive/10 p-3">
              <p className="flex items-center gap-2 text-sm text-destructive">
                <AlertCircle className="h-4 w-4" />
                {verifyOtpMutation.error.message ?? "Error verifying email."}
              </p>
            </div>
          )}
          <div className="flex items-center justify-center gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={handleResendCode}
              className="w-full"
              disabled={verifyOtpMutation.isLoading || isResendDisabled}
            >
              {isResendDisabled
                ? `Resend in ${formatTime(remainingTime)}`
                : "Didn't receive a code? Resend"}
            </Button>
            <Button
              type="submit"
              className="w-full"
              disabled={verifyOtpMutation.isLoading}
            >
              {verifyOtpMutation.isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Verifying...
                </>
              ) : (
                "Verify Code"
              )}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
