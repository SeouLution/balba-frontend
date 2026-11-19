---
name: pr-review
description: PR 번호나 URL을 받아 버그·보안·성능·규칙 위반을 리뷰하고 🔴/🟡로 분류한다. 사용자가 PR 리뷰를 요청할 때 사용.
disable-model-invocation: true
---

# PR Review

해커톤용 PR 리뷰 스킬. main에 머지되면 바로 운영에 배포되므로, **머지 전에 시연을 깨뜨릴 문제를 거르는 것**이 목표.

## 1. PR 정보 가져오기

`$ARGUMENTS`에 PR 번호나 URL (예: `/pr-review 12`, Codex는 `$pr-review 12`). 없으면 `gh pr view --json number`로 현재 브랜치의 PR을 찾음.

- `gh pr view <number> --json title,body,baseRefName,headRefName,files,additions,deletions`
- `gh pr diff <number>` — 전체 diff
- `gh pr view <number> --json comments` — 기존 코멘트
- 루트 `AGENTS.md`를 읽어 프로젝트 규칙 로드

## 2. 변경 분석

### 분류 기준

**🔴 판정 원칙**: "시연이나 운영에서 사용자에게 실제 피해가 나는가?"

🔴 태그 (하나라도 해당하면 치명적): `[런타임 크래시]` `[보안]` `[데이터 오염]` `[기능 파괴]` `[레이스 컨디션]` `[빌드 파괴]` `[메모리 누수]`

- `[메모리 누수]`에 useEffect cleanup 누락, 이벤트 리스너·타이머·AbortController 미해제 포함
- 위 기준에 해당하지 않으면 🟡 제안 사항. 태그는 이슈당 1개.
- eslint, 타입체크(tsc), prettier가 자동으로 잡는 이슈는 리뷰 대상 제외.

### 분석 방법

**diff의 모든 변경 파일을 빠짐없이 분석.** 주요 파일만 보고 넘어가지 않음.

- **Correctness**: 로직 오류, null/undefined, 에러 처리, 비동기·레이스 컨디션
- **Security**: 민감 정보 노출(API 키·토큰 하드코딩, `.env` 커밋), XSS(`dangerouslySetInnerHTML`)
- **Performance**: 불필요한 리렌더, 잘못된 queryKey로 인한 중복 요청·캐시 오염, 번들 크기(xlsx 같은 큰 라이브러리를 첫 화면에서 import)
- **Cross-file**: 변경된 함수·타입·공통 컴포넌트의 사용처 영향, hook dependency array
- **Type quality**: `any`·`as`·`@ts-ignore` 남용, 서버 응답을 검증 없이 단언

### 발주바주 규칙 체크리스트

`AGENTS.md` 기준. 린터가 못 잡는 것만 봄.

- **API 계약**: 백엔드 `openapi.yaml`에 없는 응답 필드를 쓰거나 지어냈는지. 없는 값은 `TODO(api):` 주석이 있어야 함. 실제 응답에 없는 필드를 읽어 화면이 깨지면 🔴 `[기능 파괴]`
- **계산 중복**: 예측·발주·할인 절감액을 프론트에서 다시 계산하는지 (백엔드 값과 어긋남)
- **홈 전환**: 오늘/내일 화면을 프론트 시계로 판단하는지 (`getHome` 응답의 view를 따라야 함)
- **데이터 흐름**: 컴포넌트에서 `fetch` 직접 호출, 서버 데이터를 useState·전역 상태에 복사
- **화면 상태**: API를 쓰는 화면에 로딩·에러·빈 상태가 빠졌는지. 시연 중 빈 화면·무한 로딩이 되면 🔴 `[기능 파괴]`
- **스타일**: 화면 코드에 `#hex`·`bg-[#...]` 직접 사용, 조건부 className을 `cn()` 대신 템플릿 문자열로 연결
- **범위**: 기획서(`docs/SPEC.md`)에 없는 기능이나 후순위 화면이 들어왔는지
- **공통 파일 충돌**: `src/router.tsx`, `src/components/**`, `src/types/**`, `src/index.css` 변경은 다른 팀원 작업과 겹칠 수 있으므로 반드시 언급

**심각도**: 규칙 위반은 기본 🟡. 실제 시연·운영 피해로 이어지면 🔴로 상향.

발견한 이슈 개수 무제한. 있는 만큼 전부 보고.
출력 전, 발견한 모든 이슈의 "최악의 시나리오"를 내부적으로 검증. 구체적 피해를 서술할 수 있으면 🔴, 없으면 🟡.

### 리뷰 완료 전 점검 (출력에 포함하지 않음)

- 모든 변경 파일을 검토했는가?
- 삭제·변경된 함수·타입·공통 컴포넌트의 사용처를 확인했는가?
- 새 상태·props의 초기값과 엣지 케이스(null, 빈 배열, 0, 단가 없음)를 확인했는가?
- useEffect·이벤트 리스너·타이머의 cleanup이 있는가?
- PR 설명과 실제 구현이 일치하는가?

## 3. Output Format

**모든 리뷰 내용은 한국어.** (기술 용어는 영어 허용)

**문체: 전부 명사 종결(개조식).** "null 체크 누락으로 런타임 크래시", "cleanup 미등록"처럼. `~한다`·`~합니다`·해요체 금지.

```markdown
## PR 리뷰: #<number> — <title>

### 요약

PR이 하는 일 간략 설명.

### 🔴 치명적 이슈

각 이슈에 기준 태그 표시. `파일:줄` 위치와 수정 방법 포함.

### 🟡 제안 사항

블로커는 아닌 개선 사항. 규칙 위반은 `[규칙]` 표기 권장.

### 🟢 잘한 점

잘 작성된 부분.

### 판정

- 🔴가 1개 이상 → REQUEST_CHANGES
- 🔴 없음, 🟡만 존재 → COMMENT
- 🔴, 🟡 모두 없음 → APPROVE
```

## 4. PR에 게시

리뷰 출력 후 사용자에게 질문: "이 리뷰를 PR에 게시할까요? (approve / request-changes / comment / 취소)"

- 판정에 맞는 옵션을 기본값으로 제안
- 선택하면 게시:
  - `gh pr review <number> --approve --body "<리뷰 내용>"`
  - `gh pr review <number> --request-changes --body "<리뷰 내용>"`
  - `gh pr review <number> --comment --body "<리뷰 내용>"`
- "취소"면 게시하지 않음. **사용자 확인 없이 게시하지 않음.**

## Rules

- 파일명과 줄 번호를 구체적으로 명시
- 문제만 지적하지 말고 수정 방법 제안
- 기존 코드 패턴 존중
- 리뷰 중 코드를 수정하거나 커밋하지 않음
