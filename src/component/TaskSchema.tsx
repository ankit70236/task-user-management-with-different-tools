import { z } from "zod"

export const taskSchema = z.object({
  title: z
    .string()
    .min(1, "Title cannot be empty!")        // required
    .max(100, "Title too long!"),            // optional max length
  description: z
    .string()
    .max(500, "Description too long!")       // optional limit
    .optional(),
  // Backend: oneof pending | in_progress | done
  status: z.enum(["pending", "in_progress", "done"], {
    message: "Invalid status!",
  }),
})