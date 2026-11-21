import type { ComponentPropsWithRef } from "react";
import { cn } from "@/utils/cn";

export type StepperButtonProps = Omit<ComponentPropsWithRef<"button">, "children"> & {
  direction: "decrease" | "increase";
};

export function StepperButton({
  direction,
  type = "button",
  className,
  "aria-label": label,
  ...props
}: StepperButtonProps) {
  return (
    <button
      {...props}
      type={type}
      aria-label={label ?? (direction === "decrease" ? "줄이기" : "늘리기")}
      className={cn(
        "grid size-form-touch shrink-0 place-items-center rounded-lg border border-form-border bg-form-surface text-form-navy focus-visible:ring-3 focus-visible:ring-form-navy/30 focus-visible:outline-none enabled:hover:bg-form-navy-soft enabled:active:bg-form-navy enabled:active:text-form-surface disabled:cursor-not-allowed disabled:bg-form-disabled disabled:text-form-muted",
        className,
      )}
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        className="size-5"
      >
        <path d={direction === "increase" ? "M5 12h14 M12 5v14" : "M5 12h14"} />
      </svg>
    </button>
  );
}
