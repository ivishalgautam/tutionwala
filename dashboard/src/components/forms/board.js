"use client";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Title from "../Title";
import http from "@/utils/http";
import { endpoints } from "@/utils/endpoints";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import Spinner from "../Spinner";
import { Plus, X } from "lucide-react";

export function BoardForm({ type, handleCreate, handleUpdate, boardId }) {
  const {
    register,
    control,
    handleSubmit,
    setValue,
    reset,
    watch,
    setFocus,
    formState: { errors },
  } = useForm({ defaultValues: { name: "", subjects: [], subjectName: "" } });
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = (data) => {
    const payload = {
      name: data.name,
      subjects: data.subjects,
    };

    if (type === "create") {
      handleCreate(payload);
    } else if (type === "edit") {
      handleUpdate({ ...payload, id: boardId });
    }
  };

  const addSubject = () => {
    setFocus("subjectName");
    const name = watch("subjectName");
    if (!name) return;
    const subjects = watch("subjects");
    const newSubjects = Array.from(new Set([...subjects, name]));
    setValue("subjects", newSubjects);
    setValue("subjectName", "");
  };

  const deleteSubject = (ind) => {
    const subjects = watch("subjects");
    const newSubjects = subjects.filter((_, key) => key !== ind);
    setValue("subjects", newSubjects);
  };

  useEffect(() => {
    // Fetch data from API and populate the form with prefilled values
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const { data } = await http().get(
          `${endpoints.boards.getAll}/${boardId}`,
        );
        data && setValue("name", data?.name);
        data && setValue("subjects", data?.subjects);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    if (boardId && (type === "edit" || type === "view" || type === "delete")) {
      fetchData();
    }
  }, [boardId, type, setValue]);
  console.log(watch("subjects"));
  if (isLoading) return <Spinner />;

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="space-y-4 p-2">
        <Title
          text={
            type === "create"
              ? "Create Board"
              : type === "view"
                ? "Board details"
                : type === "edit"
                  ? "Edit Board"
                  : "Are you sure you want to delete"
          }
        />
        <div className="space-y-2">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input
              type="text"
              disabled={type === "view" || type === "delete"}
              // className="w-full px-4 py-3 h-[44px] border outline-none rounded-md bg-[#F7F7FC] font-mulish text-xl font-semibold"
              placeholder="Board Name"
              {...register("name", {
                required: "Board is required",
              })}
            />
            {errors.name && (
              <span className="text-red-600">{errors.name.message}</span>
            )}
          </div>

          {/* add subject */}
          <div className="flex gap-2">
            <Input
              type="text"
              disabled={type === "view" || type === "delete"}
              // className="w-full px-4 py-3 h-[44px] border outline-none rounded-md bg-[#F7F7FC] font-mulish text-xl font-semibold"
              placeholder="Subject Name"
              {...register("subjectName")}
            />
            <Button type="button" onClick={addSubject}>
              <Plus />
            </Button>
          </div>

          <div className="flex flex-wrap items-center justify-start gap-2">
            {watch("subjects")?.map((subject, ind) => (
              <div
                key={subject}
                onClick={() => deleteSubject(ind)}
                className="flex cursor-pointer items-center justify-center gap-1 rounded-md border px-2 py-1 text-sm"
              >
                <span>{subject}</span>
                <span>
                  <X size={15} />
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="text-right">
          {type !== "view" && <Button variant={"primary"}>Submit</Button>}
        </div>
      </div>
    </form>
  );
}
