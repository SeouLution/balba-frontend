import type { ComponentPropsWithRef } from "react";

type FilePickerInputProps = Pick<
  ComponentPropsWithRef<"input">,
  "ref" | "accept" | "capture" | "multiple"
> & {
  onFilesChange: (files: File[]) => void;
};

export function FilePickerInput({ onFilesChange, ...props }: FilePickerInputProps) {
  return (
    <input
      {...props}
      type="file"
      hidden
      onChange={(event) => {
        const input = event.currentTarget;
        const files = Array.from(input.files ?? []);
        input.value = "";
        if (files.length) onFilesChange(files);
      }}
    />
  );
}
