import type { ComponentPropsWithRef } from "react";
import { cn } from "@/utils/cn";

export type DropdownOptionProps = ComponentPropsWithRef<"option">;

export function DropdownOption({ className, ...props }: DropdownOptionProps) {
  return (
    <option
      {...props}
      className={cn(
        "min-h-form-touch items-center gap-3 rounded-lg px-3 py-2 text-base leading-6 text-form-ink checked:bg-form-navy-soft focus-visible:bg-form-navy-soft enabled:hover:bg-form-navy-soft enabled:active:bg-form-navy enabled:active:text-form-surface disabled:text-form-muted",
        className,
      )}
    />
  );
}
