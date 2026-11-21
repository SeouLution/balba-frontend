import type { HomeBanner } from "@/api/home";
import { SparkIcon, X } from "@/components/icons";

import { useDismissedBanners } from "./useDismissedBanners";

type HomeBannersProps = {
  storeId: string;
  targetDate: string;
  banners: HomeBanner[];
};

export function HomeBanners({ storeId, targetDate, banners }: HomeBannersProps) {
  const { isDismissed, dismiss } = useDismissedBanners(storeId, targetDate);
  const visibleBanners = banners.filter((banner) => !isDismissed(banner.type));

  return visibleBanners.map((banner) => (
    <section
      key={banner.type}
      className="flex items-start gap-3 rounded-lg bg-button-primary px-4 py-4 text-text-white"
    >
      <SparkIcon size={22} className="mt-0.5 shrink-0 text-ai-spark" />
      <div className="flex-1">
        <p className="text-label-s-b">{banner.title}</p>
        {banner.message && (
          <p className="mt-0.5 text-body-s text-text-white/90">{banner.message}</p>
        )}
      </div>
      <button
        type="button"
        aria-label="안내 닫기"
        onClick={() => dismiss(banner.type)}
        className="flex size-8 shrink-0 items-center justify-center rounded-sm outline-none focus-visible:ring-4 focus-visible:ring-text-white/30"
      >
        <X size={20} strokeWidth={2.2} absoluteStrokeWidth aria-hidden />
      </button>
    </section>
  ));
}
