# Roadmap

## Phase 0 — Scaffold (current)

- [x] Repo + product boundary README
- [x] Monorepo layout
- [x] `@projectmate-hub/shared-types` session/capability schemas
- [x] Link from embed README

## Phase 1 — Host session bridge

- [ ] `PM_HOST_SESSION` protocol in embed SDK (embedded-app repo)
- [ ] `ProjectMate.setSession()` helper on host
- [ ] Overlay shows "posting as …" and gates moderation UI by capabilities

## Phase 2 — Host BFF template

- [ ] Reference BFF in `apps/host-bff` (Node/Hono or framework-agnostic handlers)
- [ ] Session verification adapter interface (bring your own auth)
- [ ] Proxy to hub API with server credentials

## Phase 3 — Hub API

- [ ] Threads + replies data model
- [ ] Activity feed
- [ ] Server-side moderation
- [ ] Workspace scoping by `projectId` / `hostId`

## Phase 4 — Lively UX

- [ ] Polling or SSE for live updates
- [ ] Reactions / votes (optional)
- [ ] Notifications hooks for host apps
