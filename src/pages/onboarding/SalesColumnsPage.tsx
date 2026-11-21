import { useNavigate } from "react-router";

import { ApiError } from "@/api/client";
import { Loading } from "@/components/Loading";
import { useConfirmSalesImport } from "@/hooks/useSalesImport";

import detectedIcon from "./assets/detected.svg";
import missingIcon from "./assets/missing.svg";
import { useOnboarding } from "./onboardingContext";
import {
  OnboardingButton,
  OnboardingError,
  OnboardingHeading,
  OnboardingScreen,
} from "./OnboardingScreen";
import { formatSalesPeriod, salesColumns } from "./salesColumns";

export function SalesColumnsPage() {
  const navigate = useNavigate();
  const { store, salesUpload, salesImport } = useOnboarding();
  const confirm = useConfirmSalesImport(store?.id ?? "", salesUpload?.id ?? "");
  const { data, error, isError, isFetching, refetch } = salesImport;
  const goBack = () => navigate("../upload");

  if (isError) {
    return (
      <OnboardingScreen
        step={2}
        onBack={goBack}
        footer={
          <>
            <OnboardingButton disabled={isFetching} onClick={() => void refetch()}>
              {isFetching ? "다시 확인 중…" : "다시 확인"}
            </OnboardingButton>
            <OnboardingButton secondary onClick={goBack}>
              파일 다시 고르기
            </OnboardingButton>
          </>
        }
      >
        <OnboardingHeading title="엑셀 처리 상태를 확인할 수 없어요" />
        <OnboardingError>
          {error instanceof ApiError && error.status === 401
            ? "로그인이 만료됐어요. 다시 로그인해 주세요."
            : "잠시 후 다시 확인하거나 판매 파일을 다시 골라주세요."}
        </OnboardingError>
      </OnboardingScreen>
    );
  }

  if (
    !data ||
    data.status === "RECEIVED" ||
    data.status === "PARSING" ||
    data.status === "APPLYING"
  ) {
    return (
      <OnboardingScreen step={2} onBack={goBack}>
        <Loading>
          {data?.status === "APPLYING"
            ? "판매 기록을 반영하고 있어요."
            : "엑셀에서 판매 기록을 읽고 있어요."}
        </Loading>
      </OnboardingScreen>
    );
  }

  const completed = data.status === "COMPLETED";
  const mapping = data.detection?.columnMapping;
  const preview = data.detection?.preview;
  const ready = salesColumns.every(({ key }) => Boolean(mapping?.[key]));
  const menuCount = data.detection?.menuCount;
  const summary = [
    { label: "기간", value: formatSalesPeriod(data.period) },
    {
      label: "메뉴",
      value: menuCount == null ? undefined : `${menuCount.toLocaleString("ko-KR")}개`,
    },
    {
      label: "판매 기록",
      value: data.recordCount == null ? undefined : `${data.recordCount.toLocaleString("ko-KR")}건`,
    },
  ].filter(({ value }) => value !== undefined);

  // TODO(api): 원본 열 목록을 조회하고 수정한 열 매핑을 제출하는 계약이 필요하다.
  return (
    <OnboardingScreen
      step={2}
      scrollBody
      onBack={confirm.isPending ? undefined : goBack}
      footer={
        completed ? (
          <OnboardingButton onClick={() => navigate("../ingredients/loading")}>
            다음
          </OnboardingButton>
        ) : (
          <>
            {ready && (
              <OnboardingButton disabled={confirm.isPending} onClick={() => confirm.mutate()}>
                {confirm.isPending ? "확인 중…" : "맞아요, 다음"}
              </OnboardingButton>
            )}
            <OnboardingButton secondary={ready} disabled={confirm.isPending} onClick={goBack}>
              파일 다시 고르기
            </OnboardingButton>
          </>
        )
      }
    >
      <OnboardingHeading title={completed ? "판매 기록을 반영했어요" : "이렇게 읽었는데 맞나요?"}>
        {!completed &&
          (ready
            ? "판별한 열과 판매 기록을 확인해 주세요."
            : "날짜, 메뉴 이름, 판매 수량이 들어 있는 파일을 다시 올려주세요.")}
      </OnboardingHeading>
      {confirm.isError && (
        <OnboardingError>판매 기록을 확정하지 못했어요. 다시 시도해 주세요.</OnboardingError>
      )}
      {summary.length > 0 && (
        <dl className="mb-3 grid grid-cols-3 items-stretch gap-3 md:gap-4">
          {summary.map(({ label, value }) => (
            <div
              key={label}
              className="grid content-start gap-1.5 rounded-md border border-border-grey bg-bg-page p-3"
            >
              <dt className="text-small text-text-gray-darker">{label}</dt>
              <dd className="text-number wrap-anywhere text-text-black">{value}</dd>
            </div>
          ))}
        </dl>
      )}
      {mapping && (
        <dl className="divide-y divide-border-divider rounded-md border border-border-grey px-4 py-1">
          {salesColumns.map(({ key, label }) => (
            <div
              key={key}
              className="flex min-h-12 items-center justify-between gap-4 py-2 text-label-s"
            >
              <dt className="shrink-0 text-text-gray-darker">{label}</dt>
              <dd className="flex min-w-0 items-center gap-1.5 text-right text-label-s-b font-semibold">
                {mapping[key] ? (
                  <span className="wrap-anywhere text-text-black">‘{mapping[key]}’ 칸</span>
                ) : (
                  <span className="text-text-gray-light">미확인 항목</span>
                )}
                <img src={mapping[key] ? detectedIcon : missingIcon} alt="" className="shrink-0" />
              </dd>
            </div>
          ))}
        </dl>
      )}
      {preview?.length ? (
        <table className="mt-4 w-full table-fixed text-left text-body-s">
          <caption className="pb-2 text-left text-label-s">판매 기록 미리보기</caption>
          <thead>
            <tr className="border-b border-border-divider text-text-gray-darker">
              <th scope="col" className="w-28 py-2">
                날짜
              </th>
              <th scope="col" className="py-2">
                메뉴 이름
              </th>
              <th scope="col" className="w-12 py-2 text-right">
                수량
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-divider">
            {preview.map(({ date, menuName, quantity }, index) => (
              <tr key={index}>
                <td className="py-2">{date ?? "—"}</td>
                <td className="py-2 wrap-anywhere">{menuName ?? "—"}</td>
                <td className="py-2 text-right wrap-anywhere">{quantity ?? "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : null}
    </OnboardingScreen>
  );
}
