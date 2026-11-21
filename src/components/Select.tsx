import { useId, type ComponentPropsWithRef, type ReactNode } from "react";
import { cn } from "@/utils/cn";
import { DropdownOption } from "./DropdownOption";
import { Field } from "./Field";

export type SelectProps = Omit<ComponentPropsWithRef<"select">, "multiple" | "size"> & {
  label: ReactNode;
  placeholder?: string;
  error?: string;
  hideLabel?: boolean;
  indicatorClassName?: string;
};

export function Select({
  id,
  label,
  required,
  placeholder,
  error,
  hideLabel,
  indicatorClassName,
  className,
  children,
  defaultValue,
  value,
  "aria-describedby": describedBy,
  "aria-invalid": invalid,
  ...props
}: SelectProps) {
  const generatedId = useId();
  const fieldId = id ?? generatedId;

  return (
    <Field id={fieldId} label={label} required={required} error={error} hideLabel={hideLabel}>
      <div className="relative h-form-field">
        <select
          {...props}
          id={fieldId}
          required={required}
          value={value}
          defaultValue={
            value === undefined
              ? (defaultValue ?? (placeholder != null ? "" : undefined))
              : undefined
          }
          aria-invalid={error ? true : invalid}
          aria-describedby={
            [describedBy, error && fieldId + "-error"].filter(Boolean).join(" ") || undefined
          }
          className={cn(
            "form-select h-full w-full min-w-0 appearance-none rounded-form border border-form-border bg-form-surface py-0 pr-11 pl-4 text-base text-form-ink focus-visible:ring-3 focus-visible:ring-form-navy/30 focus-visible:outline-none disabled:bg-form-disabled disabled:text-form-muted",
            placeholder != null && "has-[option[data-placeholder]:checked]:text-form-muted",
            error && "border-form-danger bg-form-danger-soft focus-visible:ring-form-danger/30",
            className,
          )}
        >
          {placeholder != null && (
            <DropdownOption
              value=""
              disabled={required}
              data-placeholder
              className="text-form-muted"
            >
              {placeholder}
            </DropdownOption>
          )}
          {children}
        </select>
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={cn(
            "pointer-events-none absolute top-1/2 right-4 size-5 -translate-y-1/2 text-form-muted",
            indicatorClassName,
          )}
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </div>
    </Field>
  );
}
