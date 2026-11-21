import { useState } from "react";
import { useNavigate } from "react-router";

import { Badge } from "@/components/Badge";
import { Chip } from "@/components/Chip";
import { Loading } from "@/components/Loading";
import { TextField } from "@/components/TextField";
import { TopBar } from "@/components/TopBar";
import { useRecipes, useSaveRecipes } from "@/hooks/useRecipes";

import { useOnboarding } from "./onboardingContext";
import {
  OnboardingButton,
  OnboardingError,
  OnboardingHeading,
  OnboardingScreen,
} from "./OnboardingScreen";

export function RecipeDraftPage() {
  const navigate = useNavigate();
  const { store, receiptPhotoCount } = useOnboarding();
  const storeId = store?.id ?? "";
  const recipes = useRecipes(storeId, { enabled: Boolean(store) });
  const save = useSaveRecipes(storeId);
  const [menuId, setMenuId] = useState<string>();
  const [amounts, setAmounts] = useState<Record<string, string>>({});
  const menus = recipes.data?.items ?? [];
  const recipe = menus.find(({ menu }) => menu.id === menuId) ?? menus[0];
  const ready = !recipes.isError && recipes.data?.generationStatus === "READY";
  const hasInvalidAmount = Object.values(amounts).some(
    (amount) => amount.trim() === "" || !Number.isFinite(Number(amount)) || Number(amount) < 0,
  );

  function finish() {
    if (!ready || hasInvalidAmount || save.isPending) return;
    const items = menus.flatMap(({ menu, items }) => {
      const replacements = items.map(({ ingredient, quantity }) => ({
        ingredientId: ingredient.id,
        quantity: Number(amounts[`${menu.id}/${ingredient.id}`] ?? quantity.value),
      }));
      return replacements.some(({ quantity }, index) => quantity !== items[index].quantity.value)
        ? [{ menuId: menu.id, items: replacements }]
        : [];
    });

    if (!items.length) {
      navigate("../complete");
      return;
    }
    save.mutate({ items }, { onSuccess: () => navigate("../complete") });
  }

  return (
    <OnboardingScreen
      step={4}
      sidebarStep={5}
      receiptAttached={receiptPhotoCount > 0}
      wideCard
      scrollBody
      header={
        <TopBar
          onBack={save.isPending ? undefined : () => navigate("../receipt")}
          className="h-[72px] pr-5 pl-2 md:h-20 md:pt-5 md:pr-10 md:pb-4 md:pl-5"
          endContent={
            <Badge type="ai" className="gap-1.25 px-2.5 font-medium">
              AI 초안
            </Badge>
          }
        />
      }
      footer={
        recipes.isError ? (
          <OnboardingButton disabled={recipes.isFetching} onClick={() => void recipes.refetch()}>
            다시 확인
          </OnboardingButton>
        ) : ready ? (
          <OnboardingButton disabled={hasInvalidAmount || save.isPending} onClick={finish}>
            {save.isPending ? "저장 중…" : "저장하기"}
          </OnboardingButton>
        ) : null
      }
    >
      <OnboardingHeading className="mb-4" title="메뉴별 재료량을 미리 채워뒀어요">
        메뉴 1인분에 들어가는 양을 확인하고 필요한 곳을 고쳐 주세요.
      </OnboardingHeading>
      {recipes.isError ? (
        <OnboardingError>레시피를 불러오지 못했어요. 다시 확인해 주세요.</OnboardingError>
      ) : !ready ? (
        <Loading>레시피를 확인하고 있어요.</Loading>
      ) : recipe ? (
        <>
          <div className="mb-4 flex flex-wrap gap-2" role="group" aria-label="레시피 메뉴">
            {menus.map(({ menu }) => (
              <Chip
                key={menu.id}
                className="font-semibold"
                selected={recipe.menu.id === menu.id}
                onClick={() => setMenuId(menu.id)}
              >
                {menu.name}
              </Chip>
            ))}
          </div>
          <section
            aria-label={`${recipe.menu.name} 레시피`}
            className="rounded-md border border-button-subtle p-4"
          >
            <h2 className="text-body-s text-text-gray-darker">
              {recipe.menu.name} 1{recipe.unit}에 들어가는 양
            </h2>
            {recipe.items.length === 0 && (
              <p className="mt-2 text-body-s text-text-gray">등록된 재료가 없어요.</p>
            )}
            <ul className="divide-y divide-border-divider">
              {recipe.items.map(({ ingredient, quantity }) => {
                const key = `${recipe.menu.id}/${ingredient.id}`;
                return (
                  <li
                    key={key}
                    className="flex items-center justify-between gap-2 py-2 text-body-l"
                  >
                    <span className="min-w-0 break-keep">{ingredient.name}</span>
                    <div className="flex w-28 shrink-0 items-center gap-2">
                      <TextField
                        label={`${ingredient.name} 사용량`}
                        hideLabel
                        type="number"
                        inputMode="decimal"
                        min={0}
                        step="any"
                        disabled={save.isPending}
                        value={amounts[key] ?? quantity.value}
                        onChange={(event) => {
                          const amount = event.currentTarget.value;
                          setAmounts((current) => ({ ...current, [key]: amount }));
                        }}
                      />
                      <span>{quantity.unit}</span>
                    </div>
                  </li>
                );
              })}
            </ul>
          </section>
          {hasInvalidAmount && (
            <OnboardingError>사용량은 0 이상의 숫자로 입력해 주세요.</OnboardingError>
          )}
          {save.isError && (
            <OnboardingError>레시피를 저장하지 못했어요. 다시 시도해 주세요.</OnboardingError>
          )}
        </>
      ) : (
        <p className="text-body-s text-text-gray">확인할 메뉴가 없어요.</p>
      )}
    </OnboardingScreen>
  );
}
