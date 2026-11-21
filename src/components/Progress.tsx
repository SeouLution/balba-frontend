import { cn } from "@/utils/cn";

type ProgressProps = {
  value: number;
  max: number;
  className?: string;
};

/** 단계 진행 막대. 값이 바뀌면 너비가 부드럽게 늘어나요. */
export function Progress({ value, max, className }: ProgressProps) {
  const ratio = max > 0 ? Math.min(Math.max(value / max, 0), 1) : 0;

  return (
    <div
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={max}
      aria-valuenow={value}
      className={cn("h-1.5 w-full overflow-hidden bg-surface-gray-light", className)}
    >
      <div
        className="h-full rounded-r-full bg-button-primary transition-[width] duration-300 ease-out"
        style={{ width: `${ratio * 100}%` }}
      />
    </div>
  );
}
