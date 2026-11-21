import { createBrowserRouter } from "react-router";

import App from "@/App";
import { HomePage } from "@/pages/home/HomePage";
import { IngredientsPage } from "@/pages/ingredients/IngredientsPage";
import { ReceiptFlowPage } from "@/pages/ingredients/ReceiptFlowPage";

// URL 과 화면을 연결하는 목록. 페이지가 생기면 여기에 한 줄씩 추가한다.
export const router = createBrowserRouter([
  { path: "/", element: <App /> },
  { path: "/home", element: <HomePage /> },
  { path: "/ingredients", element: <IngredientsPage /> },
  { path: "/receipt", element: <ReceiptFlowPage /> },
]);
