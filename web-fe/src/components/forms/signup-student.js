"use client";
import React, { useCallback, useEffect, useState } from "react";
import { H1, H2, H3, H4, H5, P } from "../ui/typography";
import { Label } from "@radix-ui/react-label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

import Link from "next/link";
import { Controller, useForm } from "react-hook-form";
import http from "@/utils/http";
import { endpoints } from "@/utils/endpoints";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import ShadcnSelect from "../ui/shadcn-select";
import { countries } from "@/data/countries";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Edit } from "lucide-react";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "../ui/input-otp";
import { formatTime } from "@/utils/time";
import { useRouter } from "next/navigation";

const defaultValues = {
  type: "",
  institute_name: "",
  institute_contact_name: "",
  fullname: "",
  email: "",
  country_code: "",
  mobile_number: "",
  gender: "",
  sub_category_id: "",
  otp: "",
  role: "student",
};

const baseUrl = process.env.NEXT_PUBLIC_API_URL;
const fetchSubcategories = async () => {
  const { data } = await axios.get(
    `${baseUrl}${endpoints.subCategories.getAll}`,
  );
  return data.data;
};

export default function SignUpStudentForm() {
  const [loading, setLoading] = useState(false);
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isResendDisabled, setIsResendDisabled] = useState(false);
  const [remainingTime, setRemainingTime] = useState(0);
  const [minute] = useState(5);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    control,
    setValue,
    trigger,
    getValues,
    setFocus,
  } = useForm({ defaultValues });

  const { data: subCategories } = useQuery({
    queryKey: ["sub-categories"],
    queryFn: fetchSubcategories,
  });
  const formattedSubCategories = useCallback(() => {
    return (
      subCategories?.map(({ id: value, name: label }) => ({
        label,
        value,
      })) ?? []
    );
  }, [subCategories]);

  const formattedCountries = useCallback(() => {
    return countries.map(({ value, label }) => ({
      value,
      label: `${value} ${label}`,
    }));
  }, []);

  async function signUp(data) {
    try {
      const response = await http().post(`${endpoints.auth.verifyOtp}`, data);
      toast.success(response.message ?? "Signed up succesfully.");
      localStorage.setItem("user", JSON.stringify(response.user_data));
      localStorage.setItem("token", response.token);
      localStorage.setItem("refreshToken", response.refresh_token);
      router.replace("/complete-profile/student");
    } catch (error) {
      toast.error(
        error?.response?.data?.message ??
          error?.message ??
          "Unable to complete your request!",
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleSendOtp() {
    if (!(await trigger())) {
      return;
    }

    try {
      const mobile_number = getValues("mobile_number");
      const country_code = getValues("country_code");
      const email = getValues("email");
      const { statusText, data } = await axios.post(
        `${baseUrl}${endpoints.auth.sendOtp}`,
        {
          mobile_number,
          country_code,
          email,
        },
      );
      if (statusText === "OK") {
        toast.success(data.message);
        setIsOtpSent(true);
        setIsResendDisabled(true);
        setRemainingTime(60 * minute);
        setTimeout(() => setIsResendDisabled(false), 1000 * 60 * minute);
      }
    } catch (error) {
      toast.error(error.response.data.message ?? "error");
    }
  }

  const onSubmit = async (data) => {
    const payload = {
      type: data.type,
      institute_name: data.institute_name,
      institute_contact_name: data.institute_contact_name,
      fullname: data.fullname,
      email: data.email,
      country_code: data.country_code,
      mobile_number: data.mobile_number,
      gender: data.gender,
      sub_categories: [data.sub_category_id],
      otp: data.otp,
      role: data.role,
      location: data.location,
    };
    await signUp(payload);
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
    <form onSubmit={handleSubmit(onSubmit)} className="w-full">
      <div className="flex items-center justify-start">
        {!isOtpSent ? (
          <div className="w-full space-y-6">
            <H4>Sign Up as Student</H4>
            <div className="space-y-2">
              <div className="grid grid-cols-2 gap-2">
                {/* fullname */}
                <div>
                  <Label className="text-sm">Fullname</Label>
                  <Input
                    type="text"
                    {...register("fullname", {
                      required: "required*",
                    })}
                    placeholder="Enter Your Fullname"
                    className="rounded-lg bg-gray-100"
                  />
                  {errors.fullname && (
                    <span className="text-sm text-rose-500">
                      {errors.fullname.message}
                    </span>
                  )}
                </div>
                {/* gender */}
                <div className="flex flex-col justify-start p-1">
                  <Label className="text-sm">Gender</Label>
                  <Controller
                    control={control}
                    name="gender"
                    rules={{ required: "required*" }}
                    render={({ field }) => (
                      <ShadcnSelect
                        field={field}
                        setValue={setValue}
                        name={"gender"}
                        placeholder="Gender"
                        options={[
                          { value: "male", label: "Male" },
                          { value: "female", label: "Female" },
                        ]}
                        width={"min-w-full"}
                      />
                    )}
                  />
                  {errors.gender && (
                    <span className="text-sm text-rose-500">
                      {errors.gender.message}
                    </span>
                  )}
                </div>
              </div>

              {/* email */}
              <div>
                <Label className="text-sm">Email</Label>
                <Input
                  type="text"
                  {...register("email", {
                    required: "required*",
                  })}
                  placeholder="Enter Your email"
                  className="rounded-lg bg-gray-100"
                />
                {errors.email && (
                  <span className="text-sm text-rose-500">
                    {errors.email.message}
                  </span>
                )}
              </div>

              {/* phone */}
              <div className="flex gap-2">
                <div className="flex flex-col justify-start p-1">
                  <Label className="text-sm">Country</Label>
                  <Controller
                    control={control}
                    name="country_code"
                    rules={{ required: "required*" }}
                    render={({ field }) => (
                      <ShadcnSelect
                        field={field}
                        setValue={setValue}
                        name={"country_code"}
                        placeholder="Country"
                        options={formattedCountries()}
                      />
                    )}
                  />
                  {errors.country_code && (
                    <span className="text-sm text-rose-500">
                      {errors.country_code.message}
                    </span>
                  )}
                </div>
                <div className="flex-grow">
                  <Label className="text-sm">Phone</Label>
                  <Input
                    {...register("mobile_number", {
                      required: "required*",
                    })}
                    placeholder="Enter your phone number"
                    className="rounded-lg bg-gray-100"
                  />
                  {errors.mobile_number && (
                    <span className="text-sm text-rose-500">
                      {errors.mobile_number.message}
                    </span>
                  )}
                </div>
              </div>

              {/* main category you teach */}
              <div className="flex flex-col justify-center">
                <Label className="text-sm">Category you teach</Label>
                <Controller
                  control={control}
                  name="sub_category_id"
                  rules={{ required: "required*" }}
                  render={({ field }) => (
                    <ShadcnSelect
                      field={field}
                      setValue={setValue}
                      name={"sub_category_id"}
                      placeholder="Category"
                      options={formattedSubCategories()}
                      width={"min-w-full"}
                    />
                  )}
                />
                {errors.sub_category_id && (
                  <span className="text-sm text-rose-500">
                    {errors.sub_category_id.message}
                  </span>
                )}
              </div>

              {/* location */}
              <div>
                <Label className="text-sm">Location</Label>
                <Input
                  type="text"
                  {...register("location", {
                    required: "required*",
                  })}
                  placeholder="Enter Your location"
                  className="rounded-lg bg-gray-100"
                />
                {errors.location && (
                  <span className="text-sm text-rose-500">
                    {errors.location.message}
                  </span>
                )}
              </div>
            </div>

            <div>
              <Button
                className="w-full"
                type="button"
                onClick={() => handleSendOtp()}
              >
                {loading && (
                  <span className="mr-3 h-5 w-5 animate-spin rounded-full border-4 border-white/30 border-t-white"></span>
                )}
                Sign Up
              </Button>
            </div>

            <div className="">
              <P className={"text-center text-sm font-medium tracking-wide"}>
                Already have an account?{" "}
                <Link href={"/login"} className="text-primary">
                  Login
                </Link>
              </P>
            </div>
          </div>
        ) : (
          <div className="w-full space-y-6">
            <H2 className={"text-center"}>Verify OTP</H2>
            <div className="space-y-2">
              {/* phone */}
              <div className="flex gap-2">
                <div className="flex flex-col justify-center p-1">
                  <Label className="text-sm">Country</Label>
                  <Controller
                    control={control}
                    name="country_code"
                    rules={{ required: "required*" }}
                    render={({ field }) => (
                      <ShadcnSelect
                        field={field}
                        setValue={setValue}
                        name={"country_code"}
                        placeholder="Country"
                        options={formattedCountries()}
                      />
                    )}
                  />
                  {errors.country_code && (
                    <span className="text-sm text-rose-500">
                      {errors.country_code.message}
                    </span>
                  )}
                </div>

                <div className="flex-grow">
                  <Label className="text-sm">Phone</Label>
                  <div className="relative">
                    <Input
                      {...register("mobile_number", {
                        required: "required*",
                      })}
                      disabled
                      placeholder="Enter your phone"
                      className="rounded-lg bg-gray-100"
                    />
                    <Button
                      className="absolute right-0 top-0 z-10 text-primary hover:bg-transparent"
                      type="button"
                      size="icon"
                      variant="ghost"
                      onClick={() => {
                        setIsOtpSent(false);
                        setTimeout(() => {
                          setFocus("mobile_number");
                        }, 0);
                      }}
                    >
                      <Edit size={20} />
                    </Button>
                  </div>

                  {errors.phone && (
                    <span className="text-sm text-rose-500">
                      {errors.phone.message}
                    </span>
                  )}
                </div>
              </div>
              {/* otp */}
              <div className="flex items-end gap-2">
                <div>
                  <Label className="text-sm">OTP</Label>
                  <Controller
                    control={control}
                    name="otp"
                    rules={{ required: "required*" }}
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

                  {errors.otp && (
                    <span className="text-sm text-rose-500">
                      {errors.otp.message}
                    </span>
                  )}
                </div>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={handleSendOtp}
                  disabled={isResendDisabled}
                >
                  {isResendDisabled
                    ? `Resend in ${formatTime(remainingTime)}`
                    : "Resend OTP"}
                </Button>
              </div>
            </div>
            <div>
              <Button className="w-full">
                {loading && (
                  <span className="mr-3 h-5 w-5 animate-spin rounded-full border-4 border-white/30 border-t-white"></span>
                )}
                Submit
              </Button>
            </div>
          </div>
        )}
      </div>
    </form>
  );
}
