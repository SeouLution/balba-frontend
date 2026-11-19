# 발주바주 프론트엔드

## 코드 수정 범위

**IMPORTANT — 사용자 프롬프트에 코드 작성·수정 지시가 있을 때만 파일을 수정한다.**

- 판별 기준은 프롬프트가 파일 상태 변경을 요구하는지다. "구현해", "고쳐", "바꿔", "적용해", "만들어"가 그런 요청이고, 질문·분석·리뷰·계획 요청·"어떻게 생각해?"는 아니다.
- 변경을 요구하지 않는 프롬프트에는 읽고 설명·제안만 한다.
- 커밋·푸시도 같다. 사용자가 명시적으로 요청할 때만 한다.
- 이 기준은 다른 어떤 지침보다 위에 있다.

## 프로젝트

동네 식당 사장님이 POS 매출 엑셀을 올리면 **내일 생산량 → 발주량 → 마감 할인**까지 추천해 주는 모바일 PWA. 해커톤 시연용 MVP다.

## 참고 문서

- 화면 작업 시: `docs/SPEC.md`에서 해당 **화면 ID**(예: 2.8, 4.1) 행의 "주요 내용/비고"를 먼저 읽는다.
- API 연결 시: `docs/screens.md`(화면 → 라우트 → API)와 백엔드 레포 `SeouLution/balba-backend`의 `openapi.yaml` 참고.
- 계산·정책이 궁금할 때: 백엔드 레포 `docs/spec/00-scope-and-decisions.md`(결정 원장 D01~D28) 참고.

## 백엔드 계약

- 응답 필드는 `openapi.yaml`에 있는 것만 쓴다. 화면에 필요한데 API에 없는 값은 지어내지 말고 `TODO(api):` 주석을 남긴 뒤 사용자에게 알린다.
- 예측·발주·할인 절감액 계산은 백엔드가 한다. 프론트에서 다시 계산하지 않는다.
- 앱 API는 `/v1` 아래, `/health`는 루트. 주소는 `import.meta.env.VITE_API_URL`(로컬은 `.env.local`).
- 홈 화면 오늘/내일 전환(KST 20:00 기준)은 프론트에서 시계로 판단하지 않고 `getHome` 응답의 view를 따른다. 시연 시각은 백엔드 `DEMO_NOW`로 고정한다.

## 커맨드

`npm run dev | build | typecheck | lint | format | format:check`

## 스택 주의점

- React 19, TypeScript strict, Vite 8. 경로 별칭 `@/*` → `src/*`.
- React Router 8: `react-router`에서 import한다(`react-router-dom` 아님). 라우트는 `src/router.tsx`에 모은다.
- TanStack Query 5: 서버 데이터를 useState나 전역 상태에 복사하지 않는다.
- Tailwind CSS 4: `tailwind.config.js` 없음. 색·폰트는 `src/index.css`의 `@theme` 토큰만 쓰고, 화면 코드에 `#hex`·`bg-[#...]`를 쓰지 않는다.
- 새 라이브러리는 설치 전에 사용자에게 묻는다.

## 폴더 구조

```
src/
  api/          # fetch 함수 + 요청/응답 타입
  hooks/        # useQuery/useMutation 훅
  components/   # 화면에 종속되지 않는 공통 UI
  pages/        # onboarding(1.x) home(2.x) order(발주) ingredients(3.x) discount(4.x)
  types/  utils/
```

- 데이터 흐름은 `api/` → `hooks/` → `pages/`. 컴포넌트에서 `fetch`를 직접 부르지 않는다.
- queryKey는 `[리소스, ...파라미터]`. 예: `["orderPlan", storeId, targetDate]`.
- 한 화면에서만 쓰는 컴포넌트는 그 페이지 폴더에 둔다. 두 곳 이상에서 쓰면 `components/`로 옮긴다.

## 코딩 스타일

- 컴포넌트는 함수 선언형(`function Foo()`), named export. 라우트에 연결하는 페이지 컴포넌트도 같다.
- 파일명은 컴포넌트 `.tsx`만 PascalCase, 나머지는 camelCase.
- Tailwind className은 상수로 빼지 않고 JSX `className=`에 그대로 쓴다. 중복이 거슬리면 요소를 작은 컴포넌트로 뺀다.
- 조건부·병합 className은 `cn()`(`@/utils/cn`, clsx + tailwind-merge)을 쓴다. 문자열 템플릿으로 이어 붙이지 않는다.
- 변수명은 담긴 것을 드러낸다. 주석은 이름으로 표현할 수 없는 것만 남긴다.

## 변경 범위

- 기획서에 없는 기능, 후순위 화면(2.9-1, 4.3, 4.6, 엑셀 등록 지연, 리포트 내용)은 지시가 없으면 만들지 않는다.
- 요청과 무관한 인접 코드·주석·포맷은 건드리지 않는다.
- 내 변경으로 쓰이지 않게 된 import·변수·함수는 제거한다.
- API를 쓰는 화면은 로딩·에러·빈 상태까지 처리한다.

## 배포 주의

`main`에 푸시하면 바로 운영(https://balba.duckdns.org)에 배포된다. `main`에서 직접 작업하지 않는다.
