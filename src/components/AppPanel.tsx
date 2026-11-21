import type { ReactNode } from "react";

import { cn } from "@/utils/cn";

export function AppPanel({
  children,
  wide,
  className,
}: {
  children: ReactNode;
  wide?: boolean;
  className?: string;
}) {
  return (
    <div className="md:p-6 desktop:p-10">
      <div
        className={cn(
          "mx-auto flex min-h-dvh max-w-md flex-col bg-button-surface-1 md:min-h-[calc(100dvh-3rem)] md:max-w-2xl md:rounded-lg desktop:min-h-[calc(100dvh-5rem)]",
          wide && "desktop:max-w-5xl",
          className,
        )}
      >
        {children}
      </div>
    </div>
  );
}
