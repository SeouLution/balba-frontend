import { useOutletContext } from "react-router";

import type { StoreCategory } from "@/api/stores";
import type { useSalesImport } from "@/hooks/useSalesImport";

import { initialHours, type HoursDraft } from "./businessHours";
import type { RecipeIngredient, RecipeUnit } from "./onboardingTypes";

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

type SavedStore = { id: string; name?: string };
type SalesUpload = { id: string; fileName: string };

export type OnboardingContext = {
  draft: StoreDraft;
  updateDraft: (changes: Partial<StoreDraft>) => void;
  store: SavedStore | null;
  setStore: (store: SavedStore) => void;
  salesUpload: SalesUpload | null;
  setSalesUpload: (upload: SalesUpload | null) => void;
  salesImport: ReturnType<typeof useSalesImport>;
  salesConfirmed: boolean;
  ingredientIds: string[] | null;
  setIngredientIds: (ids: string[]) => void;
  receiptPhotoCount: number;
  addReceiptPhotos: (count: number) => void;
  recipeAmounts: Record<string, number>;
  updateRecipeAmount: (key: string, amount: number) => void;
  recipeUnits: Partial<Record<string, RecipeUnit>>;
  updateRecipeUnit: (key: string, unit: RecipeUnit) => void;
  editedMenuIngredients: Partial<Record<string, RecipeIngredient[]>>;
  saveMenuIngredients: (menuName: string, ingredients: RecipeIngredient[]) => void;
};

export function useOnboarding() {
  return useOutletContext<OnboardingContext>();
}
