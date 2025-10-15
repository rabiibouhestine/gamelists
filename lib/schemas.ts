import { z } from "zod";

export const GameSchema = z.object({
  igdb_id: z.number(),
  name: z.string(),
  slug: z.string(),
  image_id: z.string().nullable().optional(),
  first_release_date: z.number(),
});

const toBoolean = z
  .union([z.string(), z.boolean()])
  .transform((val) => (typeof val === "string" ? val === "true" : val));

export const CreateListSchema = z.object({
  name: z.string().min(1, "Name is required!"),
  description: z.string().optional(),
  is_public: toBoolean,
  is_ranked: toBoolean,
  games: z.array(GameSchema).min(1, "A list should have at least one game!"),
});

export type CreateListInput = z.infer<typeof CreateListSchema>;
