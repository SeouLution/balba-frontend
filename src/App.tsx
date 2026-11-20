import { useHealth } from "@/hooks/useHealth";

export default function App() {
  const { isPending, isError } = useHealth();

  const apiState = isPending ? "확인 중" : isError ? "연결 실패" : "정상";

  return (
    <main style={{ fontFamily: "system-ui, sans-serif", padding: "2rem" }}>
      <h1>발주바주</h1>
      <p>백엔드 API: {apiState}</p>
    </main>
  );
}
