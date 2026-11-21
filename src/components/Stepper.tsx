import { cn } from "@/utils/cn";
import { StepperButton } from "./StepperButton";

export type StepperProps = {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
  disabled?: boolean;
  className?: string;
  buttonClassName?: string;
  valueClassName?: string;
};

export function Stepper({
  label,
  value,
  onChange,
  min = 0,
  max = Infinity,
  step = 1,
  unit,
  disabled,
  className,
  buttonClassName,
  valueClassName,
}: StepperProps) {
  const cannotStep =
    disabled || !Number.isFinite(value) || !Number.isFinite(step) || step <= 0 || !(min <= max);
  const decreaseValue = Math.max(min, Math.min(max, value - step));
  const increaseValue = Math.max(min, Math.min(max, value + step));

  return (
    <div
      role="group"
      aria-label={label}
      className={cn("inline-flex items-center gap-2", className)}
    >
      <StepperButton
        direction="decrease"
        className={buttonClassName}
        aria-label={label + " 줄이기"}
        disabled={cannotStep || decreaseValue >= value}
        onClick={() => onChange(decreaseValue)}
      />
      <output
        aria-live="polite"
        aria-atomic="true"
        className={cn(
          "min-w-form-touch text-center font-bold text-form-ink tabular-nums",
          valueClassName,
        )}
      >
        {value}
        {unit}
      </output>
      <StepperButton
        direction="increase"
        className={buttonClassName}
        aria-label={label + " 늘리기"}
        disabled={cannotStep || increaseValue <= value}
        onClick={() => onChange(increaseValue)}
      />
    </div>
  );
}
