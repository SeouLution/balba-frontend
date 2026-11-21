import type { ReactNode } from "react";

import { Button } from "@/components";
import { AppTabBar } from "@/components/AppTabBar";
import { Loading } from "@/components/Loading";
import { StoreHeader } from "@/components/StoreHeader";
import { useHome } from "@/hooks/useHome";
import { useStoreId } from "@/hooks/useStoreId";

import { ForecastCard } from "./ForecastCard";
import { HomeBanners } from "./HomeBanners";
import { formatMonthDayWeekday } from "./homeFormat";
import { NextOrderNotice, OrderSummaryCard, ReceiptPromptCard } from "./OrderCards";
import { WeatherRow } from "./WeatherRow";

/** 2.0-1 전날 저녁(TOMORROW) · 2.2 당일 아침(TODAY). 어느 쪽인지는 서버의 view를 따른다. */
export function HomePage() {
  const storeId = useStoreId();
  const homeQuery = useHome(storeId);

  if (homeQuery.isPending) {
    return (
      <HomeLayout>
        <Loading>홈을 불러오고 있어요.</Loading>
      </HomeLayout>
    );
  }

  if (homeQuery.isError) {
    return (
      <HomeLayout>
        <div className="flex flex-1 flex-col items-center justify-center gap-4 py-20">
          <p className="text-body-m text-text-gray-darker">홈을 불러오지 못했어요.</p>
          <Button variant="secondary" onClick={() => homeQuery.refetch()}>
            다시 불러오기
          </Button>
        </div>
      </HomeLayout>
    );
  }

  const home = homeQuery.data;
  const isTomorrow = home.view === "TOMORROW";
  const order = home.order ?? null;
  // TODO(api): order가 null이면 "거래처가 없음(영수증 건너뜀)"과 "오늘 주문할 곳이 없음"을 구분할 수 없다.
  //            지금은 둘 다 영수증 안내를 보여준다. 백엔드에 구분 값을 요청해야 한다.
  const needsReceipt = isTomorrow && (order === null || order.estimatedTotal === null);

  return (
    <HomeLayout storeName={home.storeName}>
      {isTomorrow ? (
        <div className="flex items-baseline gap-3 pt-2">
          <h1 className="text-title text-button-primary">내일 영업 준비</h1>
          <span className="text-body-m text-text-gray-darker">
            {formatMonthDayWeekday(home.targetDate)}
          </span>
        </div>
      ) : (
        <h1 className="pt-2 text-title text-button-primary">
          오늘 {formatMonthDayWeekday(home.targetDate)}
          <br />
          영업 전
        </h1>
      )}

      {home.tiles.weather && <WeatherRow view={home.view} weather={home.tiles.weather} />}

      <HomeBanners
        // 날짜가 바뀌면 닫은 배너 기록을 새 날짜 것으로 다시 읽는다.
        key={home.targetDate}
        storeId={storeId}
        targetDate={home.targetDate}
        banners={home.banners}
      />

      <ForecastCard storeId={storeId} home={home} />

      {needsReceipt && <ReceiptPromptCard />}
      {isTomorrow && order && <OrderSummaryCard targetDate={home.targetDate} order={order} />}
      {!isTomorrow && <NextOrderNotice targetDate={home.targetDate} />}
    </HomeLayout>
  );
}

function HomeLayout({ storeName, children }: { storeName?: string; children: ReactNode }) {
  return (
    <div className="mx-auto flex min-h-dvh max-w-md flex-col bg-bg-page">
      <StoreHeader storeName={storeName ?? ""} className="bg-bg-page" />
      <main className="flex flex-1 flex-col gap-4 px-4 pb-6">{children}</main>
      <AppTabBar />
    </div>
  );
}
