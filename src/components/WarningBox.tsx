import type { ReactNode } from "react";

import { TriangleAlert } from "@/components/icons";
import { cn } from "@/utils/cn";

type WarningBoxProps = {
  title: ReactNode;
  className?: string;
  children?: ReactNode;
};

export function WarningBox({ title, className, children }: WarningBoxProps) {
  return (
    <div
      className={cn(
        "flex items-start gap-3 rounded-md border border-danger-default bg-danger-subtle p-4 text-danger-subtle-text",
        className,
      )}
    >
      <TriangleAlert
        size={20}
        strokeWidth={2.2}
        absoluteStrokeWidth
        className="mt-px shrink-0"
        aria-hidden
      />
      <div className="flex flex-col gap-1">
        <p className="text-label-s-b">{title}</p>
        {children && <p className="text-body-s">{children}</p>}
      </div>
    </div>
  );
}
