"use client";
import Section from "@/components/section";
import Spinner from "@/components/spinner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { endpoints } from "@/utils/endpoints";
import http from "@/utils/http";
import { useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";

const fetchSubCategory = async (id) => {
  const { data } = await http().get(
    `${endpoints.subCategories.getAll}/getById/${id}`,
  );
  return data;
};

export default function Page({ params: { id } }) {
  const { register, watch, control, setValue } = useForm({
    defaultValues: {
      fields: [],
      boards: [],
    },
  });

  const { data, isLoading } = useQuery({
    queryKey: [`subCategory-${id}`],
    queryFn: () => fetchSubCategory(id),
    enabled: !!id,
  });

  const boards = data ? data.boards : [];
  const boardNames = boards.map(({ board_name }) => board_name);
  const selectedBoards = watch("selected_boards") ?? [];

  const setBoards = (board, subject) => {
    const prevBoards = watch("boards");

    const existingBoard = prevBoards.find(
      ({ board_name }) => board_name === board,
    );

    if (existingBoard) {
      const updatedBoards = prevBoards.map((b) =>
        b.board_name === board
          ? {
              ...b,
              subjects: b.subjects.includes(subject)
                ? b.subjects.filter((s) => s !== subject)
                : [...b.subjects, subject],
            }
          : b,
      );
      setValue("boards", updatedBoards);
    } else {
      setValue("boards", [
        ...prevBoards,
        { board_name: board, subjects: [subject] },
      ]);
    }
  };

  const setFields = (fieldName, option, type) => {
    const prevFields = watch("fields");

    const existingBoard = prevFields.find(
      (item) => item.fieldName === fieldName,
    );

    if (existingBoard) {
      const updatedFields = prevFields.map((f) =>
        f.fieldName === fieldName
          ? {
              ...f,
              options:
                type === "radio"
                  ? [option]
                  : f.options.includes(option)
                    ? f.options.filter((s) => s !== option)
                    : [...f.options, option],
            }
          : f,
      );
      setValue("fields", updatedFields);
    } else {
      setValue("fields", [
        ...prevFields,
        { fieldName: fieldName, options: [option] },
      ]);
    }
  };
  if (isLoading) return <Spinner />;

  return (
    <Section className={"p-8"}>
      <div className="mx-auto max-w-xl rounded border p-6">
        <div className="space-y-4 divide-y">
          {data?.is_boards && (
            <div>
              <div className="text-sm font-medium">
                Which {data?.name} boards do you teach?
              </div>
              <div className="space-y-1">
                {boardNames.map((option) => (
                  <div key={option} className="text-sm text-gray-700">
                    <Label className="flex items-center justify-between">
                      <span className="font-normal uppercase">{option}</span>
                      <Input
                        type="checkbox"
                        value={option}
                        {...register("selected_boards")}
                        className="size-6 accent-primary"
                      />
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* custom fields */}
          <div className="space-y-4">
            {data.fields.map((item, ind) => (
              <div key={ind} className="mt-3 space-y-4">
                <div className="text-sm font-medium">{item.question}</div>
                <div>
                  {item.fieldType === "checkbox" && (
                    <div className="space-y-1">
                      {item.options.map((option) => (
                        <div key={option} className="text-sm text-gray-700">
                          <Label className="flex items-center justify-between">
                            <span className="font-normal capitalize">
                              {option}
                            </span>
                            <Input
                              type="checkbox"
                              {...register(
                                `selected.${item.fieldName}.options`,
                              )}
                              value={option}
                              className="size-6 accent-primary"
                              onClick={() =>
                                setFields(item.fieldName, option, "checkbox")
                              }
                            />
                          </Label>
                        </div>
                      ))}
                    </div>
                  )}
                  {item.fieldType === "radio" && (
                    <div className="space-y-1">
                      {item.options.map((option) => (
                        <div key={option} className="text-sm text-gray-700">
                          <Label className="flex items-center justify-between">
                            <span className="font-normal capitalize">
                              {option}
                            </span>
                            <Input
                              type="radio"
                              {...register(
                                `selected.${item.fieldName}.options`,
                              )}
                              value={option}
                              className="size-6 accent-primary"
                              onClick={() =>
                                setFields(item.fieldName, option, "radio")
                              }
                            />
                          </Label>
                        </div>
                      ))}
                    </div>
                  )}
                  {item.fieldType === "dropdown" && (
                    <div className="space-y-1">
                      {item.options.map((option) => (
                        <div key={option} className="text-sm text-gray-700">
                          <Label className="flex items-center justify-between">
                            <span className="capitalize">{option}</span>
                            <Input
                              type="radio"
                              value={option}
                              className="size-6 accent-primary"
                            />
                          </Label>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* board subjects */}
          <div className="space-y-4">
            {selectedBoards &&
              Array.isArray(selectedBoards) &&
              selectedBoards?.map((board, ind) => (
                <div key={ind} className="space-y-2">
                  <div className="text-sm font-medium">
                    Which subjects of {data?.name} in {board} boards do you
                    teach?
                  </div>
                  <div className="space-y-1">
                    {boards
                      .find((item) => item.board_name === board)
                      ?.subjects.map((subject) => (
                        <div key={subject} className="text-sm text-gray-700">
                          <Label className="flex items-center justify-between">
                            <span className="capitalize">{subject}</span>
                            <input
                              type="checkbox"
                              value={subject}
                              className="size-6 accent-primary"
                              {...register(`selected.${board}.subjects`)}
                              onChange={() => setBoards(board, subject)}
                            />
                          </Label>
                        </div>
                      ))}
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </Section>
  );
}
