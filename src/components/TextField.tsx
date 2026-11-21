import { useId, type ComponentPropsWithRef, type ReactNode } from "react";
import { cn } from "@/utils/cn";
import { Field } from "./Field";

export type TextFieldProps = ComponentPropsWithRef<"input"> & {
  label: ReactNode;
  error?: string;
  endAdornment?: ReactNode;
};

export function TextField({
  id,
  label,
  required,
  error,
  endAdornment,
  className,
  "aria-describedby": describedBy,
  "aria-invalid": invalid,
  ...props
}: TextFieldProps) {
  const generatedId = useId();
  const fieldId = id ?? generatedId;
  const showInvalidStyle = Boolean(error || (invalid && invalid !== "false"));

  const input = (
    <input
      {...props}
      id={fieldId}
      required={required}
      aria-invalid={error ? true : invalid}
      aria-describedby={
        [describedBy, error && fieldId + "-error"].filter(Boolean).join(" ") || undefined
      }
      className={cn(
        "h-form-field w-full min-w-0 rounded-form border border-form-border bg-form-surface px-4 text-base text-form-ink placeholder:text-form-muted focus-visible:ring-3 focus-visible:ring-form-navy/30 focus-visible:outline-none disabled:bg-form-disabled disabled:text-form-muted",
        className,
        endAdornment && "pr-12",
        showInvalidStyle &&
          "border-form-danger bg-form-danger-soft focus-visible:ring-form-danger/30",
      )}
    />
  );

  return (
    <Field id={fieldId} label={label} required={required} error={error}>
      {endAdornment ? (
        <div className="relative">
          {input}
          {endAdornment}
        </div>
      ) : (
        input
      )}
    </Field>
  );
}
