import { z } from "zod";
import { Constants } from "../../common/utils/constants.util";

export const BroadcastSchemas = {
  params: z.object({
    teacherId: z.string().trim().min(1, "Teacher ID is required"),
  }),
  query: z.object({
    subject: z.enum(Constants.SUBJECTS).optional(),
  }),
};

export type BroadcastParamsInput = z.infer<typeof BroadcastSchemas.params>;
export type BroadcastQueryInput = z.infer<typeof BroadcastSchemas.query>;

