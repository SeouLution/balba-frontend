import { useId, useState } from "react";

import { Eye, EyeOff } from "@/components/icons";
import { TextField, type TextFieldProps } from "@/components/TextField";

type PasswordFieldProps = Omit<TextFieldProps, "label" | "type" | "endAdornment"> & {
  label: string;
};

export function PasswordField({ id, label, disabled, ...props }: PasswordFieldProps) {
  const generatedId = useId();
  const fieldId = id ?? generatedId;
  const [visible, setVisible] = useState(false);
  const VisibilityIcon = visible ? Eye : EyeOff;

  return (
    <TextField
      {...props}
      id={fieldId}
      label={label}
      type={visible ? "text" : "password"}
      disabled={disabled}
      endAdornment={
        <button
          type="button"
          aria-controls={fieldId}
          aria-label={`${label} ${visible ? "숨기기" : "보기"}`}
          disabled={disabled}
          className="absolute inset-y-1 right-1 grid w-11 place-items-center rounded-sm text-text-gray-light hover:text-button-primary focus-visible:ring-2 focus-visible:ring-button-primary focus-visible:outline-none disabled:opacity-50"
          onClick={() => setVisible(!visible)}
        >
          <VisibilityIcon size={20} aria-hidden />
        </button>
      }
    />
  );
}
