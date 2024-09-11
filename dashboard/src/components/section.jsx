import { cn } from "@/lib/utils";

export default function Section({ children, className }) {
  return (
    <div
      className={cn(
        "space-y-4 overflow-auto rounded-lg bg-white p-4",
        className,
      )}
    >
      {children}
    </div>
  );
}
