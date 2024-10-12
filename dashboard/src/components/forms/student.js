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
import ShadcnSelect from "../ui/shadcn-select";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useRouter } from "next/navigation";
import useMapLoader from "@/hooks/useMapLoader";
import { useAutocomplete } from "@/hooks/useAutoComplete";
import PhoneInputWithCountrySelect, {
  isValidPhoneNumber,
  parsePhoneNumber,
} from "react-phone-number-input";

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

export default function StudentForm() {
  const [loading, setLoading] = useState(false);
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isResendDisabled, setIsResendDisabled] = useState(false);
  const [remainingTime, setRemainingTime] = useState(0);
  const [minute] = useState(5);
  const router = useRouter();
  const { isLoaded } = useMapLoader();
  const { inputRef, selectedPlace } = useAutocomplete(isLoaded);

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
      const { nationalNumber, countryCallingCode } = parsePhoneNumber(
        getValues("mobile_number"),
      );
      const mobile_number = nationalNumber;
      const country_code = countryCallingCode;
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
    const { nationalNumber, countryCallingCode } = parsePhoneNumber(
      data.mobile_number,
    );

    const payload = {
      type: data.type,
      institute_name: data.institute_name,
      institute_contact_name: data.institute_contact_name,
      fullname: data.fullname,
      email: data.email,
      country_code: countryCallingCode,
      mobile_number: nationalNumber,
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

  useEffect(() => {
    if (selectedPlace) {
      setValue("location", selectedPlace.address);
    }
  }, [selectedPlace]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full">
      <div className="flex items-center justify-start">
        <div className="w-full space-y-6">
          <H4>Create Student</H4>
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
            <div className="grid grid-cols-2 gap-4">
              {/* email */}
              <div className="md:col-span-1">
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
              <div className="md:col-span-1">
                <Label>Phone</Label>
                <Controller
                  control={control}
                  name="mobile_number"
                  rules={{
                    required: "required*",
                    validate: (value) =>
                      isValidPhoneNumber(value) || "Invalid phone number",
                  }}
                  render={({ field }) => (
                    <PhoneInputWithCountrySelect
                      placeholder="Enter phone number"
                      value={field.value}
                      onChange={field.onChange}
                      defaultCountry="IN"
                    />
                  )}
                />

                {errors.mobile_number && (
                  <span className="text-red-500">
                    {errors.mobile_number.message}
                  </span>
                )}
              </div>
            </div>
            {/* main category */}
            <div className="flex flex-col justify-center">
              <Label className="text-sm">Category</Label>
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
              <Controller
                control={control}
                name="location"
                rules={{ required: "required*" }}
                render={({ field: { onChange, value } }) => (
                  <Input ref={inputRef} value={value} />
                )}
              />
              {errors.location && (
                <span className="text-sm text-rose-500">
                  {errors.location.message}
                </span>
              )}
            </div>
          </div>

          <div className="text-end">
            <Button
              className="w-full sm:w-auto"
              type="button"
              onClick={() => handleSendOtp()}
            >
              {loading && (
                <span className="mr-3 h-5 w-5 animate-spin rounded-full border-4 border-white/30 border-t-white"></span>
              )}
              Create
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
}
