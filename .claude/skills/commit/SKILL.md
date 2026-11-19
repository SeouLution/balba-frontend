---
name: commit
description: 변경사항을 분석해서 팀 컨벤션에 맞는 git 커밋을 생성한다
disable-model-invocation: true
---

# Git Commit

When the user runs `/commit`, analyze the current changes and create a commit following the conventions below.

## 1. Gather Information (run in parallel)

- `git status` — see all untracked and modified files and the current branch
- `git diff` and `git diff --cached` — see staged and unstaged changes
- `git log --oneline -10` — see recent commit message style (type/scope usage only)

## 2. Branch guard

- If the current branch is `main`, warn the user that pushing `main` deploys to production immediately, and ask whether to continue or create a working branch first (e.g. `feat/...`, `fix/...`, `chore/...`).

## 3. Pre-commit check

- If any `src/**/*.{ts,tsx}` or config files changed, run `npm run build` (and `npm run lint` if the script exists) before committing.
- If it fails, show the error, fix it or guide the user, and do not commit until it passes.

## 4. Allowed commit types

You must use one of the following types:

- **feat**: New feature
- **fix**: Bug fix
- **refactor**: Code refactoring without behavior change
- **style**: Formatting, missing semicolons, etc. (no logic change)
- **chore**: Package config, dependency installs, misc setup
- **build**: Build system changes (Vite, Docker, etc.)
- **ci**: CI/CD configuration changes (GitHub Actions)
- **docs**: Documentation changes
- **perf**: Performance improvement
- **revert**: Revert a previous commit
- **test**: Test additions or modifications

## 5. Core commit principles

- **One commit, one logical change (atomic commit)**: Each commit should contain a single independent logical unit. If several concerns are mixed, propose splitting into separate commits.
- **Separate dependency/setup work**: Library installs, shared constants/types, and shared utility functions must be committed separately from feature implementation commits.
- **State scope explicitly**: Use a scope that reflects the domain or folder name (e.g. api, pages, components, shared, deps, lint).

## 6. Message guidelines

- **Format**: `<type>(<scope>): <subject>`
- **Language**: 한국어(Korean). Use English for technical terms.
- **Ending**: noun phrase (명사 종결). Never `~한다` / `~함` / `~하기` verb endings, and drop the object particle with them.
  - `feat(order): 발주 목록 페이지 추가` ✅
  - `feat(order): 발주 목록 페이지를 추가한다` ❌
- Examples:
  - `chore(deps): TanStack Query 추가`
  - `chore(lint): ESLint, Prettier 설정 추가`
  - `refactor(shared): API 응답 공통 타입 선언`
  - `fix(api): health 체크 실패 시 에러 처리 수정`

## 7. Stage & Commit

- Identify which files should be staged (skip `.env*`, credentials, or large binaries)
- Stage relevant files by name (prefer specific files over `git add -A`)
- If multiple logical changes exist, propose splitting into separate commits
- If a body is needed, write it in Korean with the same noun-phrase endings as the subject
- Create the commit using a HEREDOC:

```
git commit -m "$(cat <<'EOF'
type(scope): subject

Optional body explaining why.
EOF
)"
```

## 8. Verify

- Run `git status` to confirm the commit succeeded
- Show the commit with `git log --oneline -1`

## Rules

- NEVER amend existing commits unless explicitly asked
- NEVER push to remote
- NEVER use `--no-verify`
- If a pre-commit hook fails, fix the issue and create a NEW commit
- If `$ARGUMENTS` is provided, use it as guidance for the commit message