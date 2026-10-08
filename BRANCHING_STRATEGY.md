# Konnector AI - Git Branching Strategy & Workflow Guide

This document defines the formal branching model, commit conventions, and release governance for **Konnector AI**. All engineers and automated CI/CD agents must strictly follow these standards.

---

## 1. Branch Hierarchy

```
[main] ─────────────────────●───────────────●───────────── (Production: v1.0.0, v1.1.0)
                            ▲               ▲
                            │ [release/*]   │ [hotfix/*]
                            │               │
[develop] ──────●───────────┴───────●───────┴───────────── (Integration / Staging)
                ▲                   ▲
                │ [feature/*]       │ [feature/*]
                │                   │
```

| Branch | Base | Target | Purpose | Protection Rules |
|---|---|---|---|---|
| `main` | - | - | Production-ready code only. Triggers automated deployment to GCP Cloud Run. | **Enforced**: 2 Approvals, CI checks must pass, no force-push, signed commits. |
| `develop` | `main` | `main` | Integration branch for upcoming minor/major releases. Staging deploys. | **Enforced**: 1 Approval, CI checks must pass, linear history. |
| `feature/*` | `develop` | `develop` | New features, AI enhancements, module additions. | Short-lived (max 3 days). Squashed upon PR merge. |
| `release/*` | `develop` | `main` & `develop` | Pre-production stabilization, version bumping, changelog creation. | Bug fixes only. Merged into `main` and back to `develop`. |
| `hotfix/*` | `main` | `main` & `develop` | Critical production incident fixes (P0 security/outage). | Tagged immediately with patch bump (`v1.0.1`). |

---

## 2. Branch Naming Conventions

All branches must follow lowercase kebab-case with ticket/task prefixes:

```bash
# Features
feature/wa-audio-transcription
feature/gemini-2-5-pro-reasoning
feature/razorpay-subscription-webhook
feature/lead-kanban-drag-and-drop

# Bug Fixes
fix/timezone-appointment-offset
fix/prompt-injection-regex-bypass
fix/redis-session-leak

# Releases
release/v1.1.0
release/v1.2.0

# Hotfixes
hotfix/v1.0.1-meta-webhook-handshake
hotfix/v1.0.2-cloud-armor-rate-limit
```

---

## 3. Conventional Commit Specification

We follow the **Conventional Commits v1.0.0** standard:

```
<type>(<optional scope>): <subject in present tense>

[optional body]

[optional footer(s)]
```

### Supported Types:
- `feat`: A new feature for the user or platform (e.g. `feat(whatsapp): add interactive list messages support`).
- `fix`: A bug fix (e.g. `fix(leads): resolve score calculation overflow`).
- `perf`: A code change that improves performance (e.g. `perf(rag): cache vector embeddings in Memorystore Redis`).
- `refactor`: Code change that neither fixes a bug nor adds a feature (e.g. `refactor(auth): simplify JWT payload extraction`).
- `test`: Adding or correcting automated tests (e.g. `test(ai-engine): add prompt injection unit test cases`).
- `docs`: Documentation updates only (e.g. `docs(api): update swagger spec for handoff tickets`).
- `chore`: Updating build scripts, dependencies, or toolchains (e.g. `chore(deps): bump @google/generative-ai to 0.21.0`).
- `ci`: CI/CD pipeline changes (e.g. `ci(cloudbuild): add automated Cloud Run migration step`).

---

## 4. Pull Request & Code Review Checklist

Before opening a Pull Request:
1. Ensure your local branch is rebased on top of `develop`:
   ```bash
   git fetch origin
   git rebase origin/develop
   ```
2. Run automated test suites:
   ```bash
   cd apps/backend && npm run test
   cd ../frontend && npm run build
   ```
3. Verify PR template checklist:
   - [ ] Unit tests added for all new business logic.
   - [ ] No hardcoded secrets, API keys, or tenant IDs.
   - [ ] Prisma migrations generated and validated if schema was modified.
   - [ ] Swagger API decorators added for new endpoints.
   - [ ] Zero linting errors and clean TypeScript typecheck.

---

## 5. Release & Tagging Process

1. Create a release branch from `develop`:
   ```bash
   git checkout develop
   git pull origin develop
   git checkout -b release/v1.1.0
   ```
2. Bump version in `package.json` files and commit:
   ```bash
   git commit -am "chore(release): bump version to 1.1.0"
   ```
3. Merge `release/v1.1.0` into `main` via PR with approval.
4. Create an annotated Git tag on `main`:
   ```bash
   git tag -a v1.1.0 -m "Release v1.1.0: Gemini 2.5 Flash & WhatsApp Omnichannel Inbox"
   git push origin v1.1.0
   ```
5. GitHub Actions automatically executes `.github/workflows/deploy-gcp.yml` to deploy `v1.1.0` to Google Cloud Run with zero downtime.
