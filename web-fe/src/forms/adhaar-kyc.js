import React, { useContext, useEffect, useRef, useState } from "react";
import { useForm, FormProvider, Controller } from "react-hook-form";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button, buttonVariants } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertCircle, CheckCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Muted } from "@/components/ui/typography";
import { useMutation } from "@tanstack/react-query";
import http from "@/utils/http";
import { endpoints } from "@/utils/endpoints";
import { useRouter } from "next/navigation";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { formatTime } from "@/utils/time";
import Link from "next/link";
import { MainContext } from "@/store/context";

// For the Muted component from your example

const AadhaarForm = () => {
  const [currentStep, setCurrentStep] = useState("details");
  const [otpSent, setOtpSent] = useState(false);
  const [isResendDisabled, setIsResendDisabled] = useState(false);
  const [remainingTime, setRemainingTime] = useState(0);
  const [minute] = useState(1);
  const [verificationComplete, setVerificationComplete] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();
  const { user } = useContext(MainContext);

  const aadhaarForm = useForm({
    defaultValues: {
      customer_aadhaar_number: "",
      name_to_match: "",
      consent: false,
      consent_text:
        "I hear by declare my consent agreement for fetching my information via ZOOP API",
    },
  });

  // Form for OTP verification
  const otpForm = useForm({
    defaultValues: {
      otp: "",
    },
  });

  // Form for AADHAAR details
  const {
    register,
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = aadhaarForm;

  const requestOtpMutation = useMutation({
    mutationFn: async (data) => {
      return await http().post(endpoints.auth.kycOtpRequest, data);
    },
    onSuccess: (data) => {
      setOtpSent(true);
      setCurrentStep("otp");
      aadhaarForm.setValue("request_id", data.request_id);
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
      setError("Failed to send OTP. Please try again.");
    },
  });

  const verifyOtpMutation = useMutation({
    mutationFn: async (data) => {
      return await http().post(endpoints.auth.kycOtpVerify, data);
    },
    onSuccess: (data) => {
      router.push("/");
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

  const onSubmit = async (data) => {
    setError(null);
    const formattedData = {
      ...data,
      consent: data.consent ? "Y" : "N",
    };
    requestOtpMutation.mutate(formattedData);
  };

  const handleOtpSubmit = async (data) => {
    setError(null);
    const aadhaarData = aadhaarForm.getValues();
    const payload = {
      otp: data.otp,
      request_id: aadhaarData.request_id,
      customer_aadhaar_number: aadhaarData.customer_aadhaar_number,
    };
    verifyOtpMutation.mutate(payload);
  };

  const resendOtp = async () => {
    setError(null);
    const aadhaarData = aadhaarForm.getValues();
    const formattedData = {
      ...aadhaarData,
      consent: aadhaarData.consent ? "Y" : "N",
    };
    requestOtpMutation.mutate(formattedData);
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
    <div className="mx-auto mt-6 max-w-lg">
      <Tabs
        value={currentStep}
        onValueChange={setCurrentStep}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger
            value="details"
            disabled={currentStep === "otp" && !verificationComplete}
          >
            AADHAAR Details
          </TabsTrigger>
          <TabsTrigger value="otp" disabled={!otpSent}>
            OTP Verification
          </TabsTrigger>
        </TabsList>

        <TabsContent value="details">
          <Card className="mx-auto">
            <CardHeader>
              <CardTitle>AADHAAR Verification</CardTitle>
              <CardDescription>
                Enter your AADHAAR details to verify your identity
              </CardDescription>
            </CardHeader>

            <CardContent>
              <FormProvider {...aadhaarForm}>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div>
                    <Label>AADHAAR Number</Label>
                    <Input
                      placeholder="Enter your 12-digit AADHAAR number"
                      {...register("customer_aadhaar_number", {
                        required: "AADHAAR number is required",
                        pattern: {
                          value: /^\d{12}$/,
                          message: "AADHAAR number must be exactly 12 digits",
                        },
                      })}
                    />

                    {aadhaarForm.formState.errors.customer_aadhaar_number && (
                      <p className="mt-1 text-sm text-red-500">
                        {
                          aadhaarForm.formState.errors.customer_aadhaar_number
                            .message
                        }
                      </p>
                    )}
                  </div>

                  {/* <div>
                    <Label>Name to Match (Optional)</Label>
                    <Input
                      placeholder="Enter name as on AADHAAR card"
                      {...register("name_to_match")}
                    />
                    <Muted>
                      Leave blank if you don&apos;t want to match the name
                    </Muted>
                  </div> */}

                  <div className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <Controller
                      control={control}
                      name="consent"
                      rules={{
                        required: "You must provide consent to proceed",
                      }}
                      render={({ field }) => (
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      )}
                    />
                    <div className="space-y-1 leading-none">
                      <Label>Consent</Label>
                      <Muted>{aadhaarForm.getValues().consent_text}</Muted>
                    </div>
                  </div>

                  {aadhaarForm.formState.errors.consent && (
                    <p className="mt-1 text-sm text-red-500">
                      {aadhaarForm.formState.errors.consent.message}
                    </p>
                  )}
                  <div className="flex items-center justify-center gap-2">
                    {user?.role === "student" && (
                      <Link
                        href={"/"}
                        className={`w-full ${buttonVariants({ variant: "outline" })}`}
                      >
                        I will do it later
                      </Link>
                    )}

                    <Button
                      className="w-full"
                      disabled={requestOtpMutation.isLoading}
                    >
                      {requestOtpMutation.isLoading
                        ? "Processing..."
                        : "Request OTP"}
                    </Button>
                  </div>
                </form>
              </FormProvider>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="otp">
          <Card className="mx-auto">
            <CardHeader>
              <CardTitle>OTP Verification</CardTitle>
              <CardDescription>
                Enter the OTP sent to your AADHAAR-linked mobile number
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FormProvider {...otpForm}>
                <form
                  onSubmit={otpForm.handleSubmit(handleOtpSubmit)}
                  className="space-y-6"
                >
                  {verificationComplete ? (
                    <Alert className="border-green-400 bg-green-50">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <AlertTitle className="text-green-600">
                        Verification Successful
                      </AlertTitle>
                      <AlertDescription className="text-green-600">
                        Your AADHAAR has been successfully verified.
                      </AlertDescription>
                    </Alert>
                  ) : (
                    <>
                      <div>
                        <Label>Enter OTP</Label>
                        <Controller
                          control={otpForm.control}
                          name="otp"
                          render={({ field }) => (
                            <InputOTP
                              maxLength={6}
                              value={field.value}
                              onChange={field.onChange}
                            >
                              <InputOTPGroup>
                                <InputOTPSlot index={0} />
                                <InputOTPSlot index={1} />
                                <InputOTPSlot index={2} />
                                <InputOTPSlot index={3} />
                                <InputOTPSlot index={4} />
                                <InputOTPSlot index={5} />
                              </InputOTPGroup>
                            </InputOTP>
                          )}
                        />
                        <Muted>
                          OTP has been sent to your AADHAAR-linked mobile number
                        </Muted>
                        {otpForm.formState.errors.otp && (
                          <p className="mt-1 text-sm text-red-500">
                            {otpForm.formState.errors.otp.message}
                          </p>
                        )}
                      </div>

                      <div className="flex justify-between">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={resendOtp}
                          disabled={
                            isResendDisabled || requestOtpMutation.isLoading
                          }
                        >
                          {requestOtpMutation.isLoading
                            ? "Sending..."
                            : isResendDisabled
                              ? `Resend in ${formatTime(remainingTime)}`
                              : "Resend OTP"}
                        </Button>
                        <Button
                          type="submit"
                          disabled={verifyOtpMutation.isLoading}
                        >
                          {verifyOtpMutation.isLoading
                            ? "Verifying..."
                            : "Verify OTP"}
                        </Button>
                      </div>
                    </>
                  )}
                </form>
              </FormProvider>
            </CardContent>
          </Card>
        </TabsContent>

        {error && (
          <Alert className="mx-auto mt-4 border-red-400 bg-red-50">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertTitle className="text-red-600">Error</AlertTitle>
            <AlertDescription className="text-red-600">
              {error}
            </AlertDescription>
          </Alert>
        )}

        <CardFooter className="mt-4 flex justify-center text-sm text-gray-500">
          Protected by ZOOP API verification system
        </CardFooter>
      </Tabs>
    </div>
  );
};

export default AadhaarForm;
