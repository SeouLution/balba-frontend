import { useRef, useState, type DragEvent } from "react";
import { useNavigate } from "react-router";

import { ApiError } from "@/api/client";
import { Badge } from "@/components/Badge";
import { Button } from "@/components/Button";
import { FilePickerInput } from "@/components/FilePickerInput";
import { ArrowUpFromLine } from "@/components/icons";
import { useCreateSalesImport } from "@/hooks/useSalesImport";
import { cn } from "@/utils/cn";

import fileIcon from "./assets/file.svg";
import fileCheckIcon from "./assets/fileCheck.svg";
import { useOnboarding } from "./onboardingContext";
import {
  OnboardingButton,
  OnboardingError,
  OnboardingHeading,
  OnboardingScreen,
} from "./OnboardingScreen";

export function SalesUploadPage() {
  const navigate = useNavigate();
  const { store, salesUpload, setSalesUpload } = useOnboarding();
  const upload = useCreateSalesImport(store?.id ?? "");
  const input = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File>();
  const [fileError, setFileError] = useState("");
  const [dragging, setDragging] = useState(false);
  const fileName = file?.name ?? salesUpload?.fileName;

  function chooseFile(selected?: File) {
    if (!selected || upload.isPending) return;
    upload.reset();
    if (!/\.(xlsx|xls|csv)$/i.test(selected.name)) {
      setFileError(".xlsx, .xls, .csv 파일을 골라주세요.");
      return;
    }
    if (!selected.size) {
      setFileError("파일이 비어 있어요. 판매 기록이 들어 있는 파일을 골라주세요.");
      return;
    }
    setFileError("");
    setFile(selected);
  }

  function drop(event: DragEvent<HTMLButtonElement>) {
    event.preventDefault();
    setDragging(false);
    if (upload.isPending) return;
    if (event.dataTransfer.files.length > 1) {
      setFileError("판매 파일을 한 번에 하나씩 올려주세요.");
      return;
    }
    chooseFile(event.dataTransfer.files[0]);
  }

  function submit() {
    if (!store || fileError || upload.isPending) return;
    if (!file) {
      if (salesUpload) navigate("../columns");
      return;
    }
    upload.mutate(file, {
      onSuccess: ({ id }) => {
        setSalesUpload({ id, fileName: file.name });
        navigate("../columns");
      },
    });
  }

  return (
    <OnboardingScreen
      step={2}
      onBack={upload.isPending ? undefined : () => navigate("../store")}
      footer={
        <OnboardingButton disabled={!fileName || !!fileError || upload.isPending} onClick={submit}>
          {upload.isPending ? "파일 올리는 중…" : "다음"}
        </OnboardingButton>
      }
    >
      <OnboardingHeading
        title={
          <>
            POS 매출 엑셀을 <br className="md:hidden" />
            올려주세요
          </>
        }
      >
        최근 4주 이상이면 좋아요. 8주면 더 정확해요
      </OnboardingHeading>
      <FilePickerInput
        ref={input}
        accept=".xlsx,.xls,.csv"
        onFilesChange={([file]) => chooseFile(file)}
      />
      <Button
        variant="plain"
        disabled={upload.isPending}
        onClick={() => input.current?.click()}
        onDragOver={(event) => {
          event.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={drop}
        aria-label={fileName ? `파일 다시 고르기: ${fileName}` : undefined}
        className={cn(
          "flex w-full items-center gap-3 rounded-md border p-4 text-left outline-none hover:bg-bg-hover focus-visible:ring-2 focus-visible:ring-button-primary",
          fileName ? "border-border-primary" : "border-dashed border-border-primary bg-bg-page",
          dragging && "bg-button-subtle",
        )}
      >
        <span className="grid size-11 shrink-0 place-items-center rounded-md bg-button-subtle">
          {fileName ? <img src={fileIcon} alt="" /> : <ArrowUpFromLine size={24} aria-hidden />}
        </span>
        {fileName ? (
          <>
            <span className="min-w-0 flex-1 truncate text-label-l">{fileName}</span>
            <img src={fileCheckIcon} alt="" />
          </>
        ) : (
          <span className="grid gap-1">
            <span className="text-label-l">이 기기에서 파일 고르기</span>
            <span className="text-caption text-text-gray-darker">
              .xlsx · .xls · .csv · 끌어다 놓기
            </span>
          </span>
        )}
      </Button>
      <div className="mt-4 grid gap-1 rounded-md border border-border-grey p-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-label-l">POS 컴퓨터에서 올리기</p>
          <Badge>주소 · 코드</Badge>
        </div>
        <p className="text-body-s text-text-gray-darker">
          엑셀이 POS 컴퓨터에 있다면 파일을 이 기기로 옮겨 올려주세요.
        </p>
      </div>
      {(fileError || upload.isError) && (
        <div className="mt-4">
          <OnboardingError>
            {fileError ||
              (upload.error instanceof ApiError && upload.error.status === 422
                ? "파일을 읽을 수 없어요. 파일 형식과 내용을 확인해 주세요."
                : "파일을 올리지 못했어요. 잠시 후 다시 시도해 주세요.")}
          </OnboardingError>
        </div>
      )}
    </OnboardingScreen>
  );
}
