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

## Status

Early scaffold — architecture and API contracts are being defined before implementation.

## Related

- Embed overlay: https://github.com/jovylle/projectmate-embedded-app
