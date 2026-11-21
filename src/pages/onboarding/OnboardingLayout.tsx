import { useEffect, useState } from "react";
import { Navigate, Outlet, useLocation, useMatch } from "react-router";

import { useSalesImport } from "@/hooks/useSalesImport";

import { initialStoreDraft, useOnboarding, type OnboardingContext } from "./onboardingContext";
import type { RecipeUnit } from "./onboardingTypes";
import { withoutMenuOverrides } from "./recipeIngredients";

export function OnboardingLayout() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  const [draft, setDraft] = useState(initialStoreDraft);
  const [store, setStore] = useState<OnboardingContext["store"]>(null);
  const [salesUpload, setSalesUpload] = useState<OnboardingContext["salesUpload"]>(null);
  const isColumnsPage = Boolean(useMatch("/onboarding/columns"));
  const salesImport = useSalesImport(store?.id ?? "", salesUpload?.id ?? "", isColumnsPage);
  const [ingredientIds, setIngredientIds] = useState<string[] | null>(null);
  const [receiptPhotoCount, setReceiptPhotoCount] = useState(0);
  const [recipeAmounts, setRecipeAmounts] = useState<Record<string, number>>({});
  const [recipeUnits, setRecipeUnits] = useState<OnboardingContext["recipeUnits"]>({});
  const [editedMenuIngredients, setEditedMenuIngredients] = useState<
    OnboardingContext["editedMenuIngredients"]
  >({});

  const context: OnboardingContext = {
    draft,
    updateDraft: (changes) => setDraft((current) => ({ ...current, ...changes })),
    store,
    setStore,
    salesUpload,
    setSalesUpload: (upload) => {
      setSalesUpload(upload);
      setIngredientIds(null);
      setReceiptPhotoCount(0);
      setRecipeAmounts({});
      setRecipeUnits({});
      setEditedMenuIngredients({});
    },
    salesImport,
    salesConfirmed: salesImport.data?.status === "COMPLETED",
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
    editedMenuIngredients,
    saveMenuIngredients: (menuName, ingredients) => {
      setEditedMenuIngredients((current) => ({ ...current, [menuName]: ingredients }));
      setRecipeAmounts((current) => withoutMenuOverrides(current, menuName));
      setRecipeUnits((current) => withoutMenuOverrides(current, menuName));
    },
  };

  return <Outlet context={context} />;
}

export function OnboardingStoreRequired() {
  const context = useOnboarding();
  return context.store ? <Outlet context={context} /> : <Navigate replace to="/onboarding/store" />;
}

export function OnboardingFileRequired() {
  const context = useOnboarding();
  return context.salesUpload ? (
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
