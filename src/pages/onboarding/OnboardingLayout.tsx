import { useEffect, useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router";

import { initialStoreDraft, useOnboarding, type OnboardingContext } from "./onboardingContext";
import type { ColumnMapping, RecipeUnit } from "./onboardingTypes";
import { exampleDetection } from "./salesColumns";

export function OnboardingLayout() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  const [draft, setDraft] = useState(initialStoreDraft);
  const [fileName, setFileName] = useState("");
  const [mapping, setMapping] = useState<ColumnMapping>(exampleDetection);
  const [salesConfirmed, setSalesConfirmed] = useState(false);
  const [ingredientIds, setIngredientIds] = useState<string[] | null>(null);
  const [receiptPhotoCount, setReceiptPhotoCount] = useState(0);
  const [recipeAmounts, setRecipeAmounts] = useState<Record<string, number>>({});
  const [recipeUnits, setRecipeUnits] = useState<OnboardingContext["recipeUnits"]>({});

  const context: OnboardingContext = {
    draft,
    updateDraft: (changes) => setDraft((current) => ({ ...current, ...changes })),
    fileName,
    selectFile: (name) => {
      setFileName(name);
      setMapping(exampleDetection);
      setSalesConfirmed(false);
      setIngredientIds(null);
      setReceiptPhotoCount(0);
      setRecipeAmounts({});
      setRecipeUnits({});
    },
    mapping,
    setMapping,
    salesConfirmed,
    setSalesConfirmed,
    ingredientIds,
    setIngredientIds,
    receiptPhotoCount,
    addReceiptPhotos: (count) => setReceiptPhotoCount((current) => current + count),
    recipeAmounts,
    updateRecipeAmount: (key, amount) =>
      setRecipeAmounts((current) => ({ ...current, [key]: amount })),
    recipeUnits,
    updateRecipeUnit: (key, unit: RecipeUnit) =>
      setRecipeUnits((current) => ({ ...current, [key]: unit })),
  };

  return <Outlet context={context} />;
}

export function OnboardingStoreRequired() {
  const context = useOnboarding();
  return context.draft.name.trim() && context.draft.roadAddress ? (
    <Outlet context={context} />
  ) : (
    <Navigate replace to="/onboarding/store" />
  );
}

export function OnboardingFileRequired() {
  const context = useOnboarding();
  return context.fileName ? (
    <Outlet context={context} />
  ) : (
    <Navigate replace to="/onboarding/upload" />
  );
}

export function OnboardingSalesConfirmed() {
  const context = useOnboarding();
  return context.salesConfirmed ? (
    <Outlet context={context} />
  ) : (
    <Navigate replace to="/onboarding/columns" />
  );
}
