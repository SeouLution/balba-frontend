import type { ReactNode } from "react";
import { useNavigate } from "react-router";

import { IconButton } from "@/components/IconButton";
import { ChevronLeft } from "@/components/icons";
import { cn } from "@/utils/cn";

type TopBarProps = {
  step?: { current: number; total: number };
  onBack?: () => void;
  className?: string;
  endContent?: ReactNode;
};

/** 뒤로 가기 + 단계 표시. onBack이 없으면 브라우저 뒤로 가기를 해요. */
export function TopBar({ step, onBack, className, endContent }: TopBarProps) {
  const navigate = useNavigate();

  return (
    <header
      className={cn(
        "flex h-20 items-center justify-between bg-button-surface-1 pr-10 pl-5",
        className,
      )}
    >
      <IconButton
        variant="plain"
        aria-label="뒤로 가기"
        onClick={onBack ?? (() => navigate(-1))}
        icon={<ChevronLeft size={24} strokeWidth={2.2} absoluteStrokeWidth />}
        className="grid h-11 w-11 place-items-center rounded-sm text-text-black focus-visible:ring-4 focus-visible:ring-button-primary/20"
      />
      {endContent ??
        (step && (
          <span className="text-label-s text-text-gray-darker">
            {step.current} / {step.total}
          </span>
        ))}
    </header>
  );
}
