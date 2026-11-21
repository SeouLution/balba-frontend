import type { OrderPlan } from "@/api/orderPlans";
import { TriangleAlert } from "@/components/icons";
import { cn } from "@/utils/cn";

import { describeEventLines, describeEventTitle } from "./orderFormat";

/** 근처 행사로 발주량을 늘렸을 때의 안내. 행사가 없으면 그리지 않는다. */
export function EventNotice({ plan, className }: { plan: OrderPlan; className?: string }) {
  const events = plan.events ?? [];
  if (events.length === 0) return null;

  return (
    <div className={cn("rounded-lg bg-bg-page px-5 py-4", className)}>
      <p className="flex items-center gap-3 text-label-l font-semibold text-button-primary">
        <TriangleAlert size={24} strokeWidth={2} aria-hidden />
        {describeEventTitle(events)}
      </p>
      <p className="mt-2 text-body-s text-text-gray-darker">{describeEventLines(plan)}</p>
    </div>
  );
}
