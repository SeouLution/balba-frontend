import type { ReactNode } from "react";

import { SparkIcon } from "@/components/icons";
import { cn } from "@/utils/cn";

type InfoBoxProps = {
  type?: "info" | "ai";
  className?: string;
  children: ReactNode;
};

export function InfoBox({ type = "info", className, children }: InfoBoxProps) {
  return (
    <div
      className={cn(
        "flex items-start gap-3 rounded-md bg-surface-white-dark px-4 py-3.5 text-body-s text-text-black",
        className,
      )}
    >
      {type === "ai" && (
        <span className="flex size-7 shrink-0 items-center justify-center rounded-sm bg-ai-badge-bg">
          <SparkIcon size={16} className="text-ai-spark" />
        </span>
      )}
      <p>{children}</p>
    </div>
  );
}
