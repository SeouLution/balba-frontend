import type { ReactNode } from "react";
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
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="size-4 shrink-0"
          >
            <path d="M12 3 2 21h20L12 3Z M12 9v4 M12 17h.01" />
          </svg>
          {error}
        </p>
      )}
    </div>
  );
}
