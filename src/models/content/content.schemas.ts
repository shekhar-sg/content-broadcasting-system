import { z } from "zod";
import { Constants } from "../../common/utils/constants.util";
import {ContentStatus} from "./content.contracts";

export const ContentSchemas = {
  create: z
    .object({
      title: z.string().trim().min(1).max(150),
      subject: z.enum(Constants.SUBJECTS),
      description: z.string().trim().max(1000).optional(),
      startTime: z.iso.datetime().optional(),
      endTime: z.iso.datetime().optional(),
      rotationDuration: z.coerce.number().int().min(1).max(1440).default(5),
    })
    .superRefine((value, ctx) => {
      const hasStart = Boolean(value.startTime);
      const hasEnd = Boolean(value.endTime);

      if (hasStart !== hasEnd) {
        ctx.addIssue({
          code: "custom",
          message: "Start time and end time must be provided together",
          path: hasStart ? ["endTime"] : ["startTime"],
        });
        return;
      }

      if (value.startTime && value.endTime) {
        const startTime = new Date(value.startTime);
        const endTime = new Date(value.endTime);

        if (endTime <= startTime) {
          ctx.addIssue({
            code: "custom",
            message: "End time must be after start time",
            path: ["endTime"],
          });
        }
      }
    }),
  listQuery: z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(10),
    subject: z.enum(Constants.SUBJECTS).optional(),
    status: z.enum(ContentStatus).optional(),
    teacherId: z.uuid().optional(),
  }),
};

export type CreateContentInput = z.infer<typeof ContentSchemas.create>;
export type ListQueryInput = z.infer<typeof ContentSchemas.listQuery>;
