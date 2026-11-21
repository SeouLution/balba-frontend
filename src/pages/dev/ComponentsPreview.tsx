import { useState } from "react";
import {
  Button,
  Checkbox,
  DropdownOption,
  IconButton,
  PrepRow,
  Select,
  Stepper,
  StepperButton,
  StepperLarge,
  TextField,
  Toggle,
} from "@/components";

export function ComponentsPreview() {
  const [buttonLabel, setButtonLabel] = useState("");
  const [stepperClicks, setStepperClicks] = useState(0);
  const [quantity, setQuantity] = useState(60);
  const [largeQuantity, setLargeQuantity] = useState(48);
  const [preparing, setPreparing] = useState(true);
  const [prepQuantity, setPrepQuantity] = useState(60);

  return (
    <main className="mx-auto grid max-w-3xl gap-8 p-4 text-form-ink sm:p-8">
      <h1 className="text-2xl font-bold">공통 컴포넌트 미리보기</h1>

      <section className="grid gap-3">
        <h2 className="font-semibold">Button · IconButton</h2>
        <div className="flex flex-wrap items-center gap-2">
          <Button onClick={() => setButtonLabel("주요 버튼")}>주요 버튼</Button>
          <Button variant="secondary" onClick={() => setButtonLabel("보조 버튼")}>
            보조 버튼
          </Button>
          <Button disabled>비활성</Button>
          <IconButton
            aria-label="추가"
            onClick={() => setButtonLabel("추가 버튼")}
            icon={
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              >
                <path d="M5 12h14 M12 5v14" />
              </svg>
            }
          />
        </div>
        <output className="text-sm text-form-muted" aria-live="polite">
          {buttonLabel && buttonLabel + "을 눌렀어요."}
        </output>
      </section>

      <section className="grid gap-3">
        <h2 className="font-semibold">Checkbox · Toggle</h2>
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
          <Checkbox label="동의합니다" />
          <Checkbox label="비활성" disabled />
          <Toggle aria-label="내일 준비" onLabel="만들어요" offLabel="쉬어요" defaultChecked />
        </div>
      </section>

      <section className="grid gap-3">
        <h2 className="font-semibold">TextField · Select · DropdownOption</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <TextField label="가게 이름" placeholder="예: 행복분식" required />
          <Select label="오픈 시간" placeholder="시간을 선택해 주세요" required>
            <DropdownOption value="09:00">09:00</DropdownOption>
            <DropdownOption value="10:00">10:00</DropdownOption>
            <DropdownOption value="11:00" disabled>
              11:00 (선택 불가)
            </DropdownOption>
          </Select>
          <TextField
            label="가게 이름 (오류)"
            placeholder="예: 행복분식"
            error="가게 이름을 입력해 주세요."
          />
          <Select label="마감 시간 (비활성)" defaultValue="21:00" disabled>
            <DropdownOption value="21:00">21:00</DropdownOption>
          </Select>
        </div>
      </section>

      <section className="grid gap-3">
        <h2 className="font-semibold">StepperButton · Stepper · StepperLarge</h2>
        <div className="flex flex-wrap items-center gap-4">
          <div className="inline-flex items-center gap-2">
            <StepperButton
              direction="increase"
              aria-label="누른 횟수 늘리기"
              onClick={() => setStepperClicks((count) => count + 1)}
            />
            <output aria-live="polite" className="text-sm text-form-muted">
              {stepperClicks}회
            </output>
          </div>
          <Stepper label="기본 수량" value={quantity} onChange={setQuantity} max={62} unit="줄" />
          <StepperLarge
            label="큰 수량"
            value={largeQuantity}
            onChange={setLargeQuantity}
            unit="줄"
          />
        </div>
      </section>

      <section className="grid gap-3">
        <h2 className="font-semibold">PrepRow</h2>
        <PrepRow
          name="김밥"
          enabled={preparing}
          onEnabledChange={setPreparing}
          quantity={{ value: prepQuantity, onChange: setPrepQuantity, unit: "줄" }}
        />
      </section>
    </main>
  );
}
