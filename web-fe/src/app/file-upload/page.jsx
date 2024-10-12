"use client";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";

import "react-phone-number-input/style.css";
import PhoneInput, {
  isValidPhoneNumber,
  parsePhoneNumber,
} from "react-phone-number-input";

export default function Page() {
  const {
    handleSubmit,
    register,
    watch,
    control,
    formState: { errors },
  } = useForm();
  const onSubmit = async (data) => {
    const phoneNumber = parsePhoneNumber(data.mobile_number);
    console.log({ phoneNumber });
  };

  console.log({ errors });

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)} className="mx-auto max-w-lg">
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
              <PhoneInput
                placeholder="Enter phone number"
                value={field.value}
                onChange={field.onChange}
                defaultCountry="IN"
              />
            )}
          />

          {errors.mobile_number && (
            <span className="text-red-500">{errors.mobile_number.message}</span>
          )}
        </div>

        <Button>Submit</Button>
      </form>
    </div>
  );
}
