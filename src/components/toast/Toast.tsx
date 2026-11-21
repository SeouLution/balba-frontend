import type { ReactNode } from "react";

import { Check } from "@/components/icons";
import { cn } from "@/utils/cn";

type ToastProps = {
  className?: string;
  children: ReactNode;
};

export function Toast({ className, children }: ToastProps) {
  return (
    <div
      className={cn(
        "flex h-12.5 items-center gap-3 rounded-lg bg-button-primary px-4 text-label-s-b text-text-white shadow-toast",
        className,
      )}
    >
      <Check
        size={20}
        strokeWidth={2.2}
        absoluteStrokeWidth
        className="shrink-0 text-ai-spark"
        aria-hidden
      />
      <span className="truncate">{children}</span>
    </div>
  );
}
