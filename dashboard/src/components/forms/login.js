"use client";
import React from "react";
import { useForm } from "react-hook-form";
import { Input } from "../ui/input";
import axios from "axios";
import { endpoints } from "@/utils/endpoints";
import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

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
    <div className="bg-gray-1 dark:bg-dark lg:py-[120px]">
      <div className="container mx-auto">
        <div className="-mx-4 flex flex-wrap">
          <div className="w-full px-4">
            <div className="dark:bg-dark-2 relative mx-auto max-w-[525px] overflow-hidden rounded-lg bg-white px-10 py-16 text-center shadow sm:px-12 md:px-[60px]">
              <div className="mb-10 text-center md:mb-16">
                <p
                  href="/#"
                  className="mx-auto inline-block text-2xl font-bold"
                >
                  Login
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
                  <input
                    type="submit"
                    value="Sign In"
                    className="w-full cursor-pointer rounded-md border border-primary bg-primary px-5 py-3 text-base font-medium text-white transition hover:bg-opacity-90"
                  />
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
        </div>
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
