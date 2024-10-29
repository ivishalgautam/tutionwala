"use client";
import React, { useCallback, useEffect, useState } from "react";
import { H4 } from "../ui/typography";
import { Label } from "@radix-ui/react-label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

import { Controller, useForm } from "react-hook-form";
import http from "@/utils/http";
import { endpoints } from "@/utils/endpoints";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import ShadcnSelect from "../ui/shadcn-select";
import { useQuery } from "@tanstack/react-query";
import { useAutocomplete } from "@/hooks/useAutoComplete";
import useMapLoader from "@/hooks/useMapLoader";
import ReactSelect from "react-select/async";

import PhoneInputWithCountrySelect, {
  isValidPhoneNumber,
  parsePhoneNumber,
} from "react-phone-number-input";

import "react-phone-number-input/style.css";
import { useRef } from "react";
import { searchCategory } from "@/server/category";
import { fetchTutor } from "@/server/users";

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
  role: "tutor",
};

export default function TutorForm({ type, handleUpdate, tutorId }) {
  const { isLoaded } = useMapLoader();
  const { inputRef, selectedPlace } = useAutocomplete(isLoaded);
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    control,
    setValue,
  } = useForm({ defaultValues });

  const [subCatInputVal, setSubCatInputVal] = useState("");
  const debounceTimeoutRef = useRef(null);
  const { data, isLoading, isFetching } = useQuery({
    queryFn: () => searchCategory(subCatInputVal),
    queryKey: [`search-${subCatInputVal}`, subCatInputVal],
    enabled: !!subCatInputVal,
  });

  const { data: tutor } = useQuery({
    queryFn: fetchTutor(tutorId),
    queryKey: [`tutor-${tutorId}`],
    enabled: !!tutorId && !!(type === "edit"),
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
      const response = await http().post(
        `${endpoints.users.getAll}/tutor`,
        data,
      );
      toast.success(response.message ?? "Created.");
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
      sub_categories: data.sub_category_id.value,
      role: data.role,
      location: data.location,
    };

    if (type === "edit") {
      handleUpdate({
        fullname: data.fullname,
        email: data.email,
        gender: data.gender,
        country_code: countryCallingCode,
        mobile_number: nationalNumber,
      });
    } else {
      await signUp(payload);
    }
  };

  useEffect(() => {
    if (selectedPlace) {
      setValue("location", selectedPlace.address);
    }
  }, [selectedPlace]);

  useEffect(() => {
    if (tutor) {
      setValue("fullname", tutor.fullname);
      setValue("gender", tutor.gender);
      setValue("email", tutor.email);
      setValue("mobile_number", `+${tutor.country_code}${tutor.mobile_number}`);
    }
  }, [tutor]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full">
      <div className="flex items-center justify-start">
        <div className="w-full space-y-6">
          <H4>{type === "edit" ? "Edit Tutor" : "Create Tutor"}</H4>
          <div className="space-y-2">
            {type !== "edit" && (
              <div>
                <div className="flex items-center justify-center gap-4">
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
            )}

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
                  <Label className="text-sm">Contact person&apos;s name</Label>
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
            {type !== "edit" && (
              <div className="flex flex-col justify-center md:col-span-1">
                <Label className="text-sm">Category</Label>
                <Controller
                  control={control}
                  name="sub_category_id"
                  rules={{ required: "required*" }}
                  render={({ field }) => (
                    <ReactSelect
                      loadOptions={handleInputChange}
                      placeholder={"Search..."}
                      isLoading={isFetching && isLoading}
                      onChange={field.onChange}
                      isMulti={false}
                      value={field.value}
                      menuPortalTarget={document.body}
                    />
                  )}
                />
                {errors.sub_category_id && (
                  <span className="text-sm text-rose-500">
                    {errors.sub_category_id.message}
                  </span>
                )}
              </div>
            )}

            {/* location */}
            {type !== "edit" && (
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
            )}
          </div>

          <div className="text-end">
            <Button className="w-full sm:w-auto">
              {loading && (
                <span className="mr-3 h-5 w-5 animate-spin rounded-full border-4 border-white/30 border-t-white"></span>
              )}
              Submit
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
}
