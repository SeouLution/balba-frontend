import { useState } from "react";

import type { ForecastItem, Home } from "@/api/home";
import { Stepper, Toggle } from "@/components";
import { Badge } from "@/components/Badge";
import { ArrowDown, ArrowUp, ChevronDown } from "@/components/icons";
import { useAdjustForecast } from "@/hooks/useHome";
import { cn } from "@/utils/cn";

import { describeForecastChange, formatQuantity } from "./homeFormat";

type ForecastCardProps = {
  storeId: string;
  home: Home;
};

/** 2.0-1 오늘 미리 준비해둘 양(± 수정) · 2.2 어젯밤 정한 오늘 준비량(보기만) */
export function ForecastCard({ storeId, home }: ForecastCardProps) {
  const isTomorrow = home.view === "TOMORROW";
  const { items, totalMenuCount } = home.forecast;

  return (
    <section className="rounded-lg border border-border-grey bg-button-surface-1 px-4 py-5">
      <div className="flex items-center justify-between">
        <Badge type="ai">AI 예측</Badge>
        <span className="text-label-s text-text-gray-darker">전체 {totalMenuCount}개</span>
      </div>
      <h2 className="mt-3 text-subtitle text-text-black">
        {isTomorrow ? "오늘 미리 준비해둘 양" : "어젯밤 정한 오늘 준비량"}
      </h2>
      <p className="mt-1 text-body-s text-text-gray-darker">
        {isTomorrow ? (
          <>
            숫자가 다르면 고쳐주세요.
            <br />
            고친 값으로 다음 예측이 더 정확해져요.
          </>
        ) : (
          "발주바주와 사장님이 어젯밤 정한 오늘의 준비량이에요."
        )}
      </p>

      {items.length === 0 ? (
        <p className="py-10 text-center text-body-m text-text-gray-darker">
          아직 예측한 메뉴가 없어요.
        </p>
      ) : isTomorrow ? (
        <EditableForecastList storeId={storeId} home={home} />
      ) : (
        <ul className="mt-4 divide-y divide-border-divider border-t border-border-divider">
          {items.map((item) => (
            <ReadOnlyForecastRow key={item.menu.id} item={item} />
          ))}
        </ul>
      )}
    </section>
  );
}

function EditableForecastList({ storeId, home }: ForecastCardProps) {
  const adjustForecast = useAdjustForecast(storeId, home.targetDate);
  // 처음에는 첫 메뉴를 펼쳐 둔다. null이면 모두 접힌 상태.
  const [expandedMenuId, setExpandedMenuId] = useState<string | null | undefined>(undefined);
  const openMenuId =
    expandedMenuId === undefined ? home.forecast.items[0]?.menu.id : expandedMenuId;

  return (
    <ul className="mt-4 divide-y divide-border-divider border-t border-border-divider">
      {home.forecast.items.map((item) => {
        const isOpen = item.menu.id === openMenuId;
        const panelId = `forecast-panel-${item.menu.id}`;

        return (
          <li key={item.menu.id} className="py-4">
            <button
              type="button"
              aria-expanded={isOpen}
              aria-controls={panelId}
              onClick={() => setExpandedMenuId(isOpen ? null : item.menu.id)}
              className="flex w-full items-center gap-3 text-left outline-none focus-visible:ring-4 focus-visible:ring-button-primary/20"
            >
              <ForecastSummary item={item} view={home.view} />
              <ChevronDown
                size={20}
                aria-hidden
                className={cn(
                  "shrink-0 text-border-primary transition-transform",
                  isOpen && "rotate-180",
                )}
              />
            </button>

            {isOpen && (
              <div id={panelId} className="mt-3 flex flex-col gap-3">
                {item.summaryText && <ReasonBox>{item.summaryText}</ReasonBox>}
                <div className="flex items-center justify-between gap-3">
                  <Stepper
                    label={`${item.menu.name} 준비량`}
                    value={item.planned}
                    unit={item.unit}
                    disabled={isResting(item)}
                    onChange={(quantity) =>
                      adjustForecast.mutate({ menuId: item.menu.id, quantity })
                    }
                  />
                  {/* 쉬는 메뉴는 준비량 0으로 저장한다. 다시 켜면 AI 추천량으로 돌린다. */}
                  <Toggle
                    aria-label={`${item.menu.name} 만들기`}
                    checked={!isResting(item)}
                    onChange={(event) =>
                      adjustForecast.mutate({
                        menuId: item.menu.id,
                        quantity: event.target.checked ? item.recommended : 0,
                      })
                    }
                    onLabel="만들어요"
                    offLabel="쉬어요"
                  />
                </div>
              </div>
            )}
          </li>
        );
      })}
      {adjustForecast.isError && (
        <li className="pt-3 text-caption text-danger-subtle-text">
          준비량을 저장하지 못했어요. 다시 눌러 주세요.
        </li>
      )}
    </ul>
  );
}

function ReadOnlyForecastRow({ item }: { item: ForecastItem }) {
  const isChangedOvernight =
    item.previousRecommended != null && item.previousRecommended !== item.recommended;

  return (
    <li className="py-4">
      <div className="flex items-center gap-3">
        <ForecastSummary item={item} view="TODAY" />
      </div>
      {/* 밤사이 바뀐 메뉴만 이유를 함께 보여준다. */}
      {isChangedOvernight && item.summaryText && (
        <ReasonBox className="mt-3">{item.summaryText}</ReasonBox>
      )}
    </li>
  );
}

function ForecastSummary({ item, view }: { item: ForecastItem; view: Home["view"] }) {
  const hint = describeForecastChange(item, view);

  return (
    <>
      <div className="flex-1">
        <p className={cn("text-label-l text-text-black", isResting(item) && "line-through")}>
          {item.menu.name}
        </p>
        {hint && (
          <p className="mt-1 flex items-center gap-1 text-caption text-text-gray-darker">
            {hint.direction === "up" && <ArrowUp size={14} strokeWidth={2.2} aria-hidden />}
            {hint.direction === "down" && <ArrowDown size={14} strokeWidth={2.2} aria-hidden />}
            {hint.text}
          </p>
        )}
      </div>
      <span className="text-number text-text-black">
        {isResting(item) ? "쉬어요" : formatQuantity(item.planned, item.unit)}
      </span>
    </>
  );
}

function ReasonBox({ className, children }: { className?: string; children: string }) {
  return (
    <p
      className={cn("rounded-md bg-bg-page px-4 py-3 text-body-s text-text-gray-darker", className)}
    >
      {children}
    </p>
  );
}

// 준비량 0 = 그날 쉬는 메뉴(따로 내려오는 값 없이 0으로 판단)
function isResting(item: ForecastItem) {
  return item.planned === 0;
}
