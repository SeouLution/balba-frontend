import { useState, type FormEvent } from "react";

import { Button } from "@/components/Button";
import { LoadingSpinner } from "@/components/Loading";
import { TextField } from "@/components/TextField";
import { usePostcodeSearch } from "@/hooks/usePostcodeSearch";

import { OnboardingButton, OnboardingDialog, OnboardingError } from "./OnboardingScreen";

type PostcodeSearchProps = {
  onClose: () => void;
  onSelect: (postcode: string, roadAddress: string) => void;
};

export function PostcodeSearch({ onClose, onSelect }: PostcodeSearchProps) {
  const [manual, setManual] = useState(false);
  const [postcode, setPostcode] = useState("");
  const [address, setAddress] = useState("");

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
          <Button
            variant="plain"
            className="text-label-s underline"
            onClick={() => setManual(false)}
          >
            검색으로 돌아가기
          </Button>
        </form>
      ) : (
        <>
          <PostcodeSearchFrame onSelect={onSelect} />
          <Button
            variant="plain"
            onClick={() => setManual(true)}
            className="mt-4 min-h-11 self-start text-caption text-text-gray-darker underline underline-offset-2"
          >
            주소 직접 입력
          </Button>
        </>
      )}
    </OnboardingDialog>
  );
}

function PostcodeSearchFrame({ onSelect }: Pick<PostcodeSearchProps, "onSelect">) {
  const { container, status, selectionError } = usePostcodeSearch(onSelect);

  return (
    <>
      {status === "loading" && (
        <p role="status" className="flex items-center gap-2 text-body-s">
          <LoadingSpinner className="size-4 shrink-0 border-2 motion-reduce:animate-none" />
          주소 검색을 불러오는 중이에요.
        </p>
      )}
      {status === "error" && (
        <OnboardingError>주소 검색을 불러오지 못했어요. 주소를 직접 입력해 주세요.</OnboardingError>
      )}
      {selectionError && (
        <OnboardingError>도로명 주소를 선택하거나 직접 입력해 주세요.</OnboardingError>
      )}
      {status !== "error" && <div ref={container} className="h-[min(55dvh,420px)]" />}
    </>
  );
}
