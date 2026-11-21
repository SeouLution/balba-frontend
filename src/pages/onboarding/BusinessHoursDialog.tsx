import { useState } from "react";

import { Chip } from "@/components/Chip";
import { DayChip } from "@/components/DayChip";
import { InfoBox } from "@/components/InfoBox";
import { Select } from "@/components/Select";
import { cn } from "@/utils/cn";

import {
  changeMode,
  describeHours,
  toBusinessHours,
  WEEKDAYS,
  type HoursDraft,
  type HoursMode,
  type TimeRange,
} from "./businessHours";
import { OnboardingButton, OnboardingDialog, OnboardingError } from "./OnboardingScreen";

const modes: { value: HoursMode; label: string }[] = [
  { value: "daily", label: "매일 같아요" },
  { value: "weekday", label: "평일·주말 달라요" },
  { value: "individual", label: "요일마다 달라요" },
];

const times = Array.from({ length: 48 }, (_, index) => {
  const hour = String(Math.floor(index / 2)).padStart(2, "0");
  return `${hour}:${index % 2 ? "30" : "00"}`;
});

function HoursSelect({
  label,
  value,
  disabled,
  onChange,
}: {
  label: string;
  value: string;
  disabled: boolean;
  onChange: (value: string) => void;
}) {
  return (
    <Select
      label={<span className="sr-only">{label}</span>}
      value={value}
      disabled={disabled}
      onChange={(event) => onChange(event.target.value)}
      className="h-12 rounded-sm border-border-grey bg-button-surface-1 pr-8 pl-2.5 disabled:bg-bg-page"
    >
      {times.map((time) => (
        <option key={time}>{time}</option>
      ))}
    </Select>
  );
}

function HoursRow({
  label,
  description,
  range,
  closed = false,
  onChange,
}: {
  label: string;
  description?: string;
  range: TimeRange;
  closed?: boolean;
  onChange: (range: TimeRange) => void;
}) {
  return (
    <div
      className={cn(
        "grid min-w-0 gap-2",
        label !== "매일" &&
          "grid-cols-[minmax(35px,auto)_1fr] items-center gap-2 rounded-md px-2 py-1",
      )}
    >
      <p className="text-label-s">
        {label}
        {description && (
          <span className="block text-caption text-text-gray-darker">{description}</span>
        )}
      </p>
      <div className="grid min-w-0 grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-1">
        <HoursSelect
          label={`${label} 영업 시작`}
          value={range.open}
          disabled={closed}
          onChange={(open) => onChange({ ...range, open })}
        />
        <span aria-hidden>~</span>
        <HoursSelect
          label={`${label} 영업 종료`}
          value={range.close}
          disabled={closed}
          onChange={(close) => onChange({ ...range, close })}
        />
      </div>
    </div>
  );
}

export function BusinessHoursDialog({
  initial,
  onClose,
  onSave,
}: {
  initial: HoursDraft;
  onClose: () => void;
  onSave: (hours: HoursDraft) => void;
}) {
  const [hours, setHours] = useState(initial);
  const days = toBusinessHours(hours);
  const identical = days.some(({ closed, open, close }) => !closed && open === close);

  function toggleClosed(day: (typeof WEEKDAYS)[number]["day"]) {
    setHours((current) => ({
      ...current,
      closed: current.closed.includes(day)
        ? current.closed.filter((entry) => entry !== day)
        : [...current.closed, day],
    }));
  }

  return (
    <OnboardingDialog title="영업 시간" onClose={onClose}>
      <div
        className="-mx-5 flex [scrollbar-width:none] gap-2 overflow-x-auto px-5 pb-1 md:mx-0 md:px-0"
        aria-label="영업 시간 설정 방식"
        role="group"
      >
        {modes.map(({ value, label }) => (
          <Chip
            key={value}
            selected={hours.mode === value}
            onClick={() => setHours(changeMode(hours, value))}
          >
            {label}
          </Chip>
        ))}
      </div>
      <div className="mt-3.5 grid gap-2">
        {hours.mode === "daily" && (
          <HoursRow
            label="매일"
            range={hours.daily}
            onChange={(daily) => setHours({ ...hours, daily })}
          />
        )}
        {hours.mode === "weekday" && (
          <>
            <HoursRow
              label="평일"
              description="월 ~ 금"
              range={hours.weekday}
              onChange={(weekday) => setHours({ ...hours, weekday })}
            />
            <HoursRow
              label="주말"
              description="토 · 일"
              range={hours.weekend}
              onChange={(weekend) => setHours({ ...hours, weekend })}
            />
          </>
        )}
        {hours.mode === "individual" && (
          <>
            <p className="text-caption text-text-gray-darker">
              앞에서 정한 시간으로 채워 뒀어요. 다른 날만 바꿔주세요.
            </p>
            {WEEKDAYS.map(({ day, label }) => (
              <div key={day} className="grid grid-cols-[1fr_auto] items-center gap-2">
                <HoursRow
                  label={label}
                  range={hours.individual[day]}
                  closed={hours.closed.includes(day)}
                  onChange={(range) =>
                    setHours({ ...hours, individual: { ...hours.individual, [day]: range } })
                  }
                />
                <DayChip
                  aria-label={`${label}요일 휴무`}
                  off={hours.closed.includes(day)}
                  onClick={() => toggleClosed(day)}
                >
                  {hours.closed.includes(day) ? "휴" : label}
                </DayChip>
              </div>
            ))}
          </>
        )}
      </div>
      {hours.mode !== "individual" && (
        <fieldset className="mt-3.5">
          <legend className="mb-2 text-label-s">쉬는 날</legend>
          <div className="flex flex-wrap gap-1.5">
            {WEEKDAYS.map(({ day, label }) => (
              <DayChip
                key={day}
                off={hours.closed.includes(day)}
                aria-label={`${label}요일 휴무`}
                onClick={() => toggleClosed(day)}
              >
                {label}
              </DayChip>
            ))}
          </div>
        </fieldset>
      )}
      <InfoBox className="mt-4">{describeHours(hours)}</InfoBox>
      {identical && <OnboardingError>영업 시작과 종료 시간을 다르게 선택해주세요.</OnboardingError>}
      <OnboardingButton className="mt-6 w-full" disabled={identical} onClick={() => onSave(hours)}>
        저장
      </OnboardingButton>
    </OnboardingDialog>
  );
}
