"use client";
import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import Title from "../Title";
import http from "@/utils/http";
import { endpoints } from "@/utils/endpoints";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "../ui/textarea";
import { H4, H5 } from "../ui/typography";
import Spinner from "../spinner";
import { Trash } from "lucide-react";
import Image from "next/image";
import axios from "axios";
import useLocalStorage from "@/hooks/useLocalStorage";
import { toast } from "sonner";

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
  const [image, setImage] = useState("");
  const [token] = useLocalStorage("token");

  const onSubmit = (data) => {
    const payload = {
      name: data.name,
      is_featured: data.is_featured,
      image: image,
      meta_title: data?.meta_title,
      meta_description: data?.meta_description,
      meta_keywords: data?.meta_keywords,
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
        data && setValue("is_featured", data?.is_featured);
        data && setImage(data?.image);
        // data && setBanners(data?.banners);
        data && setValue("meta_title", data?.meta_title);
        data && setValue("meta_description", data?.meta_description);
        data && setValue("meta_keywords", data?.meta_keywords);
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
  }, [categoryId, type, setValue]);

  const handleFileChange = async (event) => {
    try {
      const selectedFiles = event.target.files[0];
      const formData = new FormData();
      formData.append("file", selectedFiles);
      console.log("formData=>", formData);
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}${endpoints.files.upload}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        },
      );
      if (image) {
        deleteFile(image).then((data) => {
          console.log({ data });
          setImage(response.data[0]);
        });
      } else {
        setImage(response.data[0]);
      }
      if (type === "edit") {
        handleUpdate({
          image: response.data[0],
        });
      }
    } catch (error) {
      console.error("Error uploading image:", error);
    } finally {
    }
  };

  const deleteFile = async (filePath) => {
    try {
      const resp = await http().delete(
        `${endpoints.files.getFiles}?file_path=${filePath}`,
      );

      setImage("");
      return true;
    } catch (error) {
      return toast.error(error?.message ?? "Error deleting image");
    }
  };

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
        <div className="space-y-4 p-6">
          <H5 className={"text-center"}>Adhaar</H5>
          <div className="space-y-4">
            <div className="flex flex-col items-center justify-center">
              <Input
                type="file"
                placeholder="Select Adhaar Card"
                {...register("image")}
                onChange={(e) => handleFileChange(e, "image")}
                multiple={false}
                accept="image/png, image/jpeg, image/jpg"
                className={`max-w-56 bg-primary text-white`}
              />
              {errors.image && (
                <span className="text-sm text-red-500">
                  {errors.image.message}
                </span>
              )}
            </div>
            <div className="flex items-center justify-center gap-4 rounded-lg border border-dashed border-gray-300 p-8">
              {image ? (
                <figure className="relative size-32">
                  <Image
                    src={`${process.env.NEXT_PUBLIC_IMAGE_DOMAIN}/${image}`}
                    width={500}
                    height={500}
                    alt="image"
                    className="h-full w-full"
                    multiple={false}
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    onClick={() => deleteFile(image, "adhaar")}
                    className="absolute -right-2 -top-2"
                    size="icon"
                  >
                    <Trash size={20} />
                  </Button>
                </figure>
              ) : (
                <div>No file selected</div>
              )}
            </div>
          </div>
          <div className="text-end">
            <Button>Submit</Button>
          </div>
        </div>
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
              <Label htmlFor={"meta_title"}>Meta title</Label>
              <Input
                type="text"
                placeholder="Enter title tag"
                {...register("meta_title")}
                disabled={type === "view" || type === "delete"}
              />
            </div>

            {/* meta descrition */}
            <div>
              <Label htmlFor={"meta_description"}>Meta description</Label>
              <Textarea
                placeholder="Enter meta description tag"
                {...register("meta_description")}
                disabled={type === "view" || type === "delete"}
              />
            </div>

            {/* meta keywords */}
            <div>
              <Label htmlFor={"meta_keywords"}>Meta keywords</Label>
              <Textarea
                placeholder="Enter meta keywords"
                {...register("meta_keywords")}
                disabled={type === "view" || type === "delete"}
              />
            </div>
          </div>
        </div>

        {/* is featured */}
        <div className="col-span-3 mt-4 flex flex-col justify-center gap-1">
          <Label htmlFor="is_featured">Is featured?</Label>
          <Controller
            control={control}
            name="is_featured"
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
