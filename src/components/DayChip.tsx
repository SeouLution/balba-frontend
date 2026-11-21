import type { ButtonHTMLAttributes } from "react";

import { cn } from "@/utils/cn";

type DayChipProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  off?: boolean;
};

/** 요일 하나. off면 쉬는 날이에요. */
export function DayChip({ off = false, type = "button", className, ...props }: DayChipProps) {
  return (
    <button
      type={type}
      aria-pressed={off}
      className={cn(
        "inline-flex size-11 shrink-0 items-center justify-center rounded-pill border text-label-s-b transition-colors outline-none focus-visible:ring-4 focus-visible:ring-button-primary/20",
        off
          ? "border-button-primary bg-button-primary text-text-white"
          : "border-border-grey bg-button-surface-1 text-text-black hover:border-border-primary hover:bg-bg-hover",
        className,
      )}
      {...props}
    />
  );
}
