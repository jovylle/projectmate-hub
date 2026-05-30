import {
  createHostSessionMessage,
  hostSessionSchema,
  type HostSession,
} from "@projectmate-hub/shared-types";

export type { HostSession };

const PM_ROOT = "[data-projectmate-root]";
const PM_IFRAME = "iframe.pm-frame";

let pendingSession: HostSession | null | undefined = undefined;
let registeredAppUrl: string | null = null;

export function findProjectMateIframe(): HTMLIFrameElement | null {
  const root = document.querySelector(PM_ROOT);
  const shadow = root?.shadowRoot;
  if (!shadow) return null;
  const iframe = shadow.querySelector(PM_IFRAME);
  return iframe instanceof HTMLIFrameElement ? iframe : null;
}

/** Post a validated `PM_HOST_SESSION` message to the overlay iframe. */
export function postHostSession(
  iframe: HTMLIFrameElement,
  overlayOrigin: string,
  session: HostSession | null,
): void {
  const target = iframe.contentWindow;
  if (!target) {
    throw new Error("ProjectMateHub.postHostSession: iframe is not ready");
  }
  const msg = createHostSessionMessage(session);
  target.postMessage(msg, overlayOrigin);
}

function overlayOriginFromAppUrl(appUrl: string): string {
  return new URL(appUrl).origin;
}

/**
 * Push host auth into the ProjectMate overlay.
 * Works with the embed from [projectmate-embedded-app](https://github.com/jovylle/projectmate-embedded-app)
 * once `ProjectMate.init({ appUrl })` has created the iframe (overlay open or after first load).
 */
export function setSession(session: HostSession | null, appUrl?: string): void {
  const normalized = session === null ? null : hostSessionSchema.parse(session);
  pendingSession = normalized;

  const url = appUrl ?? registeredAppUrl;
  if (url) registeredAppUrl = url;

  if (!url) {
    console.warn(
      "ProjectMateHub.setSession: pass appUrl (same as ProjectMate.init) until the embed iframe exists",
    );
    return;
  }

  const iframe = findProjectMateIframe();
  if (!iframe) return;

  postHostSession(iframe, overlayOriginFromAppUrl(url), normalized);
}

/** Remember appUrl from init so later setSession() calls can omit it. */
export function registerAppUrl(appUrl: string): void {
  registeredAppUrl = appUrl;
  if (pendingSession !== undefined) {
    setSession(pendingSession, appUrl);
  }
}

export { createHostSessionMessage };
