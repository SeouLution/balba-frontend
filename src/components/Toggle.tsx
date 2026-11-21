import type { ComponentPropsWithRef } from "react";
import { cn } from "@/utils/cn";

export type ToggleProps = Omit<ComponentPropsWithRef<"input">, "type" | "role" | "className"> & {
  "aria-label": string;
  onLabel?: string;
  offLabel?: string;
  className?: string;
};

export function Toggle({ onLabel, offLabel, className, ...props }: ToggleProps) {
  return (
    <label
      className={cn(
        "inline-flex min-h-form-touch cursor-pointer items-center gap-2 text-sm font-semibold text-form-ink has-disabled:cursor-not-allowed has-disabled:text-form-muted",
        className,
      )}
    >
      <input {...props} type="checkbox" role="switch" className="peer sr-only" />
      <span
        aria-hidden="true"
        className="flex h-7.5 w-13 shrink-0 items-center rounded-full bg-form-off p-1 peer-checked:bg-form-navy peer-focus-visible:ring-3 peer-focus-visible:ring-form-navy/30 peer-disabled:opacity-50 peer-checked:[&>span]:translate-x-5.5"
      >
        <span className="size-5.5 rounded-full bg-form-surface motion-safe:transition-transform" />
      </span>
      {offLabel && (
        <span aria-hidden="true" className="peer-checked:hidden">
          {offLabel}
        </span>
      )}
      {onLabel && (
        <span aria-hidden="true" className="hidden peer-checked:inline">
          {onLabel}
        </span>
      )}
    </label>
  );
}
