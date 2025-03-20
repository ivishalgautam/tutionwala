"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { H2, H4, P } from "../components/ui/typography";
import { Label } from "@radix-ui/react-label";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";

import Link from "next/link";
import { Controller, useForm } from "react-hook-form";
import http from "@/utils/http";
import { endpoints } from "@/utils/endpoints";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import ShadcnSelect from "../components/ui/shadcn-select";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Edit } from "lucide-react";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "../components/ui/input-otp";
import { formatTime } from "@/utils/time";
import { useRouter } from "next/navigation";
import { useAutocomplete } from "@/hooks/useAutoComplete";
import useMapLoader from "@/hooks/useMapLoader";
import PhoneInputWithCountrySelect, {
  isValidPhoneNumber,
  parsePhoneNumber,
} from "react-phone-number-input";
import ReactSelect from "react-select/async";

import "react-phone-number-input/style.css";
import { getCurrentCoords } from "@/lib/get-current-coords";

const defaultValues = {
  type: "",
  institute_name: "",
  institute_contact_name: "",
  fullname: "",
  email: "",
  country_code: "",
  mobile_number: "",
  gender: "",
  sub_category: "",
  otp: "",
  role: "tutor",
};

const baseUrl = process.env.NEXT_PUBLIC_API_URL;

const searchCategory = async (q) => {
  const { data } = await http().get(`${endpoints.subCategories.getAll}?q=${q}`);
  const filteredData = data?.map(({ id, name }) => ({
    label: name,
    value: id,
  }));
  return filteredData;
};

export default function SignUpTutorForm() {
  const [loading, setLoading] = useState(false);
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isResendDisabled, setIsResendDisabled] = useState(false);
  const [subCatInputVal, setSubCatInputVal] = useState("");
  const debounceTimeoutRef = useRef(null);
  const [remainingTime, setRemainingTime] = useState(0);
  const [minute] = useState(1);
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
  const { isLoaded } = useMapLoader();
  const { inputRef, selectedPlace } = useAutocomplete(isLoaded);

  const { data, isLoading, isFetching } = useQuery({
    queryFn: () => searchCategory(subCatInputVal),
    queryKey: [`search-${subCatInputVal}`, subCatInputVal],
    enabled: !!subCatInputVal,
  });

  const handleInputChange = useCallback((inputValue) => {
    return new Promise((resolve) => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }

      debounceTimeoutRef.current = setTimeout(async () => {
        if (!inputValue.trim()) return resolve([]);

        try {
          const formattedInput = inputValue.replace(/\s+/g, "-");
          setSubCatInputVal(formattedInput);
          const options = await searchCategory(formattedInput);
          resolve(options);
        } catch (error) {
          console.error("Error fetching categories:", error);
          resolve([]);
        }
      }, 300);
    });
  }, []);

  async function signUp(data) {
    try {
      const response = await http().post(`${endpoints.auth.verifyOtp}`, data);
      toast.success(response.message ?? "Signed up succesfully.");
      localStorage.setItem("user", JSON.stringify(response.user_data));
      localStorage.setItem("token", response.token);
      localStorage.setItem("refreshToken", response.refresh_token);
      router.replace("/complete-profile/tutor");
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
  //
  async function handleSendOtp() {
    if (!isOtpSent && !(await trigger())) {
      return;
    }
    try {
      const { nationalNumber, countryCallingCode } = parsePhoneNumber(
        getValues("mobile_number"),
      );
      const mobile_number = nationalNumber;
      const country_code = countryCallingCode;
      const email = getValues("email");
      const fullname = getValues("fullname");
      const { statusText, data } = await axios.post(
        `${baseUrl}${endpoints.auth.sendOtp}`,
        {
          mobile_number,
          country_code,
          email,
          fullname,
        },
      );
      toast.success(data.message);
      setIsOtpSent(true);
      setIsResendDisabled(true);
      setRemainingTime(60 * minute);
      setTimeout(() => setIsResendDisabled(false), 1000 * 60 * minute);
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
      sub_categories: data.sub_category.value,
      otp: data.otp,
      role: data.role,
      coords: data.coords,
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
    async function getCoords() {
      const coords = await getCurrentCoords();
      setValue("coords", coords);
    }

    getCoords();
  }, [setValue]);

  // useEffect(() => {
  //   if (selectedPlace) {
  //     setValue("location", selectedPlace.address);
  //   }
  // }, [selectedPlace]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full">
      <div className="flex items-center justify-start">
        {!isOtpSent ? (
          <div className="w-full space-y-6">
            <H4>Sign Up as tutor</H4>
            <div className="space-y-2">
              <div>
                <div className="flex items-center justify-center gap-2">
                  {[
                    { value: "individual", label: "Individual" },
                    { value: "institute", label: "Institute" },
                  ].map((type) => (
                    <div
                      key={type.value}
                      className={cn("flex-1 rounded-lg border transition-all", {
                        "border-primary bg-primary/10":
                          type.value === watch("type"),
                      })}
                    >
                      <Label
                        className={
                          "relative flex h-full w-full cursor-pointer items-center justify-start p-3"
                        }
                      >
                        <Input
                          type="radio"
                          className="size-4"
                          {...register("type", {
                            required: "Please select a type*",
                          })}
                          value={type.value}
                        />
                        <span className="absolute left-0 top-1/2 w-full -translate-y-1/2 text-center text-sm">
                          {type.label}
                        </span>
                      </Label>
                    </div>
                  ))}
                </div>
                {errors.type && (
                  <span className="text-sm text-rose-500">
                    {errors.type?.message}
                  </span>
                )}
              </div>

              {/* institute */}
              {watch("type") === "institute" && (
                <div className="grid gap-2 md:grid-cols-2">
                  <div>
                    <Label className="text-sm">Institute name</Label>
                    <Input
                      {...register("institute_name", {
                        required: "required*",
                      })}
                      placeholder="Enter institute name"
                      className="rounded-lg bg-gray-100"
                    />
                    {errors.institute_name && (
                      <span className="text-sm text-rose-500">
                        {errors.institute_name.message}
                      </span>
                    )}
                  </div>

                  <div>
                    <Label className="text-sm">
                      Contact person&apos;s name
                    </Label>
                    <Input
                      {...register("institute_contact_name", {
                        required: "required*",
                      })}
                      placeholder="Enter institute name"
                      className="rounded-lg bg-gray-100"
                    />
                    {errors.institute_contact_name && (
                      <span className="text-sm text-rose-500">
                        {errors.institute_contact_name.message}
                      </span>
                    )}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-2">
                {/* fullname */}
                <div>
                  <Label className="text-sm">Full name as per Aadhaar</Label>
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
              <div>
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

              {/* main category you teach */}
              <div className="flex flex-col justify-center">
                <Label className="text-sm">Category you teach</Label>
                <Controller
                  control={control}
                  name="sub_category"
                  rules={{ required: "required*" }}
                  render={({ field }) => (
                    <ReactSelect
                      loadOptions={handleInputChange}
                      placeholder={
                        "What do you want to teach e.g: Maths, Class 12th"
                      }
                      isLoading={isFetching && isLoading}
                      onChange={field.onChange}
                      isMulti={false}
                      value={field.value}
                      menuPortalTarget={document.body}
                      className="rounded-lg border"
                    />
                  )}
                />
                {errors.sub_category && (
                  <span className="text-sm text-rose-500">
                    {errors.sub_category.message}
                  </span>
                )}
              </div>

              {/* location */}
              {/* <div>
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
              </div> */}
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
              <div>
                <Label>Phone</Label>
                <div className="relative">
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
                        disabled
                      />
                    )}
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

                {errors.mobile_number && (
                  <span className="text-red-500">
                    {errors.mobile_number.message}
                  </span>
                )}
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
