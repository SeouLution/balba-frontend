import { useState, type ReactNode } from "react";
import { Navigate } from "react-router";

import { ApiError } from "@/api/client";
import { Button } from "@/components";
import { AppTabBar } from "@/components/AppTabBar";
import { Loading } from "@/components/Loading";
import { StoreHeader } from "@/components/StoreHeader";
import { useHome } from "@/hooks/useHome";
import { useStoreId } from "@/hooks/useStoreId";

import { DeadlineChip } from "./DeadlineChip";
import { ForecastCard } from "./ForecastCard";
import { HomeBanners } from "./HomeBanners";
import { formatMonthDayWeekday } from "./homeFormat";
import { NearbyEventsSheet } from "./NearbyEventsSheet";
import { NextOrderNotice, OrderSummaryCard, ReceiptPromptCard } from "./OrderCards";
import { WeatherRow } from "./WeatherRow";

/** 2.0-1 전날 저녁(TOMORROW) · 2.2 당일 아침(TODAY). 어느 쪽인지는 서버의 view를 따른다. */
// 로그인 · 가게 확인은 RequireStore가 먼저 한다.
export function HomePage() {
  const storeId = useStoreId();
  const homeQuery = useHome(storeId);
  const [isEventsOpen, setIsEventsOpen] = useState(false);

  if (homeQuery.isPending) return <HomeLoading />;
  if (homeQuery.isError) return <HomeError error={homeQuery.error} retry={homeQuery.refetch} />;

  const home = homeQuery.data;
  const isTomorrow = home.view === "TOMORROW";
  const targetDateLabel = formatMonthDayWeekday(home.targetDate);
  const order = home.order ?? null;
  const events = home.tiles.events ?? [];
  // TODO(api): order가 null이면 "거래처가 없음(영수증 건너뜀)"과 "오늘 주문할 곳이 없음"을 구분할 수 없다.
  //            지금은 둘 다 영수증 안내를 보여준다. 백엔드에 구분 값을 요청해야 한다.
  const needsReceipt = isTomorrow && (order === null || order.estimatedTotal === null);

  return (
    <HomeLayout storeName={home.storeName}>
      <header className="flex flex-col gap-4 desktop:grid desktop:grid-cols-[minmax(0,1fr)_auto] desktop:items-end desktop:gap-6">
        <div className="flex min-w-0 flex-col gap-4 desktop:gap-3">
          <DeadlineChip
            view={home.view}
            targetDate={home.targetDate}
            businessHours={home.businessHours}
          />
          {isTomorrow ? (
            <div className="flex flex-wrap items-baseline gap-x-3 pt-2 desktop:hidden">
              <h1 className="text-title text-button-primary">내일 영업 준비</h1>
              <span className="text-body-m text-text-gray-darker">{targetDateLabel}</span>
            </div>
          ) : (
            <h1 className="pt-2 text-title text-button-primary desktop:hidden">
              오늘 {targetDateLabel}
              <br />
              영업 전
            </h1>
          )}
          <h1 className="hidden text-title break-keep text-button-primary desktop:block xl:text-display-l">
            {isTomorrow ? `내일 ${targetDateLabel} 준비` : `오늘 ${targetDateLabel} 영업 전`}
          </h1>
        </div>

        <WeatherRow
          view={home.view}
          weather={home.tiles.weather}
          eventCount={events.length}
          onEventsClick={() => setIsEventsOpen(true)}
        />
      </header>

      <HomeBanners
        // 날짜가 바뀌면 닫은 배너 기록을 새 날짜 것으로 다시 읽는다.
        key={home.targetDate}
        storeId={storeId}
        targetDate={home.targetDate}
        banners={home.banners}
      />

      <div className="grid grid-cols-1 items-start gap-4 desktop:grid-cols-[minmax(0,1.46fr)_minmax(0,1fr)] desktop:gap-6">
        <ForecastCard storeId={storeId} home={home} />
        <div className="grid min-w-0 gap-4 desktop:gap-6">
          {needsReceipt && <ReceiptPromptCard />}
          {isTomorrow && order && (
            <OrderSummaryCard storeId={storeId} targetDate={home.targetDate} order={order} />
          )}
          {!isTomorrow && <NextOrderNotice targetDate={home.targetDate} />}
        </div>
      </div>

      {isEventsOpen && (
        <NearbyEventsSheet
          view={home.view}
          targetDate={home.targetDate}
          events={events}
          onClose={() => setIsEventsOpen(false)}
        />
      )}
    </HomeLayout>
  );
}

function HomeLoading() {
  return (
    <HomeLayout>
      <Loading>홈을 불러오고 있어요.</Loading>
    </HomeLayout>
  );
}

function HomeError({ error, retry }: { error: Error; retry: () => void }) {
  if (error instanceof ApiError && error.status === 401) return <Navigate to="/" replace />;

  return (
    <HomeLayout>
      <div className="flex flex-1 flex-col items-center justify-center gap-4 py-20">
        <p className="text-body-m text-text-gray-darker">홈을 불러오지 못했어요.</p>
        <Button variant="secondary" onClick={retry}>
          다시 불러오기
        </Button>
      </div>
    </HomeLayout>
  );
}

function HomeLayout({ storeName, children }: { storeName?: string; children: ReactNode }) {
  return (
    <div className="mx-auto flex min-h-dvh max-w-md flex-col bg-bg-page md:max-w-3xl desktop:max-w-7xl desktop:px-10 desktop:pt-10">
      <StoreHeader storeName={storeName ?? ""} className="bg-bg-page desktop:hidden" />
      <main className="flex flex-1 flex-col gap-4 px-4 pb-6 md:px-6 desktop:gap-6 desktop:px-0 desktop:pb-10">
        {children}
      </main>
      <AppTabBar />
    </div>
  );
}
