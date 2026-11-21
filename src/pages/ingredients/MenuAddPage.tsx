import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";

import { Button } from "@/components";
import { Check } from "@/components/icons";
import { useRecipes } from "@/hooks/useRecipes";
import {
  useConfirmSalesImport,
  useCreateSalesImport,
  useSalesImport,
} from "@/hooks/useSalesImport";
import { useStoreId } from "@/hooks/useStoreId";

import { ReceiptStepLayout } from "./ReceiptStepLayout";

const ANALYSIS_TIMEOUT_MS = 3 * 60_000;

/**
 * 온보딩 뒤에 생긴 메뉴 추가: 판매 엑셀 올리기 → 분석 → 확인 화면(/ingredients/menus/review).
 * 열 확인 화면은 디자인에 없어서, 서버가 판별한 열 그대로 승인한다.
 */
export function MenuAddPage() {
  const navigate = useNavigate();
  const storeId = useStoreId();
  const [importId, setImportId] = useState<string | null>(null);
  const goBack = () => navigate("/ingredients?tab=menus", { replace: true });

  return importId ? (
    <AnalyzingStep storeId={storeId} importId={importId} onBack={() => setImportId(null)} />
  ) : (
    <UploadStep storeId={storeId} onBack={goBack} onUploaded={setImportId} />
  );
}

type UploadStepProps = {
  storeId: string;
  onBack: () => void;
  onUploaded: (importId: string) => void;
};

function UploadStep({ storeId, onBack, onUploaded }: UploadStepProps) {
  const createSalesImport = useCreateSalesImport(storeId);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);

  return (
    <ReceiptStepLayout
      title="메뉴 추가"
      onBack={onBack}
      footer={
        <>
          {createSalesImport.isError && (
            <p className="mb-2 text-center text-caption text-danger-subtle-text">
              파일을 올리지 못했어요. 다시 눌러 주세요.
            </p>
          )}
          <Button
            disabled={!file || createSalesImport.isPending}
            onClick={() =>
              file && createSalesImport.mutate(file, { onSuccess: ({ id }) => onUploaded(id) })
            }
            // 공통 틀은 PC에서 아래 버튼을 오른쪽 320px로 줄이지만, 이 화면은 입력칸 폭에 맞춰 넓게 둔다.
            className="w-full md:max-w-none!"
          >
            {createSalesImport.isPending ? "올리는 중이에요" : "올리기"}
          </Button>
        </>
      }
    >
      <h2 className="pt-2 text-subtitle text-text-black">
        새 메뉴가 들어 있는
        <br />
        판매 엑셀을 올려주세요
      </h2>
      <p className="text-body-s text-text-gray-darker">
        메뉴마다 들어가는 재료와 1인분 양을 추려드려요. 이미 있는 메뉴는 그대로 둬요.
      </p>

      <input
        ref={fileInputRef}
        type="file"
        accept=".xlsx,.xls,.csv"
        className="sr-only"
        onChange={(event) => setFile(event.target.files?.[0] ?? null)}
      />
      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        className="flex min-h-28 flex-col items-center justify-center gap-1 rounded-lg border border-dashed border-border-primary px-4 text-center outline-none focus-visible:ring-4 focus-visible:ring-button-primary/20"
      >
        <span className="text-label-s-b text-text-black">{file ? file.name : "파일 선택"}</span>
        <span className="text-caption text-text-gray">.xlsx · .xls · .csv</span>
      </button>
    </ReceiptStepLayout>
  );
}

type AnalyzingStepProps = {
  storeId: string;
  importId: string;
  onBack: () => void;
};

function AnalyzingStep({ storeId, importId, onBack }: AnalyzingStepProps) {
  const navigate = useNavigate();
  const [hasTimedOut, setHasTimedOut] = useState(false);
  const importQuery = useSalesImport(storeId, importId);
  const confirmSalesImport = useConfirmSalesImport(storeId, importId);
  const status = importQuery.data?.status;
  const isApplied = status === "COMPLETED";
  // 반영이 끝나야 레시피 생성 작업이 생기므로 그 뒤에 조회를 시작한다.
  const recipesQuery = useRecipes(storeId, { enabled: isApplied });
  // 메뉴별 탭에서 받아 둔 예전 레시피가 캐시에 있으면 반영 직후 READY로 잘못 읽힌다.
  // 그래서 반영이 끝난 뒤 이 화면에서 새로 받아온 응답으로만 판단한다.
  const isRecipeReady =
    isApplied &&
    recipesQuery.isFetchedAfterMount &&
    !recipesQuery.isFetching &&
    recipesQuery.data?.generationStatus === "READY";

  const steps = [
    {
      label: "메뉴 이름 읽기",
      done: status === "NEEDS_CONFIRMATION" || status === "APPLYING" || isApplied,
    },
    { label: "메뉴별 재료 고르기", done: isApplied },
    { label: "1인분 사용량 계산하기", done: isRecipeReady },
  ];

  // 열 확인 화면 없이 서버가 판별한 열을 그대로 승인한다.
  useEffect(() => {
    if (status === "NEEDS_CONFIRMATION" && confirmSalesImport.isIdle) confirmSalesImport.mutate();
  }, [status, confirmSalesImport]);

  useEffect(() => {
    if (isRecipeReady) navigate("/ingredients/menus/review", { replace: true });
  }, [isRecipeReady, navigate]);

  useEffect(() => {
    if (isRecipeReady || hasTimedOut) return;
    const timer = setTimeout(() => setHasTimedOut(true), ANALYSIS_TIMEOUT_MS);
    return () => clearTimeout(timer);
  }, [isRecipeReady, hasTimedOut]);

  const hasError =
    importQuery.isError || recipesQuery.isError || confirmSalesImport.isError || hasTimedOut;

  return (
    <ReceiptStepLayout title="" onBack={onBack}>
      <h2 className="pt-2 text-subtitle text-text-black">
        발주바주가
        <br />
        재료를 고르고 있어요
      </h2>
      <p className="text-body-s text-text-gray-darker">
        메뉴 이름을 보고 들어가는 재료와
        <br />
        1인분 사용량을 먼저 추려 드릴게요.
        <br />다 되면 사장님이 틀린 곳만 고치면 돼요.
      </p>

      <ol className="flex flex-col gap-3 pt-2">
        {steps.map((step) => (
          <li key={step.label} className="flex items-center gap-3">
            {step.done ? (
              <span className="flex size-7 shrink-0 items-center justify-center rounded-pill bg-button-primary text-text-white">
                <Check size={16} strokeWidth={2.4} aria-hidden />
              </span>
            ) : (
              <span
                aria-hidden
                className="size-7 shrink-0 animate-spin rounded-pill border-2 border-surface-gray-light border-l-button-primary"
              />
            )}
            <span className="text-label-s-b text-text-black">{step.label}</span>
            <span className="sr-only">{step.done ? "완료" : "진행 중"}</span>
          </li>
        ))}
      </ol>

      {hasError ? (
        <div className="flex flex-col items-start gap-3 pt-4">
          <p className="text-body-s text-danger-subtle-text">
            {hasTimedOut ? "분석이 오래 걸리고 있어요." : "분석 중에 문제가 생겼어요."}
          </p>
          <Button
            variant="secondary"
            onClick={() => {
              setHasTimedOut(false);
              confirmSalesImport.reset();
              importQuery.refetch();
              if (isApplied) recipesQuery.refetch();
            }}
          >
            다시 시도하기
          </Button>
        </div>
      ) : (
        <p className="pt-4 text-caption text-text-gray">
          보통 30초 안에 끝나요.
          <br />이 화면을 닫아도 분석은 계속돼요.
        </p>
      )}
    </ReceiptStepLayout>
  );
}
