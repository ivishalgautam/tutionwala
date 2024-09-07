import React, { useEffect, useState } from "react";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { H1, Small } from "@/components/ui/typography";
import { useForm, Controller } from "react-hook-form";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { useMutation } from "@tanstack/react-query";
import http from "@/utils/http";
import { endpoints } from "@/utils/endpoints";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const sendOtp = async (data) => {
  return await http().post(`${endpoints.auth.login}/otp-send`, data);
};

export default function OTPForm({ phone }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const {
    control,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: { otp: "" },
  });
  const [isResendDisabled, setIsResendDisabled] = useState(false);
  const [remainingTime, setRemainingTime] = useState(0);
  const [minute] = useState(5);

  const sendMutation = useMutation(sendOtp, {
    onSuccess: (data) => {
      toast.success(data.message);
      setIsResendDisabled(true);
      setRemainingTime(60 * minute);
      setTimeout(() => setIsResendDisabled(false), 1000 * 60 * minute);
    },
    onError: (error) => {
      // console.log(error);
      if (error.response.status === 500) {
        return toast.error("Error sending otp!");
      }
      toast.error(error.message);
    },
  });

  async function verifyOtp({ phone, otp }) {
    setLoading(true);
    try {
      const response = await http().post(`${endpoints.auth.login}/otp-verify`, {
        mobile_number: phone,
        otp,
      });
      localStorage.setItem("user", JSON.stringify(response.user_data));
      localStorage.setItem("token", response.token);
      localStorage.setItem("refreshToken", response.refresh_token);
      router.push("/");
      toast.success("Logged in.");
      return response;
    } catch (error) {
      // console.log(error);
      return toast.error(error.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (isResendDisabled) {
      const interval = setInterval(() => {
        setRemainingTime((prevTime) => prevTime - 1);
      }, 1000); // Update remaining time every second
      return () => clearInterval(interval);
    }
  }, [isResendDisabled]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
  };

  const handleSendOtp = () => {
    sendMutation.mutate({ mobile_number: phone });
  };

  const handleVerifyOtp = (otp, phone) => {
    verifyOtp({ otp, phone });
  };

  const onSubmit = ({ otp }) => {
    handleVerifyOtp(otp, phone);
  };

  return (
    <form className="w-full" onSubmit={handleSubmit(onSubmit)}>
      <div className="space-y-4 p-8">
        <div className="relative mb-8 before:absolute before:-bottom-5 before:left-0 before:h-1.5 before:w-20 before:bg-black">
          <H1>Verify OTP</H1>
        </div>
        <div>
          <Label>OTP</Label>
          <Controller
            control={control}
            name="otp"
            rules={{ required: "Please enter your OTP" }}
            render={({ field }) => (
              <InputOTP maxLength={6} {...field}>
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
          {/* {errors.otp && <span>{errors.otp.message}</span>} */}
          <Small className={"text-center"}>Enter your one-time password.</Small>
        </div>
        <div className="flex items-center justify-start gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={handleSendOtp}
            disabled={isResendDisabled}
          >
            {isResendDisabled
              ? `Resend in ${formatTime(remainingTime)}`
              : "Resend OTP"}
          </Button>
          <Button>
            {loading && (
              <span className="mr-3 h-5 w-5 animate-spin rounded-full border-4 border-white/30 border-t-white"></span>
            )}
            Submit
          </Button>
        </div>
      </div>
    </form>
  );
}
