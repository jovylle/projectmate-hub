# projectmate-hub

Community hub layer for host websites — forum-style threads, activity, and moderation — designed to integrate with [ProjectMate embed](https://github.com/jovylle/projectmate-embedded-app).

## Why this exists

[`projectmate-embedded-app`](https://github.com/jovylle/projectmate-embedded-app) stays focused on being a **lightweight embedded support overlay** (About, Feedback, Updates, basic Issues). Hosts already using that embed should not be forced into a heavier community platform.

This repo is for the **next layer**: a lively hub inside the host site where logged-in users can participate, while the host keeps ownership of auth and user identity.

## Product boundary

| [projectmate-embedded-app](https://github.com/jovylle/projectmate-embedded-app) | projectmate-hub (this repo) |
|---|---|
| Universal embed shell (`embed.js` + iframe UI) | Community / forum experience |
| Config + `postMessage` bridge | Host auth bridge + session context |
| Optional simple issue reporting API | Threads, replies, activity feed, roles |
| Works on static sites | Expects a host backend (BFF) |
| Minimal setup | Richer UX, server-enforced permissions |

## Architecture (target)

```text
Host website (existing auth)
  └─ embed.js / ProjectMate overlay (UI shell)
       └─ host BFF (/api/community/…)
            └─ projectmate-hub API + storage
```

**Rule:** the host is the identity provider. ProjectMate does not run a second login inside the iframe unless a host explicitly wants standalone mode.

## Planned capabilities

- Host session bridge (user id, display name, roles, capabilities)
- Issue/thread model beyond one-shot reports
- Activity feed (new reports, resolutions, moderator actions)
- Server-side moderation (no client-spoofable admin headers)
- Workspace scoping via `projectId` / `host.id`

## Monorepo layout

| Path | Role |
|------|------|
| [`packages/shared-types`](packages/shared-types) | Host session + capability schemas (Zod) |
| [`apps/host-bff`](apps/host-bff) | Planned reference BFF for host auth bridge |
| [`apps/api`](apps/api) | Planned hub API (threads, activity, moderation) |
| [`docs/`](docs) | Architecture, host integration, roadmap |

## Quick start (maintainers)

```bash
pnpm install
pnpm build:types
```

## Docs

- [Architecture](docs/architecture.md)
- [Host integration](docs/host-integration.md)
- [Roadmap](docs/roadmap.md)

## Status

Phase 0 scaffold — shared types and docs are in place; BFF and hub API implementation next.

## Related

- Embed overlay: https://github.com/jovylle/projectmate-embedded-app
