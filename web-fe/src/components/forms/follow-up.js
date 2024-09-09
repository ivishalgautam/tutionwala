"use client";
import { Controller, useForm } from "react-hook-form";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "../ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { getFormattedDateTime } from "@/lib/time";
import { useEffect } from "react";
import http from "@/utils/http";
import { endpoints } from "@/utils/endpoints";
import { H4 } from "../ui/typography";

const fetchFollowUp = async (id) => {
  const { data } = await http().get(`${endpoints.followUps.getAll}/${id}`);
  return data;
};

const defaultValues = {
  title: "",
  content: "",
  followupDate: "",
  followupTime: "",
};

export default function CreateFollowUpForm({
  handleCreate,
  handleUpdate,
  type,
  studentId,
  followUpId,
}) {
  const {
    register,
    control,
    setValue,
    formState: { errors },
    handleSubmit,
    watch,
  } = useForm({ defaultValues });

  async function onSubmit(data) {
    const { followupDate, followupTime } = data;
    const formattedDateTime = getFormattedDateTime(followupDate, followupTime);
    const payload = {
      title: data.title,
      content: data.content,
      date: formattedDateTime,
      student_id: studentId,
    };
    if (type === "create") {
      handleCreate(payload);
    } else {
      handleUpdate({ ...payload, id: followUpId });
    }
  }
  useEffect(() => {
    if (followUpId && type === "edit") {
      (async function () {
        const followup = await fetchFollowUp(followUpId);
        const followUpDate = new Date(followup.date.split("T")[0]);
        const followUpTime = followup.date.split("T")[1].split(":00.000Z")[0];
        setValue("title", followup?.title);
        setValue("content", followup?.content);
        setValue("followupDate", followUpDate);
        setValue("followupTime", followUpTime);
      })();
    }
  }, [followUpId, type]);

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-4">
          <H4>{type === "create" ? "Create" : "Update"}</H4>
          <div className="space-y-2">
            {/* title */}
            <div>
              <Label>Title</Label>
              <Input
                {...register("title", {
                  required: "required*",
                })}
                placeholder="Enter title"
              />
              {errors.title && (
                <span className="text-rose-500">{errors.title.message}</span>
              )}
            </div>

            {/* content */}
            <div>
              <Label>Content</Label>
              <Textarea
                {...register("content", {
                  required: "required*",
                })}
                placeholder="Enter content"
              />
              {errors.content && (
                <span className="text-rose-500">{errors.content.message}</span>
              )}
            </div>

            {/* time */}
            <div>
              <Label>Follow up date</Label>
              <div className="flex items-center justify-start gap-2">
                <div>
                  <Controller
                    control={control}
                    name="followupDate"
                    rules={{ required: "required*" }}
                    render={({ field }) => {
                      return (
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-[280px] justify-start text-left font-normal",
                                !field.value && "text-muted-foreground",
                              )}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <Calendar
                              mode="single"
                              initialFocus
                              selected={field.value}
                              onSelect={field.onChange}
                              //   disabled={(date) =>
                              //     date > new Date() || date < new Date("1900-01-01")
                              //   }
                            />
                          </PopoverContent>
                        </Popover>
                      );
                    }}
                  />
                  <br />
                  {errors.followupDate && (
                    <span className="text-red-600">
                      {errors.followupDate.message}
                    </span>
                  )}
                </div>
                <div>
                  <Input
                    type="time"
                    className="w-[100px]"
                    {...register("followupTime", {
                      required: "required*",
                    })}
                  />
                  {errors.followupTime && (
                    <span className="text-red-600">
                      {errors.followupTime.message}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="text-end">
            <Button>Submit</Button>
          </div>
        </div>
      </form>
    </div>
  );
}
