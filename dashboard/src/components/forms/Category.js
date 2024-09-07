"use client";
import React, { useEffect, useState } from "react";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import Title from "../Title";
import http from "@/utils/http";
import { endpoints } from "@/utils/endpoints";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "../ui/textarea";
import { H4 } from "../ui/typography";
import useFileUpload from "@/hooks/useFileUpload";
import Spinner from "../spinner";

export function CategoryForm({
  type,
  handleCreate,
  handleUpdate,
  handleDelete,
  categoryId,
}) {
  const {
    register,
    control,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm({ defaultValues: { faq: [{ question: "", answer: "" }] } });
  const [isLoading, setIsLoading] = useState(false);

  const { fields, append, remove } = useFieldArray({
    control,
    name: "faq",
  });

  const [pictures, setPictures, uploadPicture, deletePicture] = useFileUpload();
  const onSubmit = (data) => {
    const payload = {
      name: data.name,
      isFeatured: data.isFeatured,
      image: pictures[0],
      metaTitle: data?.metaTitle,
      metaDescription: data?.metaDescription,
      metaKeywords: data?.metaKeywords,
    };

    if (type === "create") {
      handleCreate(payload);
    } else if (type === "edit") {
      handleUpdate(payload);
    } else if (type === "delete") {
      handleDelete(categoryId);
    }
    reset();
  };
  useEffect(() => {
    // Fetch data from API and populate the form with prefilled values
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const { data } = await http().get(
          `${endpoints.categories.getAll}/getById/${categoryId}`,
        );
        data && setValue("name", data?.name);
        data && setValue("isFeatured", data?.isFeatured);
        data && setPictures([data?.image]);
        // data && setBanners(data?.banners);
        data && setValue("metaTitle", data?.metaTitle);
        data && setValue("metaDescription", data?.metaDescription);
        data && setValue("metaKeywords", data?.metaKeywords);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    if (
      categoryId &&
      (type === "edit" || type === "view" || type === "delete")
    ) {
      fetchData();
    }
  }, [categoryId, type, setPictures, setValue]);

  if (isLoading) return <Spinner />;

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="space-y-4 p-2">
        <Title
          text={
            type === "create"
              ? "Create category"
              : type === "view"
                ? "Category details"
                : type === "edit"
                  ? "Edit category"
                  : "Are you sure you want to delete"
          }
        />
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input
              type="text"
              disabled={type === "view" || type === "delete"}
              // className="w-full px-4 py-3 h-[44px] border outline-none rounded-md bg-[#F7F7FC] font-mulish text-xl font-semibold"
              placeholder="Category Name"
              {...register("name", {
                required: "Category is required",
              })}
            />
            {errors.name && (
              <span className="text-red-600">{errors.name.message}</span>
            )}
          </div>
        </div>

        {/* product seo */}
        <div className="space-y-4">
          <H4>Category SEO</H4>
          <div className="grid grid-cols-1 gap-2">
            {/* meta title */}
            <div>
              <Label htmlFor={"metaTitle"}>Meta title</Label>
              <Input
                type="text"
                placeholder="Enter title tag"
                {...register("metaTitle")}
                disabled={type === "view" || type === "delete"}
              />
            </div>

            {/* meta descrition */}
            <div>
              <Label htmlFor={"metaDescription"}>Meta description</Label>
              <Textarea
                placeholder="Enter meta description tag"
                {...register("metaDescription")}
                disabled={type === "view" || type === "delete"}
              />
            </div>

            {/* meta keywords */}
            <div>
              <Label htmlFor={"metaKeywords"}>Meta keywords</Label>
              <Textarea
                placeholder="Enter meta keywords"
                {...register("metaKeywords")}
                disabled={type === "view" || type === "delete"}
              />
            </div>
          </div>
        </div>

        {/* is featured */}
        <div className="col-span-3 mt-4 flex flex-col justify-center gap-1">
          <Label htmlFor="isFeatured">Is featured?</Label>
          <Controller
            control={control}
            name="isFeatured"
            render={({ field: { onChange, value } }) => (
              <Switch
                onCheckedChange={onChange}
                checked={value}
                disabled={type === "view" || type === "delete"}
              />
            )}
          />
        </div>

        <div className="text-right">
          {type !== "view" && (
            <Button variant={type === "delete" ? "destructive" : "default"}>
              {type === "create"
                ? "Create"
                : type === "edit"
                  ? "Update"
                  : "Delete"}
            </Button>
          )}
        </div>
      </div>
    </form>
  );
}
