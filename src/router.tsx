import { createBrowserRouter } from "react-router";

import App from "@/App";
import { CoreIngredientsPage } from "@/pages/onboarding/CoreIngredientsPage";
import { OnboardingCompletePage } from "@/pages/onboarding/OnboardingCompletePage";
import {
  OnboardingLayout,
  OnboardingFileRequired,
  OnboardingSalesConfirmed,
  OnboardingStoreRequired,
} from "@/pages/onboarding/OnboardingLayout";
import { OnboardingStartPage } from "@/pages/onboarding/OnboardingStartPage";
import { RecipeDraftPage } from "@/pages/onboarding/RecipeDraftPage";
import { SalesColumnsPage } from "@/pages/onboarding/SalesColumnsPage";
import { SalesUploadPage } from "@/pages/onboarding/SalesUploadPage";
import { StoreInfoPage } from "@/pages/onboarding/StoreInfoPage";

export const router = createBrowserRouter([
  { path: "/", element: <App /> },
  {
    path: "/onboarding",
    element: <OnboardingLayout />,
    children: [
      { index: true, element: <OnboardingStartPage /> },
      { path: "store", element: <StoreInfoPage /> },
      {
        element: <OnboardingStoreRequired />,
        children: [
          { path: "upload", element: <SalesUploadPage /> },
          { path: "complete", element: <OnboardingCompletePage /> },
          {
            element: <OnboardingFileRequired />,
            children: [
              { path: "columns", element: <SalesColumnsPage /> },
              {
                element: <OnboardingSalesConfirmed />,
                children: [
                  { path: "ingredients", element: <CoreIngredientsPage /> },
                  { path: "recipes", element: <RecipeDraftPage /> },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
]);
