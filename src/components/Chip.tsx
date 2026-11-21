import type { ButtonHTMLAttributes } from "react";

import { Check } from "@/components/icons";
import { cn } from "@/utils/cn";

type ChipProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  selected?: boolean;
  size?: "L" | "M";
};

export function Chip({
  selected = false,
  size = "L",
  type = "button",
  className,
  children,
  ...props
}: ChipProps) {
  return (
    <button
      type={type}
      aria-pressed={selected}
      className={cn(
        "inline-flex shrink-0 items-center justify-center gap-1.5 rounded-pill border text-label-s-b whitespace-nowrap transition-colors outline-none focus-visible:ring-4 focus-visible:ring-button-primary/20",
        size === "L" ? "h-11 px-4" : "h-10 px-3",
        selected
          ? "border-button-primary bg-button-primary text-text-white hover:border-button-primary-hover hover:bg-button-primary-hover active:border-button-primary-pressed active:bg-button-primary-pressed"
          : "border-border-grey bg-button-surface-1 text-text-black hover:border-border-primary hover:bg-bg-hover active:border-border-primary active:bg-button-subtle",
        className,
      )}
      {...props}
    >
      {selected && <Check size={16} strokeWidth={2.2} absoluteStrokeWidth aria-hidden />}
      {children}
    </button>
  );
}
