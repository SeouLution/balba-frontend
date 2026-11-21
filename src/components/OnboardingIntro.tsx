import { Badge } from "@/components/Badge";
import { Check, SparkIcon } from "@/components/icons";

const startBenefits = [
  "어제 매출과 날씨, 요일을 보고 내일 필요한 양을 계산해요",
  "품절 위험과 유통기한 임박 재료를 먼저 알려드려요.",
  "추천은 발주바주가, 최종 발주는 사장님이 확정해요.",
];

export function OnboardingIntro() {
  return (
    <div className="mt-auto min-h-0 overflow-y-auto pt-8">
      <Badge className="h-auto gap-2.5 bg-ai-spark px-3.5 py-2 text-label-s-b font-bold text-button-primary min-[1600px]:gap-3 min-[1600px]:px-4 min-[1600px]:text-subtitle">
        <SparkIcon className="size-5 shrink-0 min-[1600px]:size-6" />
        동네식당 AI 발주 도우미
      </Badge>
      <p className="mt-6 text-subtitle font-bold break-keep min-[1320px]:text-title min-[1600px]:text-display-l">
        감이 아니라 <span className="text-ai-spark">데이터</span>로
        <br />
        내일 발주를 정하세요.
      </p>
      <ul className="mt-8 grid gap-4 text-body-s break-keep min-[1600px]:text-body-l">
        {startBenefits.map((benefit) => (
          <li key={benefit} className="flex items-start gap-3">
            <Check size={18} className="mt-1 shrink-0 text-ai-spark" aria-hidden />
            <span>{benefit}</span>
          </li>
        ))}
      </ul>
      <p className="mt-8 text-label-s">
        도움이 필요하면{" "}
        <strong className="font-semibold underline underline-offset-4">고객센터</strong>
      </p>
    </div>
  );
}
