import { useEffect, useState } from "react";

// 빌드 시점에 주입된다. 로컬 개발에서는 .env.local 에 VITE_API_URL 을 적는다.
const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8000";

type ApiState = "확인 중" | "정상" | "연결 실패";

export default function App() {
  const [apiState, setApiState] = useState<ApiState>("확인 중");

  useEffect(() => {
    fetch(`${API_URL}/health`)
      .then((response) => setApiState(response.ok ? "정상" : "연결 실패"))
      .catch(() => setApiState("연결 실패"));
  }, []);

  return (
    <main style={{ fontFamily: "system-ui, sans-serif", padding: "2rem" }}>
      <h1>발주바주</h1>
      <p>백엔드 API: {apiState}</p>
    </main>
  );
}
