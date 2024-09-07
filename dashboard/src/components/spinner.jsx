import { cn } from "@/lib/utils";

export default function Spinner({ color }) {
  return (
    <div className="text-center">
      <div
        className={cn(
          `inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-r-transparent fill-blue-600 align-[-0.125em] text-primary motion-reduce:animate-[spin_1.5s_linear_infinite]`,
          { color },
        )}
      />
    </div>
  );
}
