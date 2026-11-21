import { createBrowserRouter } from "react-router";

import { RequireStore } from "@/components/RequireStore";
import { HomePage } from "@/pages/home/HomePage";
import { MyPage } from "@/pages/my/MyPage";
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
import { OrderEditPage } from "@/pages/order/OrderEditPage";
import { OrderPage } from "@/pages/order/OrderPage";
import { OrderSharePage } from "@/pages/order/OrderSharePage";
import { ReceiptPhotoPage } from "@/pages/onboarding/ReceiptPhotoPage";
import { RecipeDraftPage } from "@/pages/onboarding/RecipeDraftPage";
import { SalesColumnsPage } from "@/pages/onboarding/SalesColumnsPage";
import { SalesUploadPage } from "@/pages/onboarding/SalesUploadPage";
import { SignUpPage } from "@/pages/onboarding/SignUpPage";
import { StoreInfoPage } from "@/pages/onboarding/StoreInfoPage";

export const router = createBrowserRouter([
  { path: "/", element: <LoginPage /> },
  { path: "/signup", element: <SignUpPage /> },
  {
    // 가게 id가 필요한 앱 화면. 로그인한 계정의 가게를 불러온 뒤에 그린다.
    element: <RequireStore />,
    children: [
      { path: "/home", element: <HomePage /> },
      { path: "/ingredients", element: <IngredientsPage /> },
      { path: "/ingredients/recipes/:menuId", element: <RecipeEditPage /> },
      { path: "/ingredients/:ingredientId/price", element: <IngredientPriceFormPage /> },
      { path: "/ingredients/menus/new", element: <MenuAddPage /> },
      { path: "/ingredients/menus/review", element: <MenuReviewPage /> },
      { path: "/receipt", element: <ReceiptFlowPage /> },
      { path: "/order", element: <OrderPage /> },
      { path: "/order/new", element: <OrderEditPage /> },
      { path: "/order/share", element: <OrderSharePage /> },
      { path: "/my", element: <MyPage /> },
    ],
  },
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
