import { useOutletContext } from "react-router";

import type { useSalesImport } from "@/hooks/useSalesImport";

import { initialHours, type HoursDraft } from "./businessHours";

export type StoreDraft = {
  name: string;
  postcode: string;
  roadAddress: string;
  detailAddress: string;
  hours: HoursDraft;
};

export const initialStoreDraft: StoreDraft = {
  name: "",
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
  receiptPhotoCount: number;
  addReceiptPhotos: (count: number) => void;
};

export function useOnboarding() {
  return useOutletContext<OnboardingContext>();
}
