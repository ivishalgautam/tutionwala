"use client";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useMutation } from "@tanstack/react-query";
import http from "@/utils/http";
import { endpoints } from "@/utils/endpoints";
import { FaRegEye } from "react-icons/fa";
import { toast } from "sonner";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import Title from "../Title";
import { useRouter } from "next/navigation";

async function createCustomer(data) {
  return http().post(endpoints.users.getAll, data);
}

export function UserForm() {
  const {
    register,
    control,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      fullname: "",
      mobile_number: "",
      email: "",
      username: "",
      password: "",
      role: "",
      trainer_type: "",
    },
  });
  const [showPasswords, setShowPasswords] = useState({
    password: false,
    cpassword: false,
  });
  const router = useRouter();

  const createMutation = useMutation({
    mutationFn: createCustomer,
    onSuccess: (data) => {
      reset();
      toast.message(data?.message ?? "User created");
      router.push("/users");
    },
    onError: (error) => {
      toast.error(error?.message ?? "Error creating user!");
    },
  });

  const handleCreate = async (data) => {
    createMutation.mutate(data);
  };

  const onSubmit = (data) => {
    const payload = {
      fullname: data.fullname,
      mobile_number: data.mobile_number,
      email: data.email,
      username: data.username,
      password: data.password,
      role: data.role,
      trainer_type: data.trainer_type,
    };

    handleCreate(payload);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="flex items-center justify-start">
        <div className="w-full space-y-6">
          <div className="space-y-4">
            {/* title */}
            <div className="">
              <Title text={"Create user"} />
            </div>

            {/* user info */}
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3">
              {/* avatar */}
              <div className="sm:col-span-2 md:col-span-3">
                <Label htmlFor="avatar">Avatar</Label>
                <div className="flex items-center justify-center">
                  <Input type="file" />
                </div>
              </div>

              {/* role */}
              <div>
                <Label htmlFor="role">Role</Label>
                <Controller
                  control={control}
                  name="role"
                  rules={{ required: "required*" }}
                  render={({ field: { onChange, value } }) => (
                    <Select onValueChange={onChange} defaultValue={value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Roles</SelectLabel>
                          <SelectItem value="sales_person">
                            Sales Person
                          </SelectItem>
                          <SelectItem value="trainer">Trainer</SelectItem>
                          <SelectItem value="customer">Customer</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.role && (
                  <span className="text-red-500">{errors.role.message}</span>
                )}
              </div>

              {/* TRAINER TYPE */}
              {watch("role") === "trainer" && (
                <div>
                  <Label htmlFor="trainer_type">Trainer Type</Label>
                  <Controller
                    control={control}
                    name="trainer_type"
                    rules={{ required: "required*" }}
                    render={({ field: { onChange, value } }) => (
                      <Select onValueChange={onChange} defaultValue={value}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a Trainer Type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>Types</SelectLabel>
                            <SelectItem value="general">General</SelectItem>
                            <SelectItem value="personal">Personal</SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.trainer_type && (
                    <span className="text-red-500">
                      {errors.trainer_type.message}
                    </span>
                  )}
                </div>
              )}

              {/* fullname */}
              <div>
                <Label htmlFor="fullname">Fullname</Label>
                <Input
                  type="text"
                  placeholder="Fullname"
                  {...register("fullname", {
                    required: "required",
                  })}
                />
                {errors.fullname && (
                  <span className="text-red-600">
                    {errors.fullname.message}
                  </span>
                )}
              </div>

              {/* mobile number */}
              <div>
                <Label htmlFor="mobile_number">Mobile number</Label>
                <Input
                  {...register("mobile_number", {
                    required: "required",
                  })}
                  placeholder="Enter mobile number"
                />
                {errors.mobile_number && (
                  <span className="text-red-600">
                    {errors.mobile_number.message}
                  </span>
                )}
              </div>

              {/* email */}
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  type="text"
                  placeholder="Email"
                  {...register("email", {
                    required: "required",
                    pattern: {
                      value: /\S+@\S+\.\S+/,
                      message: "Entered value does not match email format",
                    },
                  })}
                />
                {errors.email && (
                  <span className="text-red-600">{errors.email.message}</span>
                )}
              </div>

              {/* username */}
              <div>
                <Label htmlFor="username">Username</Label>
                <Input
                  type="text"
                  placeholder="Username"
                  {...register("username", {
                    required: "required",
                  })}
                />
                {errors.username && (
                  <span className="text-red-600">
                    {errors.username.message}
                  </span>
                )}
              </div>

              {/* passwords */}
              <div>
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    type={showPasswords.password ? "text" : "password"}
                    placeholder="Password"
                    {...register("password", {
                      required: "required",
                    })}
                  />
                  <div
                    className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
                    onClick={() =>
                      setShowPasswords((prev) => ({
                        ...prev,
                        password: !prev.password,
                      }))
                    }
                  >
                    <FaRegEye />
                  </div>
                </div>
                {errors.password && (
                  <span className="text-red-600">
                    {errors.password.message}
                  </span>
                )}
              </div>

              {/* confirm password */}
              <div className="relative">
                <Label htmlFor="confirm_password">Confirm password</Label>
                <div className="relative">
                  <Input
                    type={showPasswords.cpassword ? "text" : "password"}
                    placeholder="Confirm password"
                    {...register("confirm_password", {
                      required: "required",
                      validate: (val) => {
                        if (watch("password") != val) {
                          return "Your passwords do no match";
                        }
                      },
                    })}
                  />
                  <div
                    className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
                    onClick={() =>
                      setShowPasswords((prev) => ({
                        ...prev,
                        cpassword: !showPasswords.cpassword,
                      }))
                    }
                  >
                    <FaRegEye />
                  </div>
                </div>
                {errors.confirm_password && (
                  <span className="text-red-600">
                    {errors.confirm_password.message}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* submit */}
          <div className="text-right">
            <Button variant={"primary"}>Create</Button>
          </div>
        </div>
      </div>
    </form>
  );
}
