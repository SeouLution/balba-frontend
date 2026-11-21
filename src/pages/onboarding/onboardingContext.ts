import { useOutletContext } from "react-router";

import { initialHours, type HoursDraft } from "./businessHours";
import type { ColumnMapping, StoreCategory } from "./onboardingTypes";

export type StoreDraft = {
  name: string;
  category: StoreCategory;
  postcode: string;
  roadAddress: string;
  detailAddress: string;
  hours: HoursDraft;
};

export const initialStoreDraft: StoreDraft = {
  name: "",
  category: "BUNSIK",
  postcode: "",
  roadAddress: "",
  detailAddress: "",
  hours: initialHours,
};

export type OnboardingContext = {
  draft: StoreDraft;
  updateDraft: (changes: Partial<StoreDraft>) => void;
  fileName: string;
  selectFile: (name: string) => void;
  mapping: ColumnMapping;
  setMapping: (mapping: ColumnMapping) => void;
  salesConfirmed: boolean;
  setSalesConfirmed: (confirmed: boolean) => void;
  ingredientIds: string[] | null;
  setIngredientIds: (ids: string[]) => void;
  recipeAmounts: Record<string, number>;
  updateRecipeAmount: (key: string, amount: number) => void;
};

export function useOnboarding() {
  return useOutletContext<OnboardingContext>();
}
