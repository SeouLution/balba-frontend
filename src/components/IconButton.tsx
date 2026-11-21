import type { ReactNode } from "react";
import { Button, type ButtonProps } from "./Button";
import { cn } from "@/utils/cn";

export type IconButtonProps = Omit<ButtonProps, "children"> & {
  icon: ReactNode;
  "aria-label": string;
};

export function IconButton({ icon, className, ...props }: IconButtonProps) {
  return (
    <Button {...props} className={cn("w-form-button shrink-0 px-0", className)}>
      <span aria-hidden="true" className="grid size-6 place-items-center">
        {icon}
      </span>
    </Button>
  );
}
