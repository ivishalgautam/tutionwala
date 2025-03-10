"use client";
import React, { useEffect, useMemo, useState } from "react";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import Title from "../Title";
import http from "@/utils/http";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { toast } from "sonner";
import axios from "axios";
import useLocalStorage from "@/hooks/useLocalStorage";
import { isObject } from "@/utils/object";
import Image from "next/image";
import { AiOutlineDelete } from "react-icons/ai";
import { Label } from "../ui/label";
import { endpoints } from "../../utils/endpoints";
import { Textarea } from "../ui/textarea";
import { H4, H5 } from "../ui/typography";
import { Switch } from "../ui/switch";
import { useFetchCategories } from "@/hooks/useFetchCategories";

import ReactSelect from "react-select";
import Spinner from "../spinner";
import ShadcnSelect from "../ui/shadcn-select";
import { Plus, Trash, Trash2 } from "lucide-react";
import { useFetchBoards } from "@/hooks/useFetchBoards";
import { cn } from "@/lib/utils";

let defaultValues = {
  name: "",
  category_id: "",
  fields: [], // { questionForTutor: "", questionForStudent: "", fieldName: "", options: [], fieldType: "", }
  is_featured: false,
  is_boards: false,
  meta_title: "",
  meta_description: "",
  meta_keywords: "",
};

export function SubCategoryForm({
  type,
  handleCreate,
  handleUpdate,
  handleDelete,
  subCategoryId,
}) {
  const {
    register,
    control,
    handleSubmit,
    setValue,
    watch,
    setFocus,
    formState: { errors },
  } = useForm({
    defaultValues,
  });
  const { fields, append, remove } = useFieldArray({
    control,
    name: "fields",
  });
  const [token] = useLocalStorage("token");
  const [image, setImage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { data: boards } = useFetchBoards();
  const { data: categories, isLoading: isCategoryLoading } =
    useFetchCategories();
  const formattedCategories = useMemo(
    () =>
      categories?.map(({ id: value, name: label }) => ({
        value,
        label,
      })),
    [isCategoryLoading, subCategoryId],
  );
  const onSubmit = (data) => {
    const payload = {
      name: data?.name,
      category_id: data?.category_id,
      is_boards: data?.is_boards,
      board_ids: data?.is_boards ? data?.boards.map(({ value }) => value) : [],
      image: image,
      fields: data.fields.map((field) => ({
        ...field,
        fieldName: String(field.fieldName)
          .trim()
          .toLowerCase()
          .replace(/\s+/g, "_"),
        options: field.options.map((opt) => String(opt).trim().toLowerCase()),
      })),
      is_featured: data?.is_featured,
      meta_title: data?.meta_title,
      meta_description: data?.meta_description,
      meta_keywords: data?.meta_keywords,
    };

    if (type === "create") {
      handleCreate(payload);
    } else if (type === "edit") {
      handleUpdate(payload);
    } else if (type === "delete") {
      handleDelete(subCategoryId);
    }
  };

  const handleFileChange = async (event) => {
    try {
      const selectedFiles = event.target.files[0];
      const formData = new FormData();
      formData.append("file", selectedFiles);
      // console.log("formData=>", formData);
      const { data } = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}${endpoints.files.upload}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        },
      );
      setImage(data[0]);
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
      toast.success(resp?.message);

      setImage("");
    } catch (error) {
      console.log(error);
      if (isObject(error)) {
        return toast.error(error?.message);
      } else {
        toast.error("error deleting image");
      }
    }
  };

  const handleOptionSubmit = (ind) => {
    let optionInput = `fields.${ind}.optionInput`;
    let fieldOptions = `fields.${ind}.options`;

    setFocus(optionInput);
    if (!watch(optionInput)) return;

    let newOptions = Array.from(
      new Set([...watch(fieldOptions), watch(optionInput)]),
    );

    setValue(fieldOptions, newOptions);
    setValue(optionInput, "");
  };

  const deleteOption = (fieldInd, optionInd) => {
    const newOptions = watch(`fields.${fieldInd}.options`).filter(
      (_, key) => key !== optionInd,
    );
    setValue(`fields.${fieldInd}.options`, newOptions);
  };
  // console.log(watch("fields"));
  const appendField = () => {
    append(defaultValues.fields[0]);
  };

  useEffect(() => {
    // Fetch data from API and populate the form with prefilled values
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const { data } = await http().get(
          `${endpoints.subCategories.getAll}/getById/${subCategoryId}`,
        );
        data && setValue("name", data?.name);
        data && setValue("category_id", data?.category_id);
        data && setImage(data.image);
        data && setValue("is_featured", data?.is_featured);
        data && setValue("is_boards", data?.is_boards);
        data && setValue("fields", data?.fields);
        data &&
          setValue(
            "boards",
            boards?.filter((item) => data?.board_ids.includes(item.value)),
          );
        data && setValue("meta_title", data?.meta_title);
        data && setValue("meta_description", data?.meta_description);
        data && setValue("meta_keywords", data?.meta_keywords);
      } catch (error) {
        console.error(error);
        toast.error(error.message ?? "Unable to fetch details!");
      } finally {
        setIsLoading(false);
      }
    };
    if (
      formattedCategories?.length &&
      subCategoryId &&
      (type === "edit" || type === "view" || type === "delete")
    ) {
      fetchData();
    }
  }, [subCategoryId, type, formattedCategories, setValue, boards]);

  if (isLoading) return <Spinner />;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="rounded-xl">
      <div className="space-y-8 p-2">
        <Title
          text={
            type === "create"
              ? "Create sub category"
              : type === "view"
                ? "Sub category details"
                : type === "edit"
                  ? "Sub category update"
                  : "Are you sure you want to delete"
          }
        />
        <div className="space-y-4 rounded-lg bg-white p-4">
          <H4>Basic Information</H4>
          <div className="grid grid-cols-3 gap-4">
            {/* name */}
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                {...register("name", { required: "required" })}
                type="text"
                id="name"
                placeholder="Name"
                disabled={type === "view" || type === "delete"}
              />
              {errors.name && (
                <span className="text-sm text-red-600">
                  {errors.name.message}
                </span>
              )}
            </div>

            {/* category */}
            <div className="">
              <Label htmlFor="category">Category</Label>
              <div>
                <Controller
                  control={control}
                  name="category_id"
                  maxMenuHeight={230}
                  rules={{ required: "Please select category" }}
                  render={({ field }) => {
                    return (
                      <ShadcnSelect
                        options={formattedCategories}
                        placeholder="category"
                        name={"category_id"}
                        setValue={setValue}
                        field={field}
                      />
                    );
                  }}
                />
              </div>
              {errors.category_id && (
                <span className="text-sm text-red-600">
                  {errors.category_id.message}
                </span>
              )}
            </div>
          </div>

          {/* image */}
          {image ? (
            <div className="relative inline-block">
              {(type === "edit" || type === "create") && (
                <button
                  type="button"
                  className="absolute -right-2 -top-2 z-10 rounded-md bg-red-500 p-1 text-white"
                  onClick={() => deleteFile(image)}
                >
                  <AiOutlineDelete />
                </button>
              )}
              <Image
                src={`${process.env.NEXT_PUBLIC_IMAGE_DOMAIN}/${image}`}
                width={100}
                height={100}
                className="rounded-lg"
                alt="sub category image"
                // onClick={() => {
                //   setOpenDocViewer(true);
                //   setDocs(
                //     `${process.env.NEXT_PUBLIC_IMAGE_DOMAIN}/${image}`
                //   );
                // }}
                onError={(err) => setImage("")}
              />
            </div>
          ) : (
            <div>
              <Label htmlFor="image">Image</Label>
              <Input
                {...register("image", {
                  required: "Please select image",
                })}
                type="file"
                id="image"
                multiple
                onChange={handleFileChange}
                disabled={type === "view" || type === "delete"}
                accept="image/jpeg, image/jpg, image/png, image/webp"
              />
              {errors.image && (
                <span className="text-sm text-red-600">
                  {errors.image.message}
                </span>
              )}
            </div>
          )}
          <div className="mt-4 flex flex-col justify-center gap-1">
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
          <div className="mt-4 flex flex-col justify-center gap-1">
            <Label htmlFor="is_boards">Add boards?</Label>
            <Controller
              control={control}
              name="is_boards"
              render={({ field: { onChange, value } }) => (
                <Switch
                  onCheckedChange={onChange}
                  checked={value}
                  disabled={type === "view" || type === "delete"}
                />
              )}
            />
          </div>
        </div>

        {/* board and subjects */}
        {watch("is_boards") && (
          <div className="space-y-4 rounded-lg bg-white p-4">
            <H4>Boards</H4>
            <div>
              <Controller
                control={control}
                name={"boards"}
                rules={{ required: "required*" }}
                render={({ field }) => (
                  <ReactSelect
                    options={boards}
                    isMulti
                    onChange={field.onChange}
                    defaultValue={field.value}
                    className="uppercase"
                    placeholder={"Select boards"}
                    disabled={type === "view"}
                  />
                )}
              />
              {errors.boards && (
                <span className="text-red-500">{errors.boards.message}</span>
              )}
            </div>
          </div>
        )}

        {/* custom questions */}
        <div className="space-y-4 rounded-lg bg-white p-4">
          <H4>Additional Questions</H4>
          <div className="space-y-2">
            {fields.map((item, ind) => (
              <div
                key={item.id}
                className="relative space-y-4 rounded-lg border bg-gray-50 p-4"
              >
                <div className="flex items-center justify-between">
                  <H5>Question: {ind + 1}</H5>
                  {type !== "view" && (
                    <Button
                      size="icon"
                      type="button"
                      variant="destructive"
                      onClick={() => remove(ind)}
                    >
                      <Trash2 size={20} className="" />
                    </Button>
                  )}
                </div>

                <div className="grid grid-cols-3 gap-4">
                  {/* field type */}
                  <div>
                    <Label>Field type</Label>
                    <div>
                      <Controller
                        control={control}
                        name={`fields.${ind}.fieldType`}
                        rules={{ required: "required*" }}
                        render={({ field }) => (
                          <ShadcnSelect
                            options={[
                              { value: "dropdown", label: "Dropdown" },
                              { value: "radio", label: "Radio" },
                              { value: "checkbox", label: "Checkbox" },
                            ]}
                            name={`fields.${ind}.fieldType`}
                            setValue={setValue}
                            placeholder="type"
                            fi
                            field={field}
                          />
                        )}
                      />
                      {errors.fields?.[ind]?.fieldType && (
                        <span className="text-sm text-red-500">
                          {errors.fields[ind].fieldType.message}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* field name */}
                  <div>
                    <Label>Field name</Label>
                    <Input
                      type="text"
                      placeholder="Enter field name"
                      {...register(`fields.${ind}.fieldName`, {
                        required: "required*",
                      })}
                      disabled={type === "view"}
                    />
                    {errors.fields?.[ind]?.fieldName && (
                      <span className="text-sm text-red-500">
                        {errors.fields[ind].fieldName.message}
                      </span>
                    )}
                  </div>

                  {/* field question for tutor */}
                  <div className="col-span-3">
                    <Label>Question for Tutor</Label>
                    <Input
                      type="text"
                      placeholder="Enter question for tutor"
                      {...register(`fields.${ind}.questionForTutor`, {
                        required: "required*",
                      })}
                      disabled={type === "view"}
                    />
                    {errors.fields?.[ind]?.questionForTutor && (
                      <span className="text-sm text-red-500">
                        {errors.fields[ind].questionForTutor.message}
                      </span>
                    )}
                  </div>

                  {/* field question for student */}
                  <div className="col-span-3">
                    <Label>Question for Student</Label>
                    <Input
                      type="text"
                      placeholder="Enter question for student"
                      {...register(`fields.${ind}.questionForStudent`, {
                        required: "required*",
                      })}
                      disabled={type === "view"}
                    />
                    {errors.fields?.[ind]?.questionForStudent && (
                      <span className="text-sm text-red-500">
                        {errors.fields[ind].questionForStudent.message}
                      </span>
                    )}
                  </div>

                  {/* options */}
                  <div className="col-span-3">
                    <Label>Options</Label>
                    <div className="flex items-center justify-start gap-2">
                      <Input
                        type="text"
                        placeholder="Enter option"
                        {...register(`fields.${ind}.optionInput`)}
                      />
                      <Button
                        type="button"
                        onClick={() => handleOptionSubmit(ind)}
                        size="icon"
                        variant="outline"
                      >
                        <Plus size={20} />
                      </Button>
                    </div>
                    <ul className="mt-2 list-disc space-y-2">
                      {watch(`fields.${ind}.options`)?.map((ele, key) => (
                        <li key={ele} className="rounded-md bg-gray-100 p-2">
                          <div className="flex items-center justify-between">
                            <span>{ele}</span>
                            {type !== "view" && (
                              <span>
                                <Trash
                                  className="cursor-pointer text-red-500"
                                  onClick={() => deleteOption(ind, key)}
                                  size={20}
                                />
                              </span>
                            )}
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
            {type !== "view" && (
              <div className="text-end">
                <Button type="button" onClick={() => appendField()}>
                  Add Question
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* product seo */}
        <div className="space-y-4 rounded-lg bg-white p-4">
          <H4>Product SEO</H4>
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

        <div className="text-right">
          {type !== "view" && (
            <Button variant={type === "delete" ? "destructive" : "primary"}>
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
