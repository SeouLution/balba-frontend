import { useState, type ReactNode } from "react";

import type { ReceiptQuestionAnswer, ReceiptScan, ReceiptSupplierGroup } from "@/api/receiptScans";
import { Button } from "@/components";
import { Badge } from "@/components/Badge";
import { useConfirmReceiptScan, useReceiptScan } from "@/hooks/useReceiptScan";

import { ReceiptHeader } from "./ReceiptHeader";

type ClassifyStepProps = {
  storeId: string;
  scanId: string;
  onBack: () => void;
  onConfirmed: () => void;
};

const VISIBLE_INGREDIENT_COUNT = 3;

/** 3.6 거래처별 자동 분류 */
export function ClassifyStep({ storeId, scanId, onBack, onConfirmed }: ClassifyStepProps) {
  const scanQuery = useReceiptScan(storeId, scanId);
  const confirmReceiptScan = useConfirmReceiptScan(storeId, scanId);
  const [answers, setAnswers] = useState<Record<string, ReceiptQuestionAnswer["answer"]>>({});

  const scan = scanQuery.data;
  const isReading = scanQuery.isPending || scan?.status === "PROCESSING";

  if (isReading) {
    return (
      <StepLayout title="영수증 읽는 중" onBack={onBack}>
        <p className="py-20 text-center text-body-m text-text-gray-darker">
          영수증을 읽고 있어요. 잠시만 기다려 주세요.
        </p>
      </StepLayout>
    );
  }

  if (scanQuery.isError || !scan) {
    return (
      <StepLayout title="영수증 분류" onBack={onBack}>
        <div className="flex flex-col items-center gap-4 py-20">
          <p className="text-body-m text-text-gray-darker">영수증 결과를 불러오지 못했어요.</p>
          <Button variant="secondary" onClick={() => scanQuery.refetch()}>
            다시 불러오기
          </Button>
        </div>
      </StepLayout>
    );
  }

  const groups = scan.groups ?? [];
  if (groups.length === 0) {
    return (
      <StepLayout title="영수증 분류" onBack={onBack}>
        <div className="flex flex-col items-center gap-4 py-20">
          <p className="text-body-m text-text-gray-darker">읽을 수 있는 영수증이 없었어요.</p>
          <Button variant="secondary" onClick={onBack}>
            다시 찍기
          </Button>
        </div>
      </StepLayout>
    );
  }

  const questions = scan.questions ?? [];
  const currentQuestion = questions.find((question) => !(question.id in answers));
  const summary = summarizeScan(scan);

  function handleSave() {
    if (scan?.status === "CONFIRMED") {
      onConfirmed();
      return;
    }
    confirmReceiptScan.mutate(
      {
        answers: Object.entries(answers).map(([questionId, answer]) => ({ questionId, answer })),
      },
      { onSuccess: onConfirmed },
    );
  }

  return (
    <StepLayout
      title={`영수증 ${summary.receiptCount}장 촬영`}
      onBack={onBack}
      footer={
        <>
          {confirmReceiptScan.isError && (
            <p className="mb-2 text-center text-caption text-danger-subtle-text">
              저장하지 못했어요. 다시 눌러 주세요.
            </p>
          )}
          <Button
            disabled={Boolean(currentQuestion) || confirmReceiptScan.isPending}
            onClick={handleSave}
            className="w-full"
          >
            {confirmReceiptScan.isPending ? "저장하는 중이에요" : "저장"}
          </Button>
        </>
      }
    >
      <section className="rounded-lg bg-ai-spark/25 px-4 py-4">
        <div className="flex items-center gap-2">
          <Badge type="ai">AI 분류</Badge>
          <p className="text-label-s-b text-text-black">
            {groups.length}곳 · {summary.receiptCount}장 · 재료 {summary.ingredientCount}개
          </p>
        </div>
        <p className="mt-1 text-caption text-text-gray-darker">
          거래처별로 나눴어요
          {summary.newIngredientCount > 0 && ` · 새 재료 ${summary.newIngredientCount}개`}
        </p>
      </section>

      <ul className="flex flex-col gap-3">
        {groups.map((group, index) => (
          <SupplierGroupCard
            key={group.supplier.id ?? `${group.supplier.name}-${index}`}
            group={group}
          />
        ))}
      </ul>

      {currentQuestion && (
        <section className="rounded-lg border border-border-primary bg-surface-white-dark px-4 py-4">
          <p className="text-label-s-b text-text-black">
            ‘{currentQuestion.rawName}’는 ‘{currentQuestion.candidate.name}’과 같은 재료인가요?
          </p>
          <div className="mt-3 grid grid-cols-2 gap-2">
            <Button
              variant="secondary"
              onClick={() => setAnswers((prev) => ({ ...prev, [currentQuestion.id]: "DIFFERENT" }))}
            >
              달라요
            </Button>
            <Button
              onClick={() => setAnswers((prev) => ({ ...prev, [currentQuestion.id]: "SAME" }))}
            >
              같아요
            </Button>
          </div>
        </section>
      )}

      {scan.removedDuplicateTexts?.map((text) => (
        <p key={text} className="text-caption text-text-gray-darker">
          {text}
        </p>
      ))}
    </StepLayout>
  );
}

function SupplierGroupCard({ group }: { group: ReceiptSupplierGroup }) {
  const purchaseDates = [...new Set(group.receipts.map((receipt) => receipt.purchasedOn))].sort();
  const ingredientNames = uniqueIngredientNames(group.receipts.flatMap((receipt) => receipt.lines));
  const hiddenIngredientCount = ingredientNames.length - VISIBLE_INGREDIENT_COUNT;

  return (
    <li className="rounded-lg border border-border-grey bg-button-surface-1 px-4 py-4">
      <div className="flex items-center gap-2">
        <p className="text-label-l text-text-black">{group.supplier.name}</p>
        {group.supplier.isNew && <Badge>새 거래처</Badge>}
        <span className="ml-auto text-label-s text-text-gray-darker">
          {group.receipts.length}장
        </span>
      </div>
      <p className="mt-1 text-caption text-text-gray">
        {purchaseDates.map(formatMonthDay).join(" · ")}
      </p>
      {ingredientNames.length > 0 && (
        <p className="mt-1 text-body-s text-text-gray-darker">
          {ingredientNames.slice(0, VISIBLE_INGREDIENT_COUNT).join(" · ")}
          {hiddenIngredientCount > 0 && ` 외 ${hiddenIngredientCount}개`}
        </p>
      )}
    </li>
  );
}

function StepLayout({
  title,
  onBack,
  footer,
  children,
}: {
  title: string;
  onBack: () => void;
  footer?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="mx-auto flex min-h-dvh max-w-md flex-col bg-button-surface-1">
      <ReceiptHeader title={title} onBack={onBack} />
      <main className="flex flex-1 flex-col gap-4 px-5 pb-6">{children}</main>
      {footer && (
        <footer className="sticky bottom-0 bg-button-surface-1 px-5 pt-2 pb-6">{footer}</footer>
      )}
    </div>
  );
}

type ReceiptLines = ReceiptSupplierGroup["receipts"][number]["lines"];

function uniqueIngredientNames(lines: ReceiptLines) {
  const names = lines.flatMap((line) => (line.ingredient?.name ? [line.ingredient.name] : []));
  return [...new Set(names)];
}

function summarizeScan(scan: ReceiptScan) {
  const groups = scan.groups ?? [];
  const lines = groups.flatMap((group) => group.receipts.flatMap((receipt) => receipt.lines));
  const newIngredientNames = lines.flatMap((line) =>
    line.ingredient?.isNew && line.ingredient.name ? [line.ingredient.name] : [],
  );

  return {
    receiptCount: groups.reduce((count, group) => count + group.receipts.length, 0),
    ingredientCount: uniqueIngredientNames(lines).length,
    newIngredientCount: new Set(newIngredientNames).size,
  };
}

// "2026-11-01" → "11/1"
function formatMonthDay(date: string) {
  const [, month, day] = date.split("-");
  return `${Number(month)}/${Number(day)}`;
}
