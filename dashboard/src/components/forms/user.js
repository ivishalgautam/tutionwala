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
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useAutocomplete } from "@/hooks/useAutoComplete";
import useMapLoader from "@/hooks/useMapLoader";
import ReactSelect from "react-select/async";

import PhoneInputWithCountrySelect, {
  isValidPhoneNumber,
  parsePhoneNumber,
} from "react-phone-number-input";

import "react-phone-number-input/style.css";
import { useRef } from "react";
import Loader from "../loader";

const defaultValues = {
  fullname: "",
  email: "",
  country_code: "",
  mobile_number: "",
  gender: "",
};

export default function UserForm({ type, handleUpdate, userId }) {
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    control,
    setValue,
  } = useForm({ defaultValues });

  const { data, isLoading, isError, error } = useQuery({
    queryFn: async () => {
      const { record } = await http().get(
        `${endpoints.users.getAll}/${userId}`,
      );
      console.log({ record });
      return record;
    },
    queryKey: [`tutor-${userId}`],
    enabled: !!userId && !!(type === "edit"),
  });

  const onSubmit = async (data) => {
    const { nationalNumber, countryCallingCode } = parsePhoneNumber(
      data.mobile_number,
    );

    const payload = {
      fullname: data.fullname,
      email: data.email,
      gender: data.gender,
      country_code: countryCallingCode,
      mobile_number: nationalNumber,
    };

    if (type === "edit") {
      setLoading(true);
      try {
        handleUpdate(payload);
      } catch (error) {
        console.log({ error });
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    if (data) {
      setValue("fullname", data.fullname);
      setValue("gender", data.gender);
      setValue("email", data.email);
      setValue("mobile_number", `+${data.country_code}${data.mobile_number}`);
    }
  }, [data]);

  if (isLoading) return <Loader />;
  if (isError) return error?.message ?? "error fetching user";

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full">
      <div className="flex items-center justify-start">
        <div className="w-full space-y-6">
          <H4>{type === "edit" ? "Edit Tutor" : "Create Tutor"}</H4>
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
