import type { ComponentPropsWithRef } from "react";
import { cn } from "@/utils/cn";

export type ButtonProps = ComponentPropsWithRef<"button"> & {
  variant?: "primary" | "secondary";
};

export function Button({ type = "button", variant = "primary", className, ...props }: ButtonProps) {
  return (
    <button
      {...props}
      type={type}
      className={cn(
        "inline-flex h-form-button items-center justify-center gap-2 rounded-form border px-5 font-semibold focus-visible:ring-3 focus-visible:ring-form-navy/30 focus-visible:outline-none enabled:hover:shadow-md disabled:cursor-not-allowed disabled:border-form-border disabled:bg-form-disabled disabled:text-form-muted",
        variant === "primary"
          ? "border-transparent bg-form-navy text-form-surface enabled:hover:bg-form-navy-hover enabled:active:bg-form-navy-pressed"
          : "border-form-navy bg-form-surface text-form-navy enabled:hover:border-form-navy-hover enabled:hover:bg-form-navy-hover enabled:hover:text-form-surface enabled:active:border-form-navy-pressed enabled:active:bg-form-navy-pressed enabled:active:text-form-surface",
        className,
      )}
    />
  );
}
