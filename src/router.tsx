import { createBrowserRouter } from "react-router";

import { HomePage } from "@/pages/home/HomePage";
import { IngredientPriceFormPage } from "@/pages/ingredients/IngredientPriceFormPage";
import { IngredientsPage } from "@/pages/ingredients/IngredientsPage";
import { MenuAddPage } from "@/pages/ingredients/MenuAddPage";
import { MenuReviewPage } from "@/pages/ingredients/MenuReviewPage";
import { ReceiptFlowPage } from "@/pages/ingredients/ReceiptFlowPage";
import { RecipeEditPage } from "@/pages/ingredients/RecipeEditPage";
import { CoreIngredientsPage } from "@/pages/onboarding/CoreIngredientsPage";
import { IngredientLoadingPage } from "@/pages/onboarding/IngredientLoadingPage";
import { LoginPage } from "@/pages/onboarding/LoginPage";
import { OnboardingCompletePage } from "@/pages/onboarding/OnboardingCompletePage";
import {
  OnboardingLayout,
  OnboardingFileRequired,
  OnboardingSalesConfirmed,
  OnboardingStoreRequired,
} from "@/pages/onboarding/OnboardingLayout";
import { OnboardingStartPage } from "@/pages/onboarding/OnboardingStartPage";
import { ReceiptPhotoPage } from "@/pages/onboarding/ReceiptPhotoPage";
import { RecipeDraftPage } from "@/pages/onboarding/RecipeDraftPage";
import { SalesColumnsPage } from "@/pages/onboarding/SalesColumnsPage";
import { SalesUploadPage } from "@/pages/onboarding/SalesUploadPage";
import { SignUpPage } from "@/pages/onboarding/SignUpPage";
import { StoreInfoPage } from "@/pages/onboarding/StoreInfoPage";

export const router = createBrowserRouter([
  { path: "/", element: <LoginPage /> },
  { path: "/signup", element: <SignUpPage /> },
  { path: "/home", element: <HomePage /> },
  { path: "/ingredients", element: <IngredientsPage /> },
  { path: "/ingredients/recipes/:menuId", element: <RecipeEditPage /> },
  { path: "/ingredients/:ingredientId/price", element: <IngredientPriceFormPage /> },
  { path: "/ingredients/menus/new", element: <MenuAddPage /> },
  { path: "/ingredients/menus/review", element: <MenuReviewPage /> },
  { path: "/receipt", element: <ReceiptFlowPage /> },
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
          { path: "receipt", element: <ReceiptPhotoPage /> },
          {
            element: <OnboardingFileRequired />,
            children: [
              { path: "columns", element: <SalesColumnsPage /> },
              {
                element: <OnboardingSalesConfirmed />,
                children: [
                  { path: "ingredients", element: <CoreIngredientsPage /> },
                  { path: "ingredients/loading", element: <IngredientLoadingPage /> },
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
