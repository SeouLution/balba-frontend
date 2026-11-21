import { useState } from "react";

import type { DayOfWeek, Supplier } from "@/api/suppliers";
import { Button } from "@/components";
import { Badge } from "@/components/Badge";
import { Loading } from "@/components/Loading";
import { DayChip } from "@/components/DayChip";
import { InfoBox } from "@/components/InfoBox";
import { useSaveOrderDays, useSuppliers } from "@/hooks/useSuppliers";
import { cn } from "@/utils/cn";

import { ReceiptStepLayout } from "./ReceiptStepLayout";

type ScheduleStepProps = {
  storeId: string;
  onBack: () => void;
  onSaved: () => void;
};

const DAYS_OF_WEEK: { value: DayOfWeek; label: string }[] = [
  { value: "MON", label: "월" },
  { value: "TUE", label: "화" },
  { value: "WED", label: "수" },
  { value: "THU", label: "목" },
  { value: "FRI", label: "금" },
  { value: "SAT", label: "토" },
  { value: "SUN", label: "일" },
];

// 이만큼 이상이면 배지에 요일 대신 "거의 매일"로 보여준다.
const ALMOST_EVERY_DAY_COUNT = 6;

/** 3.7 거래처 주문 요일 */
export function ScheduleStep({ storeId, onBack, onSaved }: ScheduleStepProps) {
  const suppliersQuery = useSuppliers(storeId);
  const saveOrderDays = useSaveOrderDays(storeId);
  // 사장님이 고친 거래처만 담는다. 안 고친 거래처는 서버 값을 그대로 쓴다.
  const [editedOrderDays, setEditedOrderDays] = useState<Record<string, DayOfWeek[]>>({});

  if (suppliersQuery.isPending) {
    return (
      <ReceiptStepLayout title="거래처 · 주문 요일" onBack={onBack}>
        <Loading>거래처를 불러오고 있어요.</Loading>
      </ReceiptStepLayout>
    );
  }

  if (suppliersQuery.isError) {
    return (
      <ReceiptStepLayout title="거래처 · 주문 요일" onBack={onBack}>
        <div className="flex flex-col items-center gap-4 py-20">
          <p className="text-body-m text-text-gray-darker">거래처를 불러오지 못했어요.</p>
          <Button variant="secondary" onClick={() => suppliersQuery.refetch()}>
            다시 불러오기
          </Button>
        </div>
      </ReceiptStepLayout>
    );
  }

  const suppliers = suppliersQuery.data.items;
  const orderDaysOf = (supplier: Supplier) => editedOrderDays[supplier.id] ?? supplier.orderDays;
  const hasSupplierWithoutDays = suppliers.some((supplier) => orderDaysOf(supplier).length === 0);

  function toggleDay(supplier: Supplier, day: DayOfWeek) {
    const currentDays = orderDaysOf(supplier);
    const nextDays = currentDays.includes(day)
      ? currentDays.filter((currentDay) => currentDay !== day)
      : [...currentDays, day];
    setEditedOrderDays((prev) => ({ ...prev, [supplier.id]: nextDays }));
  }

  function handleSave() {
    saveOrderDays.mutate(
      {
        items: suppliers.map((supplier) => ({
          supplierId: supplier.id,
          orderDays: orderDaysOf(supplier),
        })),
      },
      { onSuccess: onSaved },
    );
  }

  return (
    <ReceiptStepLayout
      title="거래처 · 주문 요일"
      onBack={onBack}
      footer={
        <>
          {(saveOrderDays.isError || hasSupplierWithoutDays) && (
            <p className="mb-2 text-center text-caption text-danger-subtle-text">
              {saveOrderDays.isError
                ? "저장하지 못했어요. 다시 눌러 주세요."
                : "거래처마다 주문 요일을 하나 이상 골라 주세요."}
            </p>
          )}
          <Button
            disabled={
              suppliers.length === 0 ||
              hasSupplierWithoutDays ||
              // 옛 캐시를 보여주는 동안 저장하면 새 거래처가 빠진 목록이 저장된다.
              suppliersQuery.isFetching ||
              saveOrderDays.isPending
            }
            onClick={handleSave}
            className="w-full"
          >
            {saveOrderDays.isPending ? "저장하는 중이에요" : "저장"}
          </Button>
        </>
      }
    >
      <p className="text-body-s text-text-gray-darker">
        영수증 날짜로 추정했어요. 다르면 눌러서 고쳐주세요
      </p>

      {suppliers.length === 0 ? (
        <p className="py-12 text-center text-body-m text-text-gray-darker">
          아직 등록된 거래처가 없어요.
        </p>
      ) : (
        <ul className="flex flex-col gap-3">
          {suppliers.map((supplier) => {
            const isUnknown = supplier.orderDaysStatus === "UNKNOWN";
            const selectedDays = orderDaysOf(supplier);

            return (
              <li
                key={supplier.id}
                className={cn(
                  "rounded-lg border bg-button-surface-1 px-4 py-4",
                  isUnknown ? "border-border-primary" : "border-border-grey",
                )}
              >
                <div className="flex items-center gap-2">
                  <p className="text-label-l text-text-black">{supplier.name}</p>
                  <span className="ml-auto">
                    <OrderDaysBadge supplier={supplier} />
                  </span>
                </div>
                {isUnknown && (
                  <p className="mt-3 text-label-s-b text-text-black">
                    보통 무슨 요일에 주문하세요?
                  </p>
                )}
                <div className="mt-3 flex justify-between gap-1">
                  {DAYS_OF_WEEK.map((day) => (
                    <DayChip
                      key={day.value}
                      off={selectedDays.includes(day.value)}
                      aria-label={`${supplier.name} ${day.label}요일`}
                      onClick={() => toggleDay(supplier, day.value)}
                    >
                      {day.label}
                    </DayChip>
                  ))}
                </div>
              </li>
            );
          })}
        </ul>
      )}

      <InfoBox>주문하는 날 전날 밤에만 그 거래처 발주를 보여드려요</InfoBox>
    </ReceiptStepLayout>
  );
}

/** 서버가 처음 추정한 값을 보여준다. 사장님이 고쳐도 배지는 그대로다. */
function OrderDaysBadge({ supplier }: { supplier: Supplier }) {
  if (supplier.orderDaysStatus === "UNKNOWN") {
    return (
      <Badge>
        추정 중{supplier.receiptCount !== undefined && ` · 영수증 ${supplier.receiptCount}장`}
      </Badge>
    );
  }

  if (supplier.orderDaysStatus === "ESTIMATED") {
    const label =
      supplier.orderDays.length >= ALMOST_EVERY_DAY_COUNT
        ? "거의 매일"
        : DAYS_OF_WEEK.filter((day) => supplier.orderDays.includes(day.value))
            .map((day) => day.label)
            .join(" · ");
    return <Badge type="ai">{label}</Badge>;
  }

  return null;
}
