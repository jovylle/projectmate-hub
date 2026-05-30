# Architecture

## Layers

```text
┌─────────────────────────────────────────────────────────┐
│ Host website (your app, your auth)                      │
│  - login/session                                        │
│  - ProjectMate.init(...)                                │
│  - optional: ProjectMate.setSession(...)                │
└───────────────────────────┬─────────────────────────────┘
                            │ postMessage (session snapshot)
┌───────────────────────────▼─────────────────────────────┐
│ projectmate-embedded-app (UI shell)                     │
│  - launcher + iframe overlay                            │
│  - About / Feedback / Updates / Issues tabs           │
└───────────────────────────┬─────────────────────────────┘
                            │ HTTPS (host BFF or signed token)
┌───────────────────────────▼─────────────────────────────┐
│ Host BFF (recommended)                                  │
│  - verifies host session                                │
│  - attaches user + roles server-side                    │
│  - proxies to hub API                                   │
└───────────────────────────┬─────────────────────────────┘
                            │
┌───────────────────────────▼─────────────────────────────┐
│ projectmate-hub API (this repo, planned)                │
│  - threads, replies, activity                           │
│  - moderation enforced by verified identity             │
└─────────────────────────────────────────────────────────┘
```

## Identity rule

The **host owns authentication**. ProjectMate overlay must not become a second login system for hosts that already have users.

Flow:

1. User logs in on the host as usual.
2. Host mints a session snapshot (`user`, `roles`, `capabilities`).
3. Embed passes snapshot to iframe via protocol message.
4. Overlay renders UI based on capabilities.
5. Writes go through host BFF (or host-signed JWT) — never trust client-only admin headers in production.

## Workspace scoping

Every record is scoped by:

- `projectId` — stable product/workspace id from `ProjectMate.init`
- `hostId` — optional tenant id from `config.host.id`

One shared hub API can serve many host sites when rows are partitioned this way.

## What stays in each repo

| Repo | Responsibility |
|------|----------------|
| [projectmate-embedded-app](https://github.com/jovylle/projectmate-embedded-app) | Embed SDK, overlay UI shell, simple issues reporting |
| **projectmate-hub** | Community data model, hub API, host BFF patterns, shared session types |
