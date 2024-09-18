import { z } from "zod";

const userPayloadSchema = z.object({
  userId: z.string(),
});

export type userPayload = z.infer<typeof userPayloadSchema>;
