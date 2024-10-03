import React from "react";
import { H5 } from "../ui/typography";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useForm } from "react-hook-form";

export default function PersonalInfoForm({ fullname, email }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: { fullname: fullname ?? "", email: email ?? "" },
  });

  return (
    <form>
      <div className="space-y-4">
        <H5>Personal Information</H5>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <Label>Fullname</Label>
            <Input
              type="text"
              {...register("fullname", { required: "required*" })}
              placeholder={"Enter Fullname"}
            />
            {errors.fullname && (
              <span className="text-red-500">{errors.fullname.message}</span>
            )}
          </div>
          <div>
            <Label>Email</Label>
            <Input
              type="text"
              {...register("email", { required: "required*" })}
              placeholder={"Enter Email"}
            />
            {errors.email && (
              <span className="text-red-500">{errors.email.message}</span>
            )}
          </div>
        </div>
        <div className="text-right">
          <Button>Submit</Button>
        </div>
      </div>
    </form>
  );
}
