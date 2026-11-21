import { useEffect, useState } from "react";
import { Navigate, Outlet, useLocation, useMatch } from "react-router";

import { useSalesImport } from "@/hooks/useSalesImport";

import { initialStoreDraft, useOnboarding, type OnboardingContext } from "./onboardingContext";

export function OnboardingLayout() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  const [draft, setDraft] = useState(initialStoreDraft);
  const [store, setStore] = useState<OnboardingContext["store"]>(null);
  const [salesUpload, setSalesUpload] = useState<OnboardingContext["salesUpload"]>(null);
  const isColumnsPage = Boolean(useMatch("/onboarding/columns"));
  const isCompletePage = Boolean(useMatch("/onboarding/complete"));
  const salesImport = useSalesImport(
    store?.id ?? "",
    salesUpload?.id ?? null,
    isColumnsPage || Boolean(isCompletePage && salesUpload),
  );
  const [receiptPhotoCount, setReceiptPhotoCount] = useState(0);
  const context: OnboardingContext = {
    draft,
    updateDraft: (changes) => setDraft((current) => ({ ...current, ...changes })),
    store,
    setStore,
    salesUpload,
    setSalesUpload: (upload) => {
      setSalesUpload(upload);
    },
    salesImport,
    salesConfirmed: salesImport.data?.status === "COMPLETED",
    receiptPhotoCount,
    addReceiptPhotos: (count) => setReceiptPhotoCount((current) => current + count),
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
