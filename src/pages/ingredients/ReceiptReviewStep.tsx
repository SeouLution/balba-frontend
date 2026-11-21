import { useEffect, useState } from "react";

import type { ReceiptQuestionAnswer, ReceiptScan } from "@/api/receiptScans";
import { Button } from "@/components";
import { Loading } from "@/components/Loading";
import { useConfirmReceiptScan, useReceiptScan } from "@/hooks/useReceiptScan";

import { ReceiptStepLayout } from "./ReceiptStepLayout";

type ReceiptReviewStepProps = {
  storeId: string;
  scanId: string;
  onBack: () => void;
  /** 저장이 끝나면 영수증에서 읽은 재료 이름을 넘긴다(재료 탭 완료 카드용). */
  onConfirmed: (ingredientNames: string[]) => void;
};

const RECEIPT_SCAN_TIMEOUT_MS = 60_000;

/**
 * 영수증 읽기 → 저장.
 * 새 디자인은 촬영 뒤 바로 재료 탭으로 돌아가므로 분류 결과 화면은 없다.
 * 다만 API는 "같은 재료인가요?" 질문에 모두 답해야 저장되므로, 질문이 있을 때만 묻는다.
 */
export function ReceiptReviewStep({
  storeId,
  scanId,
  onBack,
  onConfirmed,
}: ReceiptReviewStepProps) {
  const [hasTimedOut, setHasTimedOut] = useState(false);
  const scanQuery = useReceiptScan(storeId, scanId, !hasTimedOut);
  const confirmReceiptScan = useConfirmReceiptScan(storeId, scanId);
  const [answers, setAnswers] = useState<Record<string, ReceiptQuestionAnswer["answer"]>>({});

  const scan = scanQuery.data;
  const isReading = scanQuery.isPending || scan?.status === "PROCESSING";
  const questions = scan?.status === "NEEDS_REVIEW" ? (scan.questions ?? []) : [];
  const currentQuestion = questions.find((question) => !(question.id in answers));
  const hasReceipts = scan?.groups?.some(({ receipts }) => receipts.length > 0);
  const canSave = scan?.status === "NEEDS_REVIEW" && hasReceipts && !currentQuestion;

  // 백엔드가 PROCESSING에 머물면 끝없이 기다리지 않도록 상한을 둔다.
  useEffect(() => {
    if (!isReading || hasTimedOut) return;
    const timer = setTimeout(() => setHasTimedOut(true), RECEIPT_SCAN_TIMEOUT_MS);
    return () => clearTimeout(timer);
  }, [isReading, hasTimedOut]);

  // 물어볼 게 없거나 다 답했으면 바로 저장하고, 이미 저장된 영수증이면 그대로 끝낸다.
  useEffect(() => {
    if (!scan || scanQuery.isFetching || scanQuery.isError) return;
    // 들어왔을 때 이미 저장된 영수증(뒤로 갔다 다시 온 경우 등)만 여기서 끝낸다.
    if (scan.status === "CONFIRMED" && confirmReceiptScan.isIdle) {
      onConfirmed(ingredientNamesOf(scan));
      return;
    }
    if (!canSave || !confirmReceiptScan.isIdle) return;
    confirmReceiptScan.mutate(
      {
        answers: Object.entries(answers).map(([questionId, answer]) => ({ questionId, answer })),
      },
      { onSuccess: () => onConfirmed(ingredientNamesOf(scan)) },
    );
  }, [
    scan,
    scanQuery.isFetching,
    scanQuery.isError,
    canSave,
    answers,
    confirmReceiptScan,
    onConfirmed,
  ]);

  // 폴링 중 재조회가 실패하면 data에는 직전 PROCESSING이 남는다. 그래서 에러를 먼저 본다.
  if (scanQuery.isError || hasTimedOut || confirmReceiptScan.isError) {
    return (
      <ReceiptStepLayout title="영수증 읽기" onBack={onBack}>
        <div className="flex flex-1 flex-col items-center justify-center gap-4 py-20">
          <p className="text-center text-body-m text-text-gray-darker">
            {hasTimedOut
              ? "영수증을 읽는 데 시간이 오래 걸리고 있어요."
              : confirmReceiptScan.isError
                ? "영수증 정보를 저장하지 못했어요."
                : "영수증 결과를 불러오지 못했어요."}
          </p>
          <Button
            variant="secondary"
            onClick={async () => {
              setHasTimedOut(false);
              await scanQuery.refetch();
              confirmReceiptScan.reset();
            }}
          >
            다시 시도하기
          </Button>
        </div>
      </ReceiptStepLayout>
    );
  }

  if (scan?.status === "NEEDS_REVIEW" && !hasReceipts) {
    return (
      <ReceiptStepLayout title="영수증 읽기" onBack={onBack}>
        <div className="flex flex-1 flex-col items-center justify-center gap-4 py-20">
          <p className="text-body-m text-text-gray-darker">읽을 수 있는 영수증이 없었어요.</p>
          <Button variant="secondary" onClick={onBack}>
            다시 찍기
          </Button>
        </div>
      </ReceiptStepLayout>
    );
  }

  if (currentQuestion) {
    return (
      <ReceiptStepLayout title="재료 확인" onBack={onBack}>
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
        <p className="text-caption text-text-gray-darker">
          {questions.length - Object.keys(answers).length}개 남았어요
        </p>
      </ReceiptStepLayout>
    );
  }

  return (
    <ReceiptStepLayout title="영수증 읽기" onBack={onBack}>
      <Loading>
        {isReading ? "영수증을 읽고 있어요." : "재료 정보를 저장하고 있어요."}
        <br />
        잠시만 기다려 주세요.
      </Loading>
    </ReceiptStepLayout>
  );
}

function ingredientNamesOf(scan: ReceiptScan) {
  const names = (scan.groups ?? []).flatMap((group) =>
    group.receipts.flatMap((receipt) =>
      receipt.lines.flatMap((line) => (line.ingredient?.name ? [line.ingredient.name] : [])),
    ),
  );
  return [...new Set(names)];
}
