import { useState, type FormEvent } from "react";

import { Search } from "@/components/icons";
import { TextField } from "@/components/TextField";

import { OnboardingButton, OnboardingDialog } from "./OnboardingScreen";

const exampleAddresses = [
  { postcode: "04001", road: "서울 마포구 망원로 61", lot: "서울 마포구 망원동 416-2" },
  { postcode: "04002", road: "서울 마포구 망원로 74 (망원빌딩)", lot: "서울 마포구 망원동 395-8" },
  { postcode: "04004", road: "서울 마포구 망원로 96", lot: "서울 마포구 망원동 382-1" },
];

type PostcodeSearchProps = {
  onClose: () => void;
  onSelect: (postcode: string, roadAddress: string) => void;
};

export function PostcodeSearch({ onClose, onSelect }: PostcodeSearchProps) {
  const [keyword, setKeyword] = useState("");
  const [query, setQuery] = useState("");
  const [manual, setManual] = useState(false);
  const [postcode, setPostcode] = useState("");
  const [address, setAddress] = useState("");
  const results = query
    ? exampleAddresses.filter(({ postcode, road, lot }) =>
        query.split(/\s+/).every((word) => `${postcode} ${road} ${lot}`.includes(word)),
      )
    : [];

  function confirmAddress(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (/^\d{5}$/.test(postcode) && address.trim()) onSelect(postcode, address.trim());
  }

  return (
    <OnboardingDialog title="우편번호 검색" onClose={onClose} fullScreenOnMobile>
      {manual ? (
        <form onSubmit={confirmAddress} className="grid gap-4">
          <TextField
            label="우편번호"
            required
            pattern="[0-9]{5}"
            inputMode="numeric"
            maxLength={5}
            value={postcode}
            onChange={(event) => setPostcode(event.target.value)}
          />
          <TextField
            label="도로명 주소"
            required
            value={address}
            onChange={(event) => setAddress(event.target.value)}
          />
          <OnboardingButton type="submit">주소 입력</OnboardingButton>
          <button type="button" className="text-label-s underline" onClick={() => setManual(false)}>
            검색으로 돌아가기
          </button>
        </form>
      ) : (
        <>
          <form
            role="search"
            onSubmit={(event) => {
              event.preventDefault();
              setQuery(keyword.trim());
            }}
            className="grid grid-cols-[minmax(0,1fr)_auto] items-end gap-2"
          >
            <TextField
              label={<span className="sr-only">도로명 또는 지번</span>}
              placeholder="예: 망원로"
              value={keyword}
              onChange={(event) => setKeyword(event.target.value)}
              className="rounded-sm border-border-primary"
            />
            <OnboardingButton type="submit">
              <Search size={16} aria-hidden /> 검색
            </OnboardingButton>
          </form>
          <p aria-live="polite" className="mt-4 text-caption text-text-gray-darker">
            {query
              ? `예시 검색 결과 ${results.length}건`
              : "예시 주소는 ‘망원로’로 검색할 수 있어요."}
          </p>
          {results.length > 0 && (
            <ul className="mt-1 divide-y divide-border-divider">
              {results.map(({ postcode, road, lot }) => (
                <li
                  key={postcode}
                  className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2 px-2 py-4"
                >
                  <div className="grid gap-1">
                    <span className="text-caption">{postcode}</span>
                    <span className="flex items-start gap-2 text-body-m">
                      <span className="shrink-0 rounded-sm bg-button-primary px-1.5 text-caption text-text-white">
                        도로명
                      </span>
                      <span className="break-keep">{road}</span>
                    </span>
                    <span className="flex items-start gap-2 text-body-s text-text-gray-darker">
                      <span className="shrink-0 rounded-sm bg-button-subtle px-1.5 text-caption text-text-black">
                        지번
                      </span>
                      <span className="break-keep">{lot}</span>
                    </span>
                  </div>
                  <OnboardingButton
                    secondary
                    aria-label={`선택: ${road}`}
                    className="h-11! px-3 text-label-s-b whitespace-nowrap"
                    onClick={() => onSelect(postcode, road)}
                  >
                    선택
                  </OnboardingButton>
                </li>
              ))}
            </ul>
          )}
          {query && !results.length && (
            <p className="mt-3 text-body-s">일치하는 예시 주소가 없어요.</p>
          )}
          <button
            type="button"
            onClick={() => setManual(true)}
            className="mt-4 min-h-11 self-start text-caption text-text-gray-darker underline underline-offset-2"
          >
            주소 직접 입력
          </button>
        </>
      )}
    </OnboardingDialog>
  );
}
