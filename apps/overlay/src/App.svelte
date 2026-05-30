<script lang="ts">
  import { onMount } from "svelte";
  import {
    hostToIframeMessageSchema,
    PROTOCOL_VERSION,
    type HostSession,
  } from "@projectmate-hub/shared-types";

  let parentOrigin = $state<string | null>(null);
  let hostSession = $state<HostSession | null>(null);
  let hostSessionBridgeActive = $state(false);
  let loadError = $state<string | null>(null);

  const canPost = $derived(hostSession?.capabilities.canPost ?? false);
  const canModerate = $derived(hostSession?.capabilities.canModerate ?? false);
  const canViewModeration = $derived(hostSession?.capabilities.canViewModeration ?? false);

  const postingAsLabel = $derived.by(() => {
    if (!hostSessionBridgeActive) return null;
    if (!hostSession) return "Guest";
    return hostSession.user.displayName;
  });

  function postToParent(msg: { type: string; payload?: unknown }) {
    if (!parentOrigin) return;
    window.parent.postMessage({ v: PROTOCOL_VERSION, ...msg }, parentOrigin);
  }

  onMount(() => {
    const handler = (event: MessageEvent) => {
      if (!parentOrigin && event.data?.type === "PM_HOST_SESSION") {
        parentOrigin = event.origin;
      } else if (parentOrigin && event.origin !== parentOrigin) {
        return;
      }

      const parsed = hostToIframeMessageSchema.safeParse(event.data);
      if (!parsed.success) return;

      if (parsed.data.type === "PM_HOST_SESSION") {
        hostSessionBridgeActive = true;
        hostSession = parsed.data.payload.session;
        if (!parentOrigin) parentOrigin = event.origin;
        postToParent({ type: "PM_READY" });
      }
    };

    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
  });
</script>

{#if loadError}
  <div class="pm-shell pm-center">
    <p>{loadError}</p>
  </div>
{:else}
  <div class="pm-shell">
    <header class="pm-header">
      <h1>Community hub</h1>
      <p class="pm-lead">Session bridge preview — threads and activity feed land in later phases.</p>
    </header>

    {#if postingAsLabel !== null}
      <section class="pm-session" class:pm-session--guest={!hostSession}>
        {#if hostSession?.user.avatarUrl}
          <img class="pm-avatar" src={hostSession.user.avatarUrl} alt="" />
        {:else}
          <span class="pm-avatar pm-avatar--placeholder" aria-hidden="true">
            {postingAsLabel.slice(0, 1).toUpperCase()}
          </span>
        {/if}
        <div>
          <div class="pm-kicker">Posting as</div>
          <div class="pm-name">{postingAsLabel}</div>
          {#if !hostSession}
            <p class="pm-hint">Sign in on the host site, then call <code>ProjectMateHub.setSession(...)</code>.</p>
          {/if}
        </div>
      </section>
    {:else}
      <p class="pm-note">Waiting for <code>PM_HOST_SESSION</code> from the host page…</p>
    {/if}

    <section class="pm-capabilities">
      <h2>Capabilities</h2>
      <ul>
        <li class:enabled={canPost}>Post / report</li>
        <li class:enabled={canViewModeration}>View moderation</li>
        <li class:enabled={canModerate}>Moderate</li>
      </ul>
    </section>

    {#if hostSessionBridgeActive && !canPost}
      <p class="pm-warn">Posting is disabled for this account.</p>
    {/if}

    {#if hostSessionBridgeActive && canViewModeration && !canModerate}
      <p class="pm-note">Moderation is view-only for your account.</p>
    {/if}
  </div>
{/if}

<style>
  .pm-shell {
    min-height: 100%;
    padding: 1.25rem;
    box-sizing: border-box;
    font-family:
      ui-sans-serif,
      system-ui,
      -apple-system,
      Segoe UI,
      Roboto,
      Helvetica,
      Arial,
      sans-serif;
    background: var(--pm-bg);
    color: var(--pm-text);
  }

  .pm-center {
    display: grid;
    place-items: center;
  }

  .pm-header h1 {
    margin: 0 0 0.35rem;
    font-size: 1.35rem;
  }

  .pm-lead {
    margin: 0 0 1rem;
    color: var(--pm-muted);
    line-height: 1.5;
  }

  .pm-session {
    display: flex;
    gap: 0.75rem;
    align-items: center;
    border: 1px solid var(--pm-border);
    border-radius: 0.75rem;
    background: var(--pm-panel);
    padding: 0.85rem 1rem;
    margin-bottom: 1rem;
  }

  .pm-session--guest {
    border-style: dashed;
  }

  .pm-avatar {
    width: 2.25rem;
    height: 2.25rem;
    border-radius: 999px;
    object-fit: cover;
    flex-shrink: 0;
  }

  .pm-avatar--placeholder {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    background: color-mix(in oklab, var(--pm-accent) 18%, var(--pm-bg));
    font-weight: 700;
  }

  .pm-kicker {
    font-size: 0.7rem;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    color: var(--pm-muted);
  }

  .pm-name {
    font-weight: 700;
    font-size: 1rem;
  }

  .pm-hint {
    margin: 0.35rem 0 0;
    font-size: 0.8rem;
    color: var(--pm-muted);
  }

  .pm-capabilities {
    border: 1px solid var(--pm-border);
    border-radius: 0.75rem;
    background: var(--pm-panel);
    padding: 0.75rem 1rem;
  }

  .pm-capabilities h2 {
    margin: 0 0 0.5rem;
    font-size: 0.95rem;
  }

  .pm-capabilities ul {
    margin: 0;
    padding-left: 1.1rem;
    color: var(--pm-muted);
  }

  .pm-capabilities li.enabled {
    color: var(--pm-text);
    font-weight: 600;
  }

  .pm-note,
  .pm-warn {
    margin-top: 1rem;
    font-size: 0.9rem;
    border-radius: 0.6rem;
    padding: 0.75rem 0.9rem;
    border: 1px solid var(--pm-border);
    background: var(--pm-panel);
  }

  .pm-warn {
    border-color: color-mix(in oklab, #f59e0b 40%, var(--pm-border));
  }
</style>
