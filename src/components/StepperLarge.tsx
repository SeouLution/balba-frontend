import { cn } from "@/utils/cn";
import { Stepper, type StepperProps } from "./Stepper";

export type StepperLargeProps = StepperProps;

export function StepperLarge({ className, ...props }: StepperLargeProps) {
  return (
    <Stepper
      {...props}
      className={cn("gap-4 [&>output]:min-w-16 [&>output]:text-2xl", className)}
    />
  );
}
