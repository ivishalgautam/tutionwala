"use client";
import React from "react";
import { useForm } from "react-hook-form";
import { Input } from "../ui/input";
import axios from "axios";
import { endpoints } from "@/utils/endpoints";
import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { LoaderCircle } from "lucide-react";
import Image from "next/image";

const LoginForm = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const {
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm();

  async function loginUser(credentials) {
    setLoading(true);
    const baseUrl = process.env.NEXT_PUBLIC_API_URL;

    try {
      const { data } = await axios.post(
        `${baseUrl}${endpoints.auth.login}`,
        credentials,
      );
      localStorage.setItem("user", JSON.stringify(data.user_data));
      localStorage.setItem("token", data.token);
      localStorage.setItem("refreshToken", data.refresh_token);
      router.push("/");
    } catch (error) {
      console.error(error?.response?.data);
      return toast.error(error?.response?.data?.message ?? "Error");
    } finally {
      setLoading(false);
    }
  }

  const onSubmit = async (data) => {
    await loginUser(data);
  };

  return (
    <div className="w-full px-4">
      <div className="mx-auto w-full max-w-md space-y-8">
        <Image
          src={"/images/logo.png"}
          width={150}
          height={150}
          alt="Tutionwala"
          className="mx-auto rounded-lg"
        />

        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold">Welcome back</h1>
          <p className="text-muted-foreground">
            Enter your credentials to sign in to your account
          </p>
        </div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <InputBox
            type="text"
            name="username"
            placeholder="Enter username"
            register={register}
            errors={errors}
          />
          <InputBox
            type="password"
            name="password"
            placeholder="Enter password"
            register={register}
            errors={errors}
          />
          <div className="mb-10">
            <Button disable={loading} variant="primary" className="w-full">
              {loading && <LoaderCircle className="mr-1 size-4 animate-spin" />}{" "}
              Submit
            </Button>
          </div>
        </form>
        {/* <a
                href="/#"
                className="text-dark mb-2 inline-block text-base hover:text-primary hover:underline dark:text-white"
              >
                Forget Password?
              </a>
              <p className="text-body-color dark:text-dark-6 text-base">
                <span className="pr-0.5">Not a member yet?</span>
                <a href="/#" className="text-primary hover:underline">
                  Sign Up
                </a>
              </p> */}
      </div>
    </div>
  );
};

export default LoginForm;

const InputBox = ({ type, placeholder, name, register, errors }) => {
  return (
    <div className="mb-6">
      <Input
        type={type}
        placeholder={placeholder}
        name={name}
        {...register(name, { required: "required*" })}
        className="border-stroke text-body-color dark:border-dark-3 w-full rounded-md border bg-transparent px-5 py-3 text-base outline-none focus:border-primary focus-visible:shadow-none dark:text-white"
      />
      {errors[name] && (
        <span className="text-right text-rose-500">{errors[name].message}</span>
      )}
    </div>
  );
};
