import { useQuery } from "@tanstack/react-query";

// 빌드 시점에 주입된다. 로컬 개발에서는 .env.local 에 VITE_API_URL 을 적는다.
const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8000";

async function fetchHealth() {
  const response = await fetch(`${API_URL}/health`);
  if (!response.ok) {
    throw new Error(`health check failed: ${response.status}`);
  }
  return response;
}

export default function App() {
  const { isPending, isError } = useQuery({
    queryKey: ["health"],
    queryFn: fetchHealth,
    retry: false,
  });

  const apiState = isPending ? "확인 중" : isError ? "연결 실패" : "정상";

  return (
    <main style={{ fontFamily: "system-ui, sans-serif", padding: "2rem" }}>
      <h1>발주바주</h1>
      <p>백엔드 API: {apiState}</p>
    </main>
  );
}
