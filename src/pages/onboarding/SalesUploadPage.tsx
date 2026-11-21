import { useRef, useState, type DragEvent } from "react";
import { useNavigate } from "react-router";

import { Badge } from "@/components/Badge";
import { ArrowUpFromLine } from "@/components/icons";
import { cn } from "@/utils/cn";

import fileIcon from "./assets/file.svg";
import fileCheckIcon from "./assets/fileCheck.svg";
import { useOnboarding } from "./onboardingContext";
import {
  OnboardingButton,
  OnboardingError,
  OnboardingHeading,
  OnboardingLink,
  OnboardingScreen,
} from "./OnboardingScreen";

export function SalesUploadPage() {
  const navigate = useNavigate();
  const { fileName, selectFile, setSalesConfirmed } = useOnboarding();
  const input = useRef<HTMLInputElement>(null);
  const [fileError, setFileError] = useState("");
  const [dragging, setDragging] = useState(false);

  function chooseFile(selected?: File) {
    if (!selected) return;
    if (!/\.(xlsx|xls|csv)$/i.test(selected.name)) {
      setFileError(".xlsx, .xls, .csv 파일을 골라주세요.");
      return;
    }
    setFileError("");
    selectFile(selected.name);
  }

  function drop(event: DragEvent<HTMLButtonElement>) {
    event.preventDefault();
    setDragging(false);
    if (event.dataTransfer.files.length > 1) {
      setFileError("판매 파일을 한 번에 하나씩 올려주세요.");
      return;
    }
    chooseFile(event.dataTransfer.files[0]);
  }

  return (
    <OnboardingScreen
      step={2}
      onBack={() => navigate("../store")}
      footer={
        <>
          <OnboardingButton
            disabled={!fileName || !!fileError}
            onClick={() => navigate("../columns")}
          >
            다음
          </OnboardingButton>
          <OnboardingLink to="../complete" onClick={() => setSalesConfirmed(false)}>
            엑셀이 없어요 · 나중에 올리기
          </OnboardingLink>
        </>
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
      <input
        ref={input}
        type="file"
        accept=".xlsx,.xls,.csv"
        className="hidden"
        onChange={(event) => {
          chooseFile(event.target.files?.[0]);
          event.target.value = "";
        }}
      />
      <button
        type="button"
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
      </button>
      <div className="mt-4 grid gap-1 rounded-md border border-border-grey p-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-label-l">POS 컴퓨터에서 올리기</p>
          <Badge>주소 · 코드</Badge>
        </div>
        <p className="text-body-s text-text-gray-darker">
          엑셀이 POS 컴퓨터에 있다면 파일을 이 기기로 옮겨 올려주세요.
        </p>
      </div>
      <button
        type="button"
        onClick={() => {
          setFileError("");
          selectFile("행복분식_매출.xlsx");
        }}
        className="mt-2 min-h-11 self-start text-caption text-text-gray-darker underline underline-offset-2"
      >
        예시 파일 선택
      </button>
      {fileError && (
        <div className="mt-4">
          <OnboardingError>{fileError}</OnboardingError>
        </div>
      )}
    </OnboardingScreen>
  );
}
