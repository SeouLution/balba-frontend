#!/bin/bash
# AI가 수정한 src/ 아래 TS 파일 하나만 eslint로 검사한다. 실패하면 exit 2로 결과를 AI에게 돌려준다.
FILE_PATH=$(node -e 'let s="";process.stdin.on("data",d=>s+=d).on("end",()=>{try{console.log(JSON.parse(s).tool_input?.file_path??"")}catch{}})')

if [[ ! "$FILE_PATH" =~ /src/.*\.(ts|tsx)$ ]]; then
  exit 0
fi

cd "$CLAUDE_PROJECT_DIR" || exit 0

if ! OUTPUT=$(npx eslint --max-warnings 0 "$FILE_PATH" 2>&1); then
  echo "## ESLint 실패: $FILE_PATH" >&2
  echo "$OUTPUT" >&2
  exit 2
fi

exit 0
