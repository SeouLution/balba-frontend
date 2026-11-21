import { useNavigate } from "react-router";

import { ChevronLeft } from "@/components/icons";
import { cn } from "@/utils/cn";

type TopBarProps = {
  step?: { current: number; total: number };
  onBack?: () => void;
  className?: string;
};

/** 뒤로 가기 + 단계 표시. onBack이 없으면 브라우저 뒤로 가기를 해요. */
export function TopBar({ step, onBack, className }: TopBarProps) {
  const navigate = useNavigate();

  return (
    <header
      className={cn(
        "flex h-20 items-center justify-between bg-button-surface-1 pr-10 pl-5",
        className,
      )}
    >
      <button
        type="button"
        aria-label="뒤로 가기"
        onClick={onBack ?? (() => navigate(-1))}
        className="flex size-11 items-center justify-center rounded-sm text-text-black outline-none focus-visible:ring-4 focus-visible:ring-button-primary/20"
      >
        <ChevronLeft size={24} strokeWidth={2.2} absoluteStrokeWidth aria-hidden />
      </button>
      {step && (
        <span className="text-label-s text-text-gray-darker">
          {step.current} / {step.total}
        </span>
      )}
    </header>
  );
}
