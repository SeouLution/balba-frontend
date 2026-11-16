# balba-frontend

발주바주 프론트엔드 (React + Vite).

## 로컬 실행

```bash
npm ci
echo "VITE_API_URL=http://localhost:8000" > .env.local
npm run dev        # http://localhost:5173
npm run build      # 타입 검사 + 프로덕션 빌드
```

## 배포

`main`에 푸시하면 GitHub Actions가 빌드 확인 → ARM64 이미지 빌드(GHCR) → 서버 배포까지 자동으로 진행한다.
운영 주소: https://balba.duckdns.org

- API 주소는 레포 Variables 의 `VITE_API_URL` 값이 빌드 시점에 번들에 들어간다. 바꾸면 재배포해야 반영된다.
- 컨테이너는 **80 포트**로 정적 파일을 서빙한다 (`Caddyfile`). 없는 경로는 `index.html` 로 넘겨 SPA 라우팅이 동작한다.
- `/version.txt` 에 배포된 커밋 SHA 가 들어 있다.

PR에서는 빌드만 확인한다.
