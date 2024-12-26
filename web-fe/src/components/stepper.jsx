import { BookUser, Check, ListTodo, SquareUserRound } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Stepper({ currStep = 1, role }) {
  return (
    <div className="rounded-lg bg-white">
      <h2 className="sr-only">Steps</h2>

      {role === "student" ? (
        <div>
          <ol className="grid grid-cols-1 divide-x divide-gray-100 overflow-hidden rounded-lg border border-gray-100 text-sm text-gray-500 sm:grid-cols-2">
            <li
              className={cn(
                "relative flex items-center justify-center gap-2 p-4",
                {
                  "bg-primary text-white": currStep === 1,
                },
              )}
            >
              <span
                className={cn(
                  "absolute -right-2 top-1/2 hidden size-4 -translate-y-1/2 rotate-45 bg-white sm:block",
                  { "bg-primary": currStep === 1 },
                )}
              ></span>

              {currStep > 2 ? <Check className="text-primary" /> : <BookUser />}

              <p className="leading-none">
                <strong className="block font-medium"> Details </strong>
                <small className="mt-1">
                  {currStep > 2 ? "Completed" : "Some info about you."}
                </small>
              </p>
            </li>

            <li
              className={cn("flex items-center justify-center gap-2 p-4", {
                "bg-primary text-white": currStep === 2,
              })}
            >
              {currStep > 2 ? (
                <Check className="text-primary" />
              ) : (
                <SquareUserRound />
              )}

              <p className="leading-none">
                <strong className="block font-medium"> Identity </strong>
                <small className="mt-1"> Identity details </small>
              </p>
            </li>

            {/* <li
              className={cn("flex items-center justify-center gap-2 p-4", {
                "bg-primary text-white": currStep === 3,
              })}
            >
              {currStep > 3 ? (
                <Check className="text-primary" />
              ) : (
                <SquareUserRound />
              )}

              <p className="leading-none">
                <strong className="block font-medium"> Identity </strong>
                <small className="mt-1"> Identity details </small>
              </p>
            </li> */}
          </ol>
        </div>
      ) : (
        <div>
          <ol className="grid grid-cols-1 divide-x divide-gray-100 overflow-hidden rounded-lg border border-gray-100 text-sm text-gray-500 sm:grid-cols-3">
            <li
              className={cn("flex items-center justify-center gap-2 p-4", {
                "bg-primary text-white": currStep === 1,
              })}
            >
              {currStep > 1 ? <Check className="text-primary" /> : <BookUser />}

              <p className="leading-none">
                <strong className="block font-medium"> Details </strong>
                <small className="mt-1">
                  {currStep > 1 ? "Completed" : "Some info about you."}
                </small>
              </p>
            </li>

            <li
              className={cn(
                "relative flex items-center justify-center gap-2 p-4",
                {
                  "bg-primary text-white": currStep === 2,
                },
              )}
            >
              <span
                className={cn(
                  "absolute -left-2 top-1/2 hidden size-4 -translate-y-1/2 rotate-45 bg-white sm:block",
                  { "bg-primary": currStep === 1 },
                )}
              ></span>

              <span
                className={cn(
                  "absolute -right-2 top-1/2 hidden size-4 -translate-y-1/2 rotate-45 bg-white sm:block",
                  { "bg-primary": currStep === 2 },
                )}
              ></span>

              {currStep > 2 ? <Check className="text-primary" /> : <ListTodo />}

              <p className="leading-none">
                <strong className="block font-medium"> Experience </strong>
                <small className="mt-1">
                  {currStep > 2 ? "Completed" : "Previous experience"}
                </small>
              </p>
            </li>

            <li
              className={cn("flex items-center justify-center gap-2 p-4", {
                "bg-primary text-white": currStep === 3,
              })}
            >
              {currStep > 3 ? (
                <Check className="text-primary" />
              ) : (
                <SquareUserRound />
              )}

              <p className="leading-none">
                <strong className="block font-medium"> Identity </strong>
                <small className="mt-1"> Identity details </small>
              </p>
            </li>
          </ol>
        </div>
      )}
    </div>
  );
}
