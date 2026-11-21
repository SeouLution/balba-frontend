import type { ComponentPropsWithRef, ReactNode } from "react";
import { cn } from "@/utils/cn";

export type CheckboxProps = Omit<ComponentPropsWithRef<"input">, "type" | "className"> & {
  label: ReactNode;
  className?: string;
};

export function Checkbox({ label, className, ...props }: CheckboxProps) {
  return (
    <label
      className={cn(
        "inline-flex min-h-form-touch cursor-pointer items-center gap-2 text-form-ink has-disabled:cursor-not-allowed has-disabled:text-form-muted",
        className,
      )}
    >
      <span className="relative grid size-6 shrink-0 place-items-center">
        <input
          {...props}
          type="checkbox"
          className="peer size-full appearance-none rounded-md border border-form-border bg-form-surface checked:border-form-navy checked:bg-form-navy focus-visible:ring-3 focus-visible:ring-form-navy/30 focus-visible:outline-none disabled:opacity-50"
        />
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="pointer-events-none absolute size-4 text-form-surface opacity-0 peer-checked:opacity-100"
        >
          <path d="m5 12 4 4L19 6" />
        </svg>
      </span>
      <span>{label}</span>
    </label>
  );
}
