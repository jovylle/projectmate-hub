import { z } from "zod";
import { hostSessionSchema } from "./session.js";

export const PROTOCOL_VERSION = 1 as const;

/** Host page → iframe: push or clear host auth snapshot. */
export const hostSessionMessageSchema = z.object({
  v: z.literal(PROTOCOL_VERSION),
  type: z.literal("PM_HOST_SESSION"),
  payload: z.object({
    session: hostSessionSchema.nullable(),
  }),
});

export type HostSessionMessage = z.infer<typeof hostSessionMessageSchema>;

/** Host → iframe messages (hub-owned protocol surface). */
export const hostToIframeMessageSchema = z.discriminatedUnion("type", [hostSessionMessageSchema]);

export type HostToIframeMessage = z.infer<typeof hostToIframeMessageSchema>;

export const iframeToHostMessageSchema = z.discriminatedUnion("type", [
  z.object({
    v: z.literal(PROTOCOL_VERSION),
    type: z.literal("PM_READY"),
    payload: z.object({}).optional(),
  }),
]);

export type IframeToHostMessage = z.infer<typeof iframeToHostMessageSchema>;

export function createHostSessionMessage(session: z.infer<typeof hostSessionSchema> | null): HostSessionMessage {
  const normalized = session === null ? null : hostSessionSchema.parse(session);
  return hostSessionMessageSchema.parse({
    v: PROTOCOL_VERSION,
    type: "PM_HOST_SESSION",
    payload: { session: normalized },
  });
}
