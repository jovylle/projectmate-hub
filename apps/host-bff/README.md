# Host BFF (planned)

Reference implementation for a **host-owned backend** that:

1. Verifies the host site's existing auth session
2. Maps it to `@projectmate-hub/shared-types` session shape
3. Proxies community reads/writes to the hub API

This app is intentionally host-specific — each customer wires their own auth adapter (NextAuth, Supabase, custom JWT, etc.).

See [docs/host-integration.md](../../docs/host-integration.md).
