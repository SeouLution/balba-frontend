#!/bin/bash
# AI가 응답을 끝내기 전에 src/ 변경이 있으면 타입체크한다. 실패하면 exit 2로 끝내지 못하게 막는다.
STOP_HOOK_ACTIVE=$(node -e 'let s="";process.stdin.on("data",d=>s+=d).on("end",()=>{try{console.log(JSON.parse(s).stop_hook_active===true)}catch{console.log(false)}})')

# 이미 한 번 막혀서 다시 들어온 경우는 통과시켜 무한루프를 막는다
if [ "$STOP_HOOK_ACTIVE" = "true" ]; then
  exit 0
fi

cd "$CLAUDE_PROJECT_DIR" || exit 0

CHANGED=$(
  git diff --name-only 2>/dev/null
  git diff --name-only --cached 2>/dev/null
  git ls-files --others --exclude-standard 2>/dev/null
)

if ! echo "$CHANGED" | grep -qE '^src/.*\.(ts|tsx)$'; then
  exit 0
fi

if ! OUTPUT=$(npm run --silent typecheck 2>&1); then
  echo "## 타입체크 실패" >&2
  echo "$OUTPUT" >&2
  exit 2
fi

exit 0
