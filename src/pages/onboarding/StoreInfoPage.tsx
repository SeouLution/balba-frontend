import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router";

import { ApiError } from "@/api/client";
import type { StoreCategory } from "@/api/stores";
import { Button } from "@/components/Button";
import { Chip } from "@/components/Chip";
import { ChevronRight } from "@/components/icons";
import { LoadingSpinner } from "@/components/Loading";
import { TextField } from "@/components/TextField";
import { useCreateStore } from "@/hooks/useCreateStore";

import { describeHours, toBusinessHours } from "./businessHours";
import { BusinessHoursDialog } from "./BusinessHoursDialog";
import { useOnboarding } from "./onboardingContext";
import {
  OnboardingButton,
  OnboardingError,
  OnboardingHeading,
  OnboardingScreen,
} from "./OnboardingScreen";
import { PostcodeSearch } from "./PostcodeSearch";

const categories: { value: StoreCategory; label: string }[] = [
  { value: "BUNSIK", label: "분식" },
  { value: "KOREAN_MEAL", label: "한식·백반" },
  { value: "GUKBAP", label: "국밥" },
  { value: "BANCHAN", label: "반찬" },
  { value: "BAKERY", label: "베이커리" },
  { value: "OTHER", label: "기타" },
];

export function StoreInfoPage() {
  const navigate = useNavigate();
  const { draft, updateDraft, store, setStore } = useOnboarding();
  const createStore = useCreateStore();
  const [showAddress, setShowAddress] = useState(false);
  const [showHours, setShowHours] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const nameError = submitted && !draft.name.trim() ? "가게 이름을 입력해 주세요" : undefined;
  const addressError =
    submitted && !draft.roadAddress
      ? "주소를 입력해 주세요. 동네 날씨를 가져올 때 써요"
      : undefined;

  function selectAddress(postcode: string, roadAddress: string) {
    updateDraft({ postcode, roadAddress, detailAddress: "" });
    setShowAddress(false);
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
    if (createStore.isPending || !draft.name.trim() || !draft.roadAddress) return;
    createStore.mutate(
      {
        name: draft.name.trim(),
        category: draft.category,
        // TODO(api): 상세주소를 저장할 필드가 공개 계약에 없다.
        address: { roadAddress: draft.roadAddress },
        businessHours: toBusinessHours(draft.hours),
      },
      {
        onSuccess: (savedStore) => {
          setStore(savedStore);
          navigate("../upload");
        },
      },
    );
  }

  if (store) {
    return (
      <OnboardingScreen
        step={1}
        onBack={() => navigate("/onboarding")}
        footer={<OnboardingButton onClick={() => navigate("../upload")}>다음</OnboardingButton>}
      >
        <OnboardingHeading title="가게 정보를 저장했어요">{store.name}</OnboardingHeading>
      </OnboardingScreen>
    );
  }

  return (
    <OnboardingScreen
      step={1}
      onBack={createStore.isPending ? undefined : () => navigate("/onboarding")}
      footer={
        <>
          <OnboardingButton form="store-info" type="submit" disabled={createStore.isPending}>
            {createStore.isPending && (
              <LoadingSpinner className="size-4 shrink-0 border-2 motion-reduce:animate-none" />
            )}
            {createStore.isPending ? "가게 정보 저장 중…" : "다음"}
          </OnboardingButton>
          <span role="status" className="sr-only">
            {createStore.isPending && "가게 정보 저장 중…"}
          </span>
        </>
      }
    >
      <OnboardingHeading title="가게를 알려주세요">
        주소는 그 동네 날씨와 <br className="md:hidden" />
        근처 행사를 가져오는 데만 써요
      </OnboardingHeading>
      <form
        id="store-info"
        noValidate
        onSubmit={submit}
        inert={createStore.isPending}
        className="grid gap-5"
      >
        <TextField
          label="가게 이름"
          required
          autoComplete="organization"
          error={nameError}
          value={draft.name}
          maxLength={40}
          placeholder="예: 행복분식"
          className="rounded-sm border-border-grey"
          onChange={(event) => updateDraft({ name: event.target.value })}
        />
        <div className="grid gap-2">
          <div className="grid grid-cols-[minmax(0,1fr)_auto] items-end gap-2">
            <TextField
              label="주소"
              required
              readOnly
              placeholder="우편번호"
              value={draft.postcode}
              className="rounded-sm border-border-grey bg-bg-page"
            />
            <OnboardingButton secondary onClick={() => setShowAddress(true)}>
              {draft.roadAddress ? "다시 검색" : "주소 검색"}
            </OnboardingButton>
          </div>
          <TextField
            label="도로명 주소"
            hideLabel
            error={addressError}
            readOnly
            value={draft.roadAddress}
            placeholder="주소 검색을 눌러 가게 주소를 찾아주세요"
            className="rounded-sm border-border-grey bg-bg-page px-3.5 text-body-s placeholder:text-text-gray"
          />
        </div>
        {draft.roadAddress && (
          <TextField
            label="상세주소"
            placeholder="상세 주소를 입력해 주세요."
            autoComplete="address-line2"
            value={draft.detailAddress}
            className="rounded-sm border-border-grey"
            onChange={(event) => updateDraft({ detailAddress: event.target.value })}
          />
        )}
        <fieldset>
          <legend className="mb-2 text-label-s">업종</legend>
          <div className="flex flex-wrap gap-2">
            {categories.map(({ value, label }) => (
              <Chip
                key={value}
                selected={draft.category === value}
                onClick={() => updateDraft({ category: value })}
              >
                {label}
              </Chip>
            ))}
          </div>
        </fieldset>
        <div className="grid gap-1.5">
          <span id="hours-label" className="text-label-s">
            영업 시간 · 쉬는 날
          </span>
          <Button
            variant="plain"
            aria-labelledby="hours-label hours-edit"
            onClick={() => setShowHours(true)}
            className="flex min-h-[50px] items-center justify-between gap-2 rounded-sm border border-border-grey px-3.5 py-2 text-left text-body-s hover:bg-bg-hover focus-visible:ring-2 focus-visible:ring-button-primary"
          >
            <span>{describeHours(draft.hours)}</span>
            <span id="hours-edit" className="flex shrink-0 items-center gap-1">
              수정 <ChevronRight size={16} aria-hidden />
            </span>
          </Button>
        </div>
        {createStore.isError && (
          <OnboardingError>
            {createStore.error instanceof ApiError && createStore.error.status === 401
              ? "로그인이 만료됐어요. 다시 로그인해 주세요."
              : "가게 정보를 저장하지 못했어요. 입력을 확인하고 다시 시도해 주세요."}
          </OnboardingError>
        )}
      </form>
      {showAddress && (
        <PostcodeSearch onClose={() => setShowAddress(false)} onSelect={selectAddress} />
      )}
      {showHours && (
        <BusinessHoursDialog
          initial={draft.hours}
          onClose={() => setShowHours(false)}
          onSave={(hours) => {
            updateDraft({ hours });
            setShowHours(false);
          }}
        />
      )}
    </OnboardingScreen>
  );
}
