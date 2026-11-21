import type { ReactNode } from "react";
import { TriangleAlert } from "@/components/icons";
import { cn } from "@/utils/cn";

type FieldProps = {
  id: string;
  label: ReactNode;
  required?: boolean;
  error?: string;
  children: ReactNode;
};

export function Field({ id, label, required, error, children }: FieldProps) {
  return (
    <div className="grid gap-2">
      <label
        htmlFor={id}
        className={cn("text-sm font-semibold", error ? "text-form-danger" : "text-form-ink")}
      >
        {label}
        {required && (
          <span aria-hidden="true" className="ml-1 text-form-danger">
            *
          </span>
        )}
      </label>
      {children}
      {error && (
        <p id={id + "-error"} className="flex items-center gap-1 text-sm text-form-danger">
          <TriangleAlert size={16} className="shrink-0" aria-hidden />
          {error}
        </p>
      )}
    </div>
  );
}
