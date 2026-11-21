import { useState } from "react";

import type { ForecastItem, Home } from "@/api/home";
import { Badge } from "@/components/Badge";
import { ArrowDown, ArrowUp, ChevronDown, ChevronUp } from "@/components/icons";
import { useAdjustForecast } from "@/hooks/useHome";
import { cn } from "@/utils/cn";

import { describeForecastChange, formatQuantity } from "./homeFormat";

type ForecastCardProps = {
  storeId: string;
  home: Home;
};

/** 2.0-1 오늘 미리 준비해둘 양(숫자 입력으로 수정) · 2.2 어젯밤 정한 오늘 준비량(보기만) */
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

// 홈에서 처음에 펼쳐 보여줄 메뉴 수
const VISIBLE_COUNT = 3;

function EditableForecastList({ storeId, home }: ForecastCardProps) {
  const adjustForecast = useAdjustForecast(storeId, home.targetDate);
  const { items } = home.forecast;
  // 첫 메뉴만 펼친 채로 시작한다.
  const [openMenuIds, setOpenMenuIds] = useState(
    () => new Set(items.slice(0, 1).map((item) => item.menu.id)),
  );
  const [showAll, setShowAll] = useState(false);
  // TODO(api): 홈은 상위 3개 메뉴만 준다. totalMenuCount만큼 더보려면 전체 예측 API가 필요하다.
  const hiddenCount = items.length - VISIBLE_COUNT;
  const visibleItems = showAll ? items : items.slice(0, VISIBLE_COUNT);

  function toggle(menuId: string) {
    setOpenMenuIds((prev) => {
      const next = new Set(prev);
      if (next.has(menuId)) next.delete(menuId);
      else next.add(menuId);
      return next;
    });
  }

  return (
    <>
      <ul className="mt-4 divide-y divide-border-divider border-b border-border-divider">
        {visibleItems.map((item) => {
          const isOpen = openMenuIds.has(item.menu.id);
          const panelId = `forecast-panel-${item.menu.id}`;

          return (
            <li key={item.menu.id} className="py-4">
              <button
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => toggle(item.menu.id)}
                className="flex w-full items-center gap-3 rounded-sm text-left outline-none focus-visible:ring-4 focus-visible:ring-button-primary/20"
              >
                <ForecastSummary item={item} view={home.view} />
                {isOpen ? (
                  <ChevronUp size={22} aria-hidden className="text-text-gray" />
                ) : (
                  <ChevronDown size={22} aria-hidden className="text-text-gray" />
                )}
              </button>
              {isOpen && (
                <div id={panelId} className="mt-3 flex flex-col gap-3">
                  {item.summaryText && <ReasonBox>{item.summaryText}</ReasonBox>}
                  <QuantityInput
                    // 서버 값이 바뀌면(저장 성공 · 실패 되돌림) 입력칸을 새 값으로 다시 그린다.
                    key={`${item.menu.id}-${item.planned}`}
                    item={item}
                    onCommit={(quantity) =>
                      adjustForecast.mutate({ menuId: item.menu.id, quantity })
                    }
                  />
                </div>
              )}
            </li>
          );
        })}
      </ul>
      {adjustForecast.isError && (
        <p className="pt-3 text-caption text-danger-subtle-text">
          준비량을 저장하지 못했어요. 다시 입력해 주세요.
        </p>
      )}
      {hiddenCount > 0 && (
        <button
          type="button"
          aria-expanded={showAll}
          onClick={() => setShowAll((prev) => !prev)}
          className="mt-5 flex h-14 w-full items-center justify-center gap-2 rounded-sm border border-border-grey text-label-l font-semibold text-text-black outline-none hover:bg-bg-hover focus-visible:ring-4 focus-visible:ring-button-primary/20"
        >
          {showAll ? <ChevronUp size={20} aria-hidden /> : <ChevronDown size={20} aria-hidden />}
          {showAll ? "접기" : `${hiddenCount}개 더보기`}
        </button>
      )}
    </>
  );
}

type QuantityInputProps = {
  item: ForecastItem;
  onCommit: (quantity: number) => void;
};

/**
 * 준비량 입력칸. 칠 때마다 저장하지 않고, 칸을 벗어나거나 Enter를 누르면 한 번 저장한다.
 * 0을 넣으면 그날 쉬는 메뉴가 된다.
 */
function QuantityInput({ item, onCommit }: QuantityInputProps) {
  const [draft, setDraft] = useState(String(item.planned));

  function commit() {
    if (draft === "") {
      setDraft(String(item.planned));
      return;
    }
    const quantity = Number(draft);
    if (quantity !== item.planned) onCommit(quantity);
  }

  return (
    <div className="flex gap-3">
      <input
        type="text"
        inputMode="numeric"
        aria-label={`${item.menu.name} 준비량`}
        value={draft}
        onChange={(event) => setDraft(event.target.value.replace(/[^0-9]/g, ""))}
        onBlur={commit}
        onKeyDown={(event) => {
          if (event.key === "Enter") event.currentTarget.blur();
        }}
        className="h-14 min-w-0 flex-1 rounded-sm border border-border-primary bg-button-surface-1 px-4 text-label-l text-text-black tabular-nums outline-none focus-visible:ring-4 focus-visible:ring-button-primary/20"
      />
      {/* 메뉴 단위는 서버가 정한다(항상 인분). 고를 수 없어서 글자로만 보여준다. */}
      <span className="flex h-14 w-28 shrink-0 items-center rounded-sm border border-border-grey px-4 text-label-l text-text-black">
        {item.unit}
      </span>
    </div>
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
