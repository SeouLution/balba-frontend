import { createBrowserRouter } from "react-router";

import App from "@/App";

// URL 과 화면을 연결하는 목록. 페이지가 생기면 여기에 한 줄씩 추가한다.
export const router = createBrowserRouter([{ path: "/", element: <App /> }]);
