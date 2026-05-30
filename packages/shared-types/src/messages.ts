import { z } from "zod";
import { hostSessionSchema } from "./session.js";

export const PROTOCOL_VERSION = 1 as const;

/** Future embed → iframe message to refresh host auth context. */
export const hostSessionMessageSchema = z.object({
  v: z.literal(PROTOCOL_VERSION),
  type: z.literal("PM_HOST_SESSION"),
  payload: z.object({
    session: hostSessionSchema.nullable(),
  }),
});

export type HostSessionMessage = z.infer<typeof hostSessionMessageSchema>;
