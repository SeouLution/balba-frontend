export const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

export class ApiError extends Error {
  readonly status: number;
  // 백엔드 Error 스키마의 code. 응답 본문이 JSON이 아니면 없다.
  readonly code?: string;

  constructor(status: number, code?: string) {
    super(code ? `API ${status} ${code}` : `API ${status}`);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
  }
}

async function readErrorCode(response: Response): Promise<string | undefined> {
  try {
    const body: unknown = await response.json();
    if (body && typeof body === "object" && "code" in body && typeof body.code === "string") {
      return body.code;
    }
  } catch {
    return undefined;
  }
  return undefined;
}

export async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, init);
  if (!response.ok) {
    throw new ApiError(response.status, await readErrorCode(response));
  }
  // 204는 본문이 없어서 json()을 부르면 실패한다.
  if (response.status === 204) {
    return undefined as T;
  }
  return (await response.json()) as T;
}
