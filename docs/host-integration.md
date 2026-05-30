# Host integration guide

Use this when your website **already has auth** and you want a community hub inside ProjectMate.

## Minimum host responsibilities

1. **Keep your existing login** — do not move credentials into `ProjectMate.init`.
2. **Provide session context** to the overlay when the user is logged in.
3. **Expose a BFF** (backend-for-frontend) that verifies the host session before calling hub APIs.

## Session snapshot shape

Defined in `@projectmate-hub/shared-types`:

```ts
{
  user: {
    id: "user_123",
    displayName: "Alex",
    email: "alex@example.com", // optional
    avatarUrl: "https://...",   // optional
    roles: ["member", "admin"]
  },
  capabilities: {
    canPost: true,
    canComment: true,
    canModerate: false,
    canViewModeration: false
  },
  issuedAt: "2026-05-30T14:00:00.000Z" // optional
}
```

## Recommended BFF routes (host-owned)

| Route | Purpose |
|-------|---------|
| `GET /api/community/session` | Return current user snapshot for overlay bootstrap |
| `GET /api/community/threads` | List threads for `projectId` |
| `POST /api/community/threads` | Create thread (requires host session) |
| `POST /api/community/threads/:id/replies` | Add reply |
| `PATCH /api/community/threads/:id/status` | Moderation (admin only, server-checked) |

The iframe should call **your** origin (`/api/community/...`), not the hub API directly, unless you issue short-lived host-signed JWTs.

## Example host page flow

```html
<script src="https://projectmate.uft1.com/embed.js"></script>
<script>
  ProjectMate.init({
    projectId: "acme-prod",
    appUrl: "https://projectmate.uft1.com/overlay/",
    features: { feedback: true, issues: true, about: true, updates: true },
    issuesEndpoint: "https://your-host.com/api/community", // BFF base URL
    host: { id: "acme-prod", name: "Acme", version: "1.0.0" },
  });

  ProjectMate.setSession(
    await fetch("/api/community/session").then((r) => (r.ok ? r.json() : null))
  );
</script>
```

## Security checklist

- [ ] Never put host session cookies inside the iframe cross-origin
- [ ] Never trust `x-projectmate-admin` headers from the browser in production
- [ ] Enforce roles on the host BFF before proxying writes
- [ ] Scope all data by `projectId` (+ `host.id` when multi-tenant)
