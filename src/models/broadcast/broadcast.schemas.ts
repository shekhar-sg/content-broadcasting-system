import { z } from "zod";

export const BroadcastSchemas = {
  params: z.object({
    teacherId: z.string().min(1),
  }),
  query: z.object({
    subject: z.string().trim().toLowerCase().optional(),
  }),
};
