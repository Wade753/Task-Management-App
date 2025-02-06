import { z } from "zod"

export const postSchema = z.object({
  id: z.string(),
  title: z.string(),
  content: z.string(),
  author: z.string(),
  createdAt: z.string(),
})

export type PostType = z.infer<typeof postSchema>

