import { useState, type FormEvent } from "react";
import { useBlocker } from "react-router";

import type { Store } from "@/api/stores";
import { AppPanel } from "@/components/AppPanel";
import { AppTabBar } from "@/components/AppTabBar";
import { Button } from "@/components/Button";
import { ChevronRight } from "@/components/icons";
import { Loading } from "@/components/Loading";
import { TextField } from "@/components/TextField";
import { useToast } from "@/components/toast/useToast";
import { useLogOut } from "@/hooks/useLogOut";
import { useStore, useUpdateStore } from "@/hooks/useStore";
import { useStoreId } from "@/hooks/useStoreId";
import {
  describeHours,
  fromBusinessHours,
  toBusinessHours,
  type HoursDraft,
} from "@/pages/onboarding/businessHours";
import { BusinessHoursDialog } from "@/pages/onboarding/BusinessHoursDialog";
import { OnboardingButton } from "@/pages/onboarding/OnboardingScreen";
import { PostcodeSearch } from "@/pages/onboarding/PostcodeSearch";

import { LeaveConfirmSheet } from "./LeaveConfirmSheet";

type StoreDraft = {
  name: string;
  // 서버가 우편번호를 저장하지 않아 처음에는 비어 있다.
  postcode: string;
  roadAddress: string;
  hours: HoursDraft;
};

function toDraft(store: Store): StoreDraft {
  return {
    name: store.name,
    postcode: "",
    roadAddress: store.address.roadAddress,
    hours: fromBusinessHours(store.businessHours),
  };
}

// 우편번호는 저장하지 않으므로 비교에서 뺀다.
function isSameDraft(a: StoreDraft, b: StoreDraft) {
  return (
    a.name.trim() === b.name.trim() &&
    a.roadAddress === b.roadAddress &&
    JSON.stringify(toBusinessHours(a.hours)) === JSON.stringify(toBusinessHours(b.hours))
  );
}

/** 4.0 내정보 — 가게 정보 수정 · 로그아웃 */
export function MyPage() {
  const storeId = useStoreId();
  const storeQuery = useStore(storeId);

  return (
    <AppPanel>
      <header className="flex h-16 items-center px-5 md:h-20 md:px-8">
        <h1 className="text-label-l font-semibold text-button-primary md:text-subtitle">내정보</h1>
      </header>
      {storeQuery.isPending ? (
        <Loading>가게 정보를 불러오고 있어요.</Loading>
      ) : storeQuery.isError ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-4">
          <p className="text-body-m text-text-gray-darker">가게 정보를 불러오지 못했어요.</p>
          <Button variant="secondary" onClick={() => storeQuery.refetch()}>
            다시 불러오기
          </Button>
        </div>
      ) : (
        <StoreForm
          // 저장 후 서버 값으로 초안을 다시 만든다.
          key={JSON.stringify(storeQuery.data)}
          storeId={storeId}
          store={storeQuery.data}
        />
      )}
      <AppTabBar />
    </AppPanel>
  );
}

function StoreForm({ storeId, store }: { storeId: string; store: Store }) {
  const showToast = useToast();
  const updateStore = useUpdateStore(storeId);
  const logOut = useLogOut();
  const saved = toDraft(store);
  const [draft, setDraft] = useState(saved);
  const [showAddress, setShowAddress] = useState(false);
  const [showHours, setShowHours] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const isDirty = !isSameDraft(draft, saved);
  const nameError = submitted && !draft.name.trim() ? "가게 이름을 입력해 주세요" : undefined;

  // 고친 내용이 있으면 다른 탭으로 가기 전에 한 번 묻는다. 로그아웃 중에는 묻지 않는다.
  const blocker = useBlocker(
    ({ currentLocation, nextLocation }) =>
      isDirty && !logOut.isPending && currentLocation.pathname !== nextLocation.pathname,
  );

  function updateDraft(patch: Partial<StoreDraft>) {
    setDraft((prev) => ({ ...prev, ...patch }));
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
    if (!draft.name.trim() || !draft.roadAddress || updateStore.isPending) return;
    updateStore.mutate(
      {
        name: draft.name.trim(),
        // 이 화면에서는 업종을 고치지 않는다.
        category: store.category,
        address: { roadAddress: draft.roadAddress },
        businessHours: toBusinessHours(draft.hours),
      },
      {
        onSuccess: () => showToast("가게 정보를 수정했어요"),
        onError: () => showToast("가게 정보를 수정하지 못했어요. 다시 눌러 주세요."),
      },
    );
  }

  return (
    <main className="flex flex-1 flex-col px-5 pb-6 md:px-8 md:pb-8">
      <h2 className="mt-4 text-subtitle text-text-black">가게 정보</h2>
      <p className="mt-2 text-body-s text-text-gray-darker">
        주소는 그 동네 날씨와 근처 행사를 가져오는 데만 써요
      </p>

      <form noValidate onSubmit={submit} className="mt-6 grid gap-5">
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
              주소 검색
            </OnboardingButton>
          </div>
          <TextField
            label="도로명 주소"
            hideLabel
            readOnly
            value={draft.roadAddress}
            placeholder="주소 검색을 눌러 가게 주소를 찾아주세요"
            className="rounded-sm border-border-grey bg-bg-page px-3.5 text-body-s placeholder:text-text-gray"
          />
        </div>
        <div className="grid gap-1.5">
          <span id="my-hours-label" className="text-label-s">
            영업 시간 · 쉬는 날
          </span>
          <Button
            variant="plain"
            aria-labelledby="my-hours-label my-hours-edit"
            onClick={() => setShowHours(true)}
            className="flex min-h-[50px] items-center justify-between gap-2 rounded-sm border border-border-grey px-3.5 py-2 text-left text-body-s hover:bg-bg-hover focus-visible:ring-2 focus-visible:ring-button-primary"
          >
            <span>{describeHours(draft.hours)}</span>
            <span id="my-hours-edit" className="flex shrink-0 items-center gap-1">
              수정 <ChevronRight size={16} aria-hidden />
            </span>
          </Button>
        </div>
        <OnboardingButton
          type="submit"
          disabled={!isDirty || updateStore.isPending}
          className="md:w-48 md:justify-self-end"
        >
          {updateStore.isPending ? "수정하는 중…" : "수정하기"}
        </OnboardingButton>
      </form>

      {/* mt-auto로 맨 아래에 두고, 화면이 작아도 수정하기와 붙지 않게 pt로 최소 간격을 둔다. */}
      <div className="mt-auto pt-10 md:mt-0">
        <OnboardingButton
          secondary
          disabled={logOut.isPending}
          onClick={() =>
            logOut.mutate(undefined, {
              onError: () => showToast("로그아웃하지 못했어요. 다시 눌러 주세요."),
            })
          }
          className="w-full md:w-48"
        >
          {logOut.isPending ? "로그아웃하는 중…" : "로그아웃"}
        </OnboardingButton>
      </div>

      {showAddress && (
        <PostcodeSearch
          onClose={() => setShowAddress(false)}
          onSelect={(postcode, roadAddress) => {
            updateDraft({ postcode, roadAddress });
            setShowAddress(false);
          }}
        />
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
      {blocker.state === "blocked" && (
        <LeaveConfirmSheet onLeave={() => blocker.proceed()} onStay={() => blocker.reset()} />
      )}
    </main>
  );
}
