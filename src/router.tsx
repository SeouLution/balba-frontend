import { createBrowserRouter, type RouteObject } from "react-router";

import App from "@/App";

// URL 과 화면을 연결하는 목록. 페이지가 생기면 여기에 한 줄씩 추가한다.
const routes: RouteObject[] = [{ path: "/", element: <App /> }];

if (import.meta.env.DEV) {
  routes.push({
    path: "/dev/components",
    lazy: async () => {
      const { ComponentsPreview } = await import("@/pages/dev/ComponentsPreview");
      return { Component: ComponentsPreview };
    },
  });
}

export const router = createBrowserRouter(routes);
