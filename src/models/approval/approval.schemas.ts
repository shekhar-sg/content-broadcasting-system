import { z } from "zod";

export const ApprovalSchemas = {
  params: z.object({
    contentId: z.string().min(1),
  }),
  reject: z.object({
    reason: z.string().trim().min(1, "Rejection reason is required").max(500),
  }),
};
