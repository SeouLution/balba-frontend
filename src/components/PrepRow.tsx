import type { ReactNode } from "react";
import { cn } from "@/utils/cn";
import { Stepper, type StepperProps } from "./Stepper";
import { Toggle } from "./Toggle";

export type PrepRowProps = {
  name: string;
  enabled: boolean;
  onEnabledChange: (enabled: boolean) => void;
  quantity: Omit<StepperProps, "label" | "className">;
  detail?: ReactNode;
  disabled?: boolean;
  className?: string;
};

export function PrepRow({
  name,
  enabled,
  onEnabledChange,
  quantity,
  detail,
  disabled,
  className,
}: PrepRowProps) {
  return (
    <div
      className={cn(
        "flex flex-wrap items-center justify-between gap-x-4 gap-y-2 rounded-form border border-form-border bg-form-surface p-4",
        className,
      )}
    >
      <div className="min-w-0">
        <p className="font-semibold break-words text-form-ink">{name}</p>
        {detail != null && <div className="text-sm text-form-muted">{detail}</div>}
      </div>
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
        <Toggle
          aria-label={name + " 준비"}
          onLabel="만들어요"
          offLabel="쉬어요"
          checked={enabled}
          disabled={disabled}
          onChange={(event) => onEnabledChange(event.currentTarget.checked)}
        />
        <Stepper
          {...quantity}
          label={name + " 준비량"}
          disabled={disabled || !enabled || quantity.disabled}
        />
      </div>
    </div>
  );
}
