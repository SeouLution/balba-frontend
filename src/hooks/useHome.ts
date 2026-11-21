import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { adjustForecast, getHome, setProduction, type ForecastItem, type Home } from "@/api/home";

import { orderPlanQueryKey } from "./useOrderPlan";

type MenuQuantityVariables = {
  menuId: string;
  quantity: number;
};

function homeQueryKey(storeId: string) {
  return ["home", storeId] as const;
}

function updateForecastItem(
  home: Home,
  menuId: string,
  update: (item: ForecastItem) => ForecastItem,
): Home {
  return {
    ...home,
    forecast: {
      ...home.forecast,
      items: home.forecast.items.map((item) => (item.menu.id === menuId ? update(item) : item)),
    },
  };
}

export function useHome(storeId: string) {
  return useQuery({
    queryKey: homeQueryKey(storeId),
    queryFn: () => getHome(storeId),
  });
}

/**
 * 2.0-1 준비량 +/−
 * 누르자마자 숫자를 바꾸고(낙관적 업데이트), 서버가 다시 계산한 메뉴 · 발주 요약으로 덮어쓴다.
 * 실패하면 누르기 전 값으로 되돌린다.
 */
export function useAdjustForecast(storeId: string, targetDate: string) {
  const queryClient = useQueryClient();
  const queryKey = homeQueryKey(storeId);

  const mutationKey = ["adjustForecast", storeId];

  return useMutation({
    mutationKey,
    // 빠르게 여러 번 눌러도 요청이 순서대로 하나씩 가도록 줄 세운다.
    scope: { id: `adjustForecast-${storeId}` },
    mutationFn: ({ menuId, quantity }: MenuQuantityVariables) =>
      adjustForecast(storeId, targetDate, menuId, quantity),
    onMutate: async ({ menuId, quantity }) => {
      await queryClient.cancelQueries({ queryKey });
      const previousHome = queryClient.getQueryData<Home>(queryKey);
      queryClient.setQueryData<Home>(queryKey, (home) =>
        home ? updateForecastItem(home, menuId, (item) => ({ ...item, planned: quantity })) : home,
      );
      return { previousHome };
    },
    onError: (_error, _variables, context) => {
      queryClient.setQueryData(queryKey, context?.previousHome);
    },
    onSuccess: (result, { menuId }) => {
      // 뒤에 줄 선 요청이 남아 있으면 중간 결과로 숫자가 되돌아가 보이지 않게 마지막 응답만 반영한다.
      if (queryClient.isMutating({ mutationKey }) > 1) return;
      queryClient.setQueryData<Home>(queryKey, (home) =>
        home
          ? { ...updateForecastItem(home, menuId, () => result.item), order: result.order }
          : home,
      );
      // 준비량이 바뀌면 거래처별 발주량도 다시 계산되므로 다시 받아온다.
      void queryClient.invalidateQueries({ queryKey: orderPlanQueryKey(storeId) });
    },
  });
}

/** 2.2 만듦 +1 */
export function useSetProduction(storeId: string, targetDate: string) {
  const queryClient = useQueryClient();
  const queryKey = homeQueryKey(storeId);

  return useMutation({
    mutationFn: ({ menuId, quantity }: MenuQuantityVariables) =>
      setProduction(storeId, targetDate, menuId, quantity),
    onMutate: async ({ menuId, quantity }) => {
      await queryClient.cancelQueries({ queryKey });
      const previousHome = queryClient.getQueryData<Home>(queryKey);
      queryClient.setQueryData<Home>(queryKey, (home) =>
        home ? updateForecastItem(home, menuId, (item) => ({ ...item, produced: quantity })) : home,
      );
      return { previousHome };
    },
    onError: (_error, _variables, context) => {
      queryClient.setQueryData(queryKey, context?.previousHome);
    },
  });
}
