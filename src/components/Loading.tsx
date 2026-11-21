import type { ReactNode } from "react";

import { cn } from "@/utils/cn";

type LoadingProps = {
  className?: string;
  children?: ReactNode;
};

/**
 * 빙글 도는 원 + 아래 안내 문구. 문구가 없으면 원만 보여줘요.
 * 부모가 세로 flex면 남은 높이를 채워서 그 가운데에 떠요.
 */
export function Loading({ className, children }: LoadingProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={cn("flex flex-1 flex-col items-center justify-center gap-4 py-20", className)}
    >
      <span
        aria-hidden="true"
        className="size-10 animate-spin rounded-pill border-4 border-surface-gray-light border-t-button-primary"
      />
      {children ? (
        <p className="text-center text-body-m text-text-gray-darker">{children}</p>
      ) : (
        <span className="sr-only">불러오는 중</span>
      )}
    </div>
  );
}
