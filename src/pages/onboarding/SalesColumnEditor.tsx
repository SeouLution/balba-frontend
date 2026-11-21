import { useState } from "react";

import { ApiError } from "@/api/client";
import type { ColumnMapping, ColumnMappingUpdate } from "@/api/salesImports";
import { Button } from "@/components/Button";
import { ChevronDown } from "@/components/icons";
import { InfoBox } from "@/components/InfoBox";
import { useUpdateColumnMapping } from "@/hooks/useSalesImport";

import columnInfoIcon from "./assets/columnInfo.svg";
import detectedIcon from "./assets/detected.svg";
import {
  OnboardingButton,
  OnboardingDialog,
  OnboardingError,
  OnboardingHeading,
  OnboardingScreen,
} from "./OnboardingScreen";
import { salesColumns } from "./salesColumns";

type SalesColumnEditorProps = {
  storeId: string;
  importId: string;
  detected: ColumnMapping;
  columns: string[];
  onBack: () => void;
};

export function SalesColumnEditor({
  storeId,
  importId,
  detected,
  columns,
  onBack,
}: SalesColumnEditorProps) {
  const update = useUpdateColumnMapping(storeId, importId);
  const [selected, setSelected] = useState<ColumnMappingUpdate>({});
  const [openColumn, setOpenColumn] = useState<keyof ColumnMapping | null>(null);
  const options = [...new Set(columns)].filter(Boolean);
  const missingColumns = salesColumns.filter(({ key }) => !detected[key]);
  const missingColumn = missingColumns.length === 1 ? missingColumns[0] : undefined;
  const title = missingColumn
    ? `${missingColumn.editLabel} 칸을 못 찾았어요`
    : "엑셀 칸을 확인해 주세요";
  const changes: ColumnMappingUpdate = {};
  for (const { key } of salesColumns) {
    const value = selected[key];
    if (value && value !== detected[key] && options.includes(value)) changes[key] = value;
  }
  const mapping = { ...detected, ...changes };

  return (
    <OnboardingScreen
      step={2}
      onBack={update.isPending ? undefined : onBack}
      footer={
        <OnboardingButton
          disabled={update.isPending || !Object.keys(changes).length}
          onClick={() => update.mutate(changes, { onSuccess: onBack })}
        >
          {update.isPending ? "다시 읽는 중…" : "수정하기"}
        </OnboardingButton>
      }
    >
      <OnboardingHeading title={title}>
        {missingColumn
          ? `처음 보는 형식이에요. 어느 칸이 ${missingColumn.editLabel}인지 한 번만 골라주세요`
          : "날짜, 메뉴 이름, 수량에 맞는 칸을 골라주세요."}
      </OnboardingHeading>
      <div className="grid gap-4">
        {salesColumns.map(({ key, editLabel }) => (
          <div className="grid gap-2" key={key}>
            <span id={`column-${key}`} className="text-label-s">
              {editLabel}
            </span>
            <Button
              id={`column-value-${key}`}
              variant="plain"
              aria-labelledby={`column-${key} column-value-${key}`}
              aria-haspopup="dialog"
              aria-expanded={openColumn === key}
              disabled={update.isPending}
              onClick={() => setOpenColumn(key)}
              className="flex h-13 items-center justify-between gap-2 rounded-sm border border-border-grey px-3.5 text-left text-body-s hover:bg-bg-hover focus-visible:ring-2 focus-visible:ring-button-primary disabled:bg-bg-page"
            >
              {mapping[key] ?? "칸 선택"}
              <ChevronDown size={16} aria-hidden />
            </Button>
            {mapping[key] && mapping[key] === detected[key] && (
              <span className="flex items-center gap-1.5 text-label-s text-text-positive">
                <img src={detectedIcon} alt="" />
                찾았어요
              </span>
            )}
          </div>
        ))}
        <InfoBox
          icon={<img src={columnInfoIcon} alt="" />}
          className="items-center gap-2 rounded-sm bg-button-subtle px-3 py-2.5 text-caption text-text-information"
        >
          메뉴가 몇 개 팔렸는지 적힌 칸을 골라주세요.
        </InfoBox>
      </div>
      {update.isError && (
        <OnboardingError>
          {update.error instanceof ApiError && update.error.status === 422
            ? "선택한 칸을 저장할 수 없어요. 칸을 다시 확인해 주세요."
            : "수정한 칸으로 파일을 다시 읽지 못했어요. 다시 시도해 주세요."}
        </OnboardingError>
      )}
      {openColumn && (
        <OnboardingDialog
          title={salesColumns.find(({ key }) => key === openColumn)?.editLabel ?? "칸 선택"}
          onClose={() => setOpenColumn(null)}
        >
          <div className="grid gap-2">
            {options.map((option) => (
              <Button
                key={option}
                variant="plain"
                aria-pressed={mapping[openColumn] === option}
                onClick={() => {
                  update.reset();
                  setSelected((current) => ({ ...current, [openColumn]: option }));
                  setOpenColumn(null);
                }}
                className="min-h-11 rounded-sm px-3 py-2 text-left text-label-s hover:bg-button-subtle focus-visible:ring-2 focus-visible:ring-button-primary aria-pressed:bg-button-subtle"
              >
                {option}
              </Button>
            ))}
          </div>
        </OnboardingDialog>
      )}
    </OnboardingScreen>
  );
}
