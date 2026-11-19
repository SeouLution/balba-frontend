---
name: pr
description: Create a pull request with auto-generated title and description
disable-model-invocation: true
---
 
# Create Pull Request
 
해커톤용 PR 생성 스킬. 리뷰어가 30초 안에 훑고 머지할 수 있는 PR이 목표.
 
## 1. Determine Base Branch
 
- `$ARGUMENTS`가 있으면 (예: `/pr dev`) 그 브랜치를 base로 사용
- 없으면 `main`
## 2. Gather Information (run in parallel)
 
- `git fetch origin <base>`
- `git status` — 커밋 안 된 변경 확인
- `git branch --show-current`
- `git log --oneline origin/<base>..HEAD`
- `git diff --stat origin/<base>...HEAD` — **파일별 변경 요약 (ground truth)**
- `git diff origin/<base>...HEAD` — 상세 diff
- `git rev-parse --abbrev-ref @{upstream} 2>/dev/null` — 원격 추적 브랜치 확인
> 항상 로컬 `<base>`가 아닌 `origin/<base>`와 비교.
 
## 3. Analyze Changes (작성 전에)
 
### 3a. File Inventory
 
`--stat`의 파일 목록이 정답. 이 목록 밖의 파일은 변경 없음.
 
### 3b. 파일별 한 줄 메모
 
full diff에서 각 파일의 실제 변경을 한 줄로 메모. 화면 단위로 그룹핑:
 
- 시작하기 / 홈 / 발주 / 재료 / 할인
- 공통 컴포넌트 (`src/components/**`)
- 예측·발주 계산 로직 (`src/lib/**`, `src/utils/**` 등)
- 데이터·목업 (엑셀 파싱, 예시 단가 등)
- 설정 (라우터, Tailwind, 빌드 설정)
### 3c. 근거 없는 내용 버리기
 
- 커밋 메시지·브랜치명은 맥락일 뿐. diff에 없으면 미포함.
- 불확실하면 diff 재확인.

### 3d. 스크린샷 라우트 추론 (UI 변경 시)

UI 변경(페이지/컴포넌트/스타일)이 diff에 있으면 영향받는 화면 URL 추론:

- `src/pages/**` 변경 → `src/router.tsx`에서 해당 페이지가 연결된 라우트 URL
- `src/components/**` 공용 컴포넌트 변경 → 사용처를 grep으로 찾아 페이지 라우트로 역추적
- 동적 세그먼트(`:supplierId` 등)는 접근 가능한 실제 예시 값으로 치환. 모르면 사용자에게 질문.
- 바텀시트·모달처럼 버튼을 눌러야 보이는 상태 → `라우트 + 트리거 버튼 라벨`로 기록 (예: `/ → "만든 양 기록"`)
- 화면 ID를 알 수 있으면 함께 표기 (예: `2.8 행사 반영 발주`)

추론한 목록을 사용자에게 보여주고 **확인/수정을 받은 뒤** 다음 단계로. UI 변경이 없으면 이 단계 건너뜀.

## 4. Draft PR Content
 
**PR 제목과 본문은 전부 한국어.** (기술 용어는 영어 허용)
 
### 문체
 
- 전부 개조식. **명사 종결** ("발주 금액 계산 추가", "단가 없는 재료는 `-` 표시").
- 한 줄 = 한 가지 내용.
- `→` 체인은 최대 2단계.
### Title
 
70자 이내. 명사 종결. 앞에 화면명 붙이기 (예: `[발주] 재료별 발주량·예상 금액 계산 추가`).
 
### Body
 
```markdown
## ✒\u{fe0f} 개요
 
변경 목적 1~2문장. (diff 기반 사실만)
 
## ⚙\u{fe0f} 주요 변경 사항
 
- **화면/영역명**
  - 무엇이 어떻게 바뀌었는지
 
## 📸 스크린샷

| 화면 | 경로 | 스크린샷 |
|---|---|---|
| 2.8 행사 반영 발주 | `/orders/:supplierId` | <!-- 이미지 붙여넣기 --> |

> 3d에서 확인받은 목록으로 표 작성. 이미지는 PR 생성 후 작성자가 직접 드래그해서 붙임.
> UI 변경이 없으면 표 없이 `- 해당 없음`.
 
## 🔗 추가 라이브러리
 
- `package.json` 의존성 변경 시 추가된 라이브러리 나열. 없으면 `- 없음`.
 
## 💬 리뷰어 참고
 
- 목업·하드코딩한 값, 다른 팀원 작업과 겹치는 파일, 임시로 넘긴 부분. 없으면 `- 없음`.
 
## ✔\u{fe0f} 확인 방법
 
- [ ] 조건 → 기대 결과 형태로 1줄 1시나리오
- [ ] 빌드 통과하는지 확인
 
🤖 Generated with [Claude Code](https://claude.com/claude-code)
```
 
### 확인 방법 작성
 
- **체크박스 1개 = 시나리오 1개.**
- **조건 → 기대 결과** 형태. 예: `예측 50줄 입력 → 계란 1판 · 7,900원 표시되는지 확인`
- 주요 변경 사항과 1:1 대응.
- 마지막 줄은 항상 빌드 확인 (`package.json`의 lockfile에 맞는 매니저로 `build` 스크립트).
## 5. Cross-Validate
 
- 주요 변경 사항이 `--stat` 파일과 대응되는지.
- `package.json` diff가 없는데 라이브러리를 언급하지 않았는지.
- 📸 스크린샷: UI 변경이 있는데 표가 빠지지 않았는지, 표의 경로가 3d에서 확인받은 목록과 일치하는지.
- 💬 리뷰어 참고 섹션에 **공통 컴포넌트·라우터·공용 타입 변경**이 있으면 반드시 명시했는지 (다른 팀원 충돌 방지).
## 6. Push & Create PR
 
- 필요하면 push: `git push -u origin <branch>`
- PR 생성:
```bash
gh pr create --assignee "@me" --base <base> --title "the title" --body "$(cat <<'EOF'
PR body here
EOF
)"
```
 
## 7. Output
 
- PR URL 출력
- 📸 표가 있으면 "PR 페이지에서 스크린샷을 붙여주세요"라고 안내
## Rules
 
- NEVER force push
- 커밋 안 된 변경이 있으면 경고하고 먼저 커밋할지 질문
- 브랜치의 모든 커밋 분석 (마지막 커밋만 보지 않기)
 